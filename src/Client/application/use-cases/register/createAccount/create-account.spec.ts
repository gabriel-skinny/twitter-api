import NotFoundCustomError from 'src/Client/application/errors/notFound';
import InMemoryPreUserRepositroy from 'src/Client/application/repositories/preUser/inMemoryPreUserRepository';
import InMemoryUserRepositroy from '../../../repositories/user/inMemoryUserRepository';
import AuthServiceStub from '../../../services/AuthServiceStub';
import { makePreUser } from '../../../tests/factories/makePreUser';
import ValidateAccountUseCase from './create-account-use-case';
import { makeUser } from 'src/Client/application/tests/factories/makeUser';
import AlreadyCreatedError from 'src/Client/application/errors/alreadyCreated';

const makeUseCaseSut = () => {
  const preUserRepository = new InMemoryPreUserRepositroy();
  const userRepository = new InMemoryUserRepositroy();
  const authService = new AuthServiceStub();

  const validateAccountUseCase = new ValidateAccountUseCase(
    preUserRepository,
    userRepository,
    authService,
  );

  return { validateAccountUseCase, preUserRepository, userRepository };
};

describe('Create Account Use Case', () => {
  it('should validate and create the account of a user and return a user token', async () => {
    const { validateAccountUseCase, userRepository, preUserRepository } =
      makeUseCaseSut();
    const preUser = makePreUser();

    await preUserRepository.save(preUser);

    const userToken = await validateAccountUseCase.execute(preUser.id);

    expect(userToken).toBeTruthy();
    expect(userRepository.userDatabase).toHaveLength(1);
    expect(userRepository.userDatabase[0].name).toBe(preUser.name);
    expect(userRepository.userDatabase[0].email).toBe(preUser.email);
  });

  it('should throw an error if user does not exists', async () => {
    const { validateAccountUseCase } = makeUseCaseSut();

    const validateEmailPromisse = validateAccountUseCase.execute('notExistsId');

    expect(validateEmailPromisse).rejects.toStrictEqual(
      new NotFoundCustomError('preUser'),
    );
  });

  it('should throw if a user already exists with that name', async () => {
    const { validateAccountUseCase, userRepository, preUserRepository } =
      makeUseCaseSut();

    const preUser = makePreUser();
    preUserRepository.save(preUser);

    const user = makeUser({ name: preUser.name });
    await userRepository.save(user);

    const validateEmailPromisse = validateAccountUseCase.execute(preUser.id);

    expect(validateEmailPromisse).rejects.toStrictEqual(
      new AlreadyCreatedError('user'),
    );
  });

  it('should throw if a user already exists with that email', async () => {
    const { validateAccountUseCase, userRepository, preUserRepository } =
      makeUseCaseSut();

    const preUser = makePreUser();
    preUserRepository.save(preUser);

    const user = makeUser({ email: preUser.email });
    await userRepository.save(user);

    const validateEmailPromisse = validateAccountUseCase.execute(preUser.id);

    expect(validateEmailPromisse).rejects.toStrictEqual(
      new AlreadyCreatedError('user'),
    );
  });
});
