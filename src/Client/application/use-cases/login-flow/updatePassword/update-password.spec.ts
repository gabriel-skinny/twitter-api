import InMemoryUserRepositroy from 'src/Client/application/repositories/user/inMemoryUserRepository';
import UpdatePasswordUseCase from './update-password-use-case';
import { makeUser } from 'src/Client/application/tests/factories/makeUser';
import { Password } from 'src/Client/application/entities/User/Password';
import WrongValueError from 'src/Client/application/errors/wrongValue';

const makeUseCaseSut = () => {
  const userRepository = new InMemoryUserRepositroy();

  const updatePasswordUseCase = new UpdatePasswordUseCase(userRepository);

  return { updatePasswordUseCase, userRepository };
};

describe('Update password use case', () => {
  it('should update password', async () => {
    const { updatePasswordUseCase, userRepository } = makeUseCaseSut();

    const user = makeUser();
    await userRepository.save(user);

    const newPassword = 'novaSenha';
    await updatePasswordUseCase.execute({
      newPassword: newPassword,
      userId: user.id,
    });

    expect(
      userRepository.userDatabase[0].password_hash.isTheSameValue(newPassword),
    ).toBeTruthy();
  });

  it('should throw an error if the new password has the same value as the old one', async () => {
    const { updatePasswordUseCase, userRepository } = makeUseCaseSut();

    const oldPassword = 'oldPassword';
    const user = makeUser({ password_hash: new Password(oldPassword) });
    await userRepository.save(user);

    const updatePasswordPromise = updatePasswordUseCase.execute({
      newPassword: oldPassword,
      userId: user.id,
    });

    expect(updatePasswordPromise).rejects.toStrictEqual(
      new WrongValueError('password'),
    );
  });
});
