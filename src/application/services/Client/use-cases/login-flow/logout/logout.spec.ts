import InMemoryUserSessionRepository from "@applications/services/Client/repositories/session/inMemorySessionRepository";
import LogoutUseCase from "./logout-use-case"
import UserSession, { SessionDeviceTypesEnum } from "@applications/services/Client/entities/User/Session";

describe("Logout use case", () => {
    it ("should delete a user session", async () => {
        const userSessionRepository = new InMemoryUserSessionRepository();
        const logoutUseCase = new LogoutUseCase(userSessionRepository);

        const userSession = new UserSession({
            ip: "123.123",
            userId: "userId",
            deviceType: SessionDeviceTypesEnum.DESKTOP
        });

        await userSessionRepository.save(userSession);

        await logoutUseCase.execute({ 
            ip: userSession.ip,
            userId: userSession.userId
        })

        expect(userSessionRepository.userSessionDatabase).toHaveLength(0);
    });

    it ("should throw an error if user session does not exists", async () => {
        const userSessionRepository = new InMemoryUserSessionRepository();
        const logoutUseCase = new LogoutUseCase(userSessionRepository);

        const logoutPromise = logoutUseCase.execute({ 
            ip: "notExsitingIp",
            userId: "nonExstigingUserId"
        })

        expect(logoutPromise).rejects.toStrictEqual(new Error("User session not found"));
    })
})