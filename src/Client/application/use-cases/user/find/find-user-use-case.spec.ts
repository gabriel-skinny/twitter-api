import InMemoryUserRepositroy from 'src/Client/application/repositories/user/inMemoryUserRepository';
import { makeUser } from 'src/Client/application/tests/factories/makeUser';
import { Password } from 'src/Client/application/entities/User/Password';
import WrongValueError from 'src/Shared/errors/wrongValue';
import { FindUserUseCase } from './find-user-use-case';
import NotFoundCustomError from 'src/Shared/errors/notFound';

const makeUseCaseSut = () => {
  const userRepository = new InMemoryUserRepositroy();

  const findUserUseCase = new FindUserUseCase(userRepository);

  return { findUserUseCase, userRepository };
};

describe('Find user use case', () => {
  it('should list a user', async () => {
    const { findUserUseCase, userRepository } = makeUseCaseSut();

    const user = makeUser();
    await userRepository.save(user);

    const response = await findUserUseCase.execute(user.id);

    expect(response).toBe(user);
  });

  it('should throw a not-found error the user does not exists', async () => {
    const { findUserUseCase } = makeUseCaseSut();

    const findUserUseCasePromise = findUserUseCase.execute('NotExistsId');

    expect(findUserUseCasePromise).rejects.toStrictEqual(
      new NotFoundCustomError('user'),
    );
  });
});
