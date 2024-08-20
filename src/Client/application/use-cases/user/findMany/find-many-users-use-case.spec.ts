import InMemoryUserRepositroy from 'src/Client/application/repositories/user/inMemoryUserRepository';
import { FindManyUsersUseCase } from './find-many-users-use-case';
import { makeUser } from 'src/Client/application/tests/factories/makeUser';
import WrongValueError from 'src/Shared/errors/wrongValue';

const makeUseCaseSut = () => {
  const userRepository = new InMemoryUserRepositroy();
  const findManyUsersUseCase = new FindManyUsersUseCase(userRepository);

  return { findManyUsersUseCase, userRepository };
};

describe('Find many users use case', () => {
  it('Should return all users', async () => {
    const { userRepository, findManyUsersUseCase } = makeUseCaseSut();

    const user = makeUser();
    await userRepository.save(user);

    const user2 = makeUser();
    await userRepository.save(user2);

    const response = await findManyUsersUseCase.execute();

    expect(response.totalCount).toBe(2);
    expect(response.users).toHaveLength(2);
  });

  it('Should return only selected users', async () => {
    const { userRepository, findManyUsersUseCase } = makeUseCaseSut();

    const user = makeUser();
    await userRepository.save(user);

    const user2 = makeUser();
    await userRepository.save(user2);

    const response = await findManyUsersUseCase.execute({
      page: 1,
      perPage: 1,
    });

    expect(response.totalCount).toBe(2);
    expect(response.users).toHaveLength(1);
  });

  it('Should throw a WrongValue error with the per Page and page values are higher than the total database', async () => {
    const { userRepository, findManyUsersUseCase } = makeUseCaseSut();

    const user = makeUser();
    await userRepository.save(user);

    const user2 = makeUser();
    await userRepository.save(user2);

    const findManyPromisse = findManyUsersUseCase.execute({
      page: 2,
      perPage: 2,
    });

    expect(findManyPromisse).rejects.toStrictEqual(
      new WrongValueError('perPage'),
    );
  });
});
