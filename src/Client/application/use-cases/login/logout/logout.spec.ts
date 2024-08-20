import UserSession, {
  SessionDeviceTypesEnum,
} from 'src/Client/application/entities/User/Session';
import NotFoundCustomError from 'src/Shared/errors/notFound';
import InMemoryUserSessionRepository from 'src/Client/application/repositories/session/inMemorySessionRepository';
import LogoutUseCase from './logout-use-case';

describe('Logout use case', () => {
  it('should delete a user session', async () => {
    const userSessionRepository = new InMemoryUserSessionRepository();
    const logoutUseCase = new LogoutUseCase(userSessionRepository);

    const userSession = new UserSession({
      ip: '123.123',
      userId: 'userId',
      deviceType: SessionDeviceTypesEnum.DESKTOP,
    });

    await userSessionRepository.save(userSession);

    await logoutUseCase.execute({
      ip: userSession.ip,
      userId: userSession.userId,
    });

    expect(userSessionRepository.userSessionDatabase).toHaveLength(0);
  });

  it('should throw an error if user session does not exists', async () => {
    const userSessionRepository = new InMemoryUserSessionRepository();
    const logoutUseCase = new LogoutUseCase(userSessionRepository);

    const logoutPromise = logoutUseCase.execute({
      ip: 'notExsitingIp',
      userId: 'nonExstigingUserId',
    });

    expect(logoutPromise).rejects.toStrictEqual(
      new NotFoundCustomError('User session'),
    );
  });
});
