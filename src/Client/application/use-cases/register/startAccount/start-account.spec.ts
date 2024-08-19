import AlreadyCreatedError from 'src/Client/application/errors/alreadyCreated';
import InMemoryPreUserRepositroy from 'src/Client/application/repositories/preUser/inMemoryPreUserRepository';
import InMemoryUserRepositroy from '../../../repositories/user/inMemoryUserRepository';
import { makePreUser } from '../../../tests/factories/makePreUser';
import { makeUser } from '../../../tests/factories/makeUser';
import { CreateValidationCodeMock } from '../../code-validation/create/create-validation-code-mock';
import { StartAccountUseCase } from './start-account-use-case';

const makeUseCaseSut = () => {
  const userRepository = new InMemoryUserRepositroy();
  const preUserRepository = new InMemoryPreUserRepositroy();
  const createValidationCodeUseCase = new CreateValidationCodeMock();

  const createAccountUseCase = new StartAccountUseCase(
    userRepository,
    preUserRepository,
    createValidationCodeUseCase,
  );

  return {
    createAccountUseCase,
    userRepository,
    preUserRepository,
    createValidationCodeUseCase,
  };
};

describe('Create Account Use Case', () => {
  it('should create a preUser', async () => {
    const {
      createAccountUseCase,
      preUserRepository,
      createValidationCodeUseCase,
    } = makeUseCaseSut();

    createValidationCodeUseCase.execute = jest.fn();

    await createAccountUseCase.execute({
      email: 'gabriel@gmail.com',
      name: 'gabriel',
      password: 'teste',
    });

    expect(preUserRepository.preUserDatabase).toHaveLength(1);
    expect(createValidationCodeUseCase.execute).toHaveBeenCalled();
  });
  it('should not be able to create a preUser with a used email', async () => {
    const { createAccountUseCase, userRepository } = makeUseCaseSut();

    const usedEmail = 'duplicatedEmail@gmail.com';
    const user = makeUser({ email: usedEmail });
    await userRepository.save(user);

    const createAccountPromise = createAccountUseCase.execute({
      email: usedEmail,
      name: 'name',
      password: 'pass',
    });

    expect(userRepository.userDatabase).toHaveLength(1);
    expect(createAccountPromise).rejects.toStrictEqual(
      new AlreadyCreatedError('user'),
    );
  });

  it('should not be able to create a preUser with the same name', async () => {
    const { createAccountUseCase, userRepository } = makeUseCaseSut();

    const usedName = 'usedName';
    const user = makeUser({ name: usedName });
    await userRepository.save(user);

    const createAccountPromise = createAccountUseCase.execute({
      email: 'email@gmail.com',
      name: usedName,
      password: 'pass',
    });

    expect(userRepository.userDatabase).toHaveLength(1);
    expect(createAccountPromise).rejects.toStrictEqual(
      new AlreadyCreatedError('user'),
    );
  });

  it('should not be able to create a preUser with the same name as a preUser', async () => {
    const { createAccountUseCase, preUserRepository } = makeUseCaseSut();

    const usedName = 'usedName';
    const preUser = makePreUser({ name: usedName });
    await preUserRepository.save(preUser);

    const createAccountPromise = createAccountUseCase.execute({
      email: 'email@gmail.com',
      name: usedName,
      password: 'pass',
    });

    expect(preUserRepository.preUserDatabase).toHaveLength(1);
    expect(createAccountPromise).rejects.toStrictEqual(
      new AlreadyCreatedError('preUser'),
    );
  });

  it('should delete a preUser with the same email', async () => {
    const { createAccountUseCase, preUserRepository } = makeUseCaseSut();

    const usedEmail = 'usedEmail@gmail.com';
    const preUser = makePreUser({ email: usedEmail });
    await preUserRepository.save(preUser);

    await createAccountUseCase.execute({
      email: usedEmail,
      name: 'rightName',
      password: 'pass',
    });

    expect(preUserRepository.preUserDatabase).toHaveLength(1);
    expect(preUserRepository.preUserDatabase[0].id).not.toBe(preUser.id);
  });
});
