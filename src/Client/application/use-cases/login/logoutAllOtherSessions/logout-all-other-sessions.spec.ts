import InMemoryUserRepositroy from "src/Client/application/repositories/user/inMemoryUserRepository"
import { LogoutMockUseCase } from "../logout/logout-mock";
import { LogoutAllOtherSessionsUseCase } from "./logout-all-other-sessions-use-case";
import { makeUserSession } from "src/Client/application/tests/factories/makeUserSession";
import InMemoryUserSessionRepository from "src/Client/application/repositories/session/inMemorySessionRepository";

describe("Logout all other sessions use case", () => {
    it ("should call logout sessions with all sessions of a user, minus itself", async  () => {
        const userSessionRepository = new InMemoryUserSessionRepository();
        const logoutMockUseCase = new LogoutMockUseCase();
        const logoutAllOtherSessionsUseCase = new LogoutAllOtherSessionsUseCase(
            userSessionRepository,
            logoutMockUseCase
        )

        logoutMockUseCase.execute = jest.fn();

        await userSessionRepository.save(makeUserSession({ ip: "diferenteIp1"}));
        await userSessionRepository.save(makeUserSession({ ip: "diferentIp2"}));
        const actualIp = "diferentIp"
        const actualUserSession = makeUserSession({ ip: actualIp});
        await userSessionRepository.save(actualUserSession);

        expect(userSessionRepository.userSessionDatabase).toHaveLength(3);

        await logoutAllOtherSessionsUseCase.execute({
            userId: actualUserSession.userId,
            actualIp
        });

        expect(logoutMockUseCase.execute).toHaveBeenCalledTimes(2);
    })

    it ("should not call logout session if only the user that called is on", async  () => {
        const userSessionRepository = new InMemoryUserSessionRepository();
        const logoutMockUseCase = new LogoutMockUseCase();
        const logoutAllOtherSessionsUseCase = new LogoutAllOtherSessionsUseCase(
            userSessionRepository,
            logoutMockUseCase
        )

        logoutMockUseCase.execute = jest.fn();

        const actualIp = "diferentIp"
        const actualUserSession = makeUserSession({ ip: actualIp});
        await userSessionRepository.save(actualUserSession);

        expect(userSessionRepository.userSessionDatabase).toHaveLength(1);

        await logoutAllOtherSessionsUseCase.execute({
            userId: actualUserSession.userId,
            actualIp
        });

        expect(logoutMockUseCase.execute).not.toHaveBeenCalled();
    })
})