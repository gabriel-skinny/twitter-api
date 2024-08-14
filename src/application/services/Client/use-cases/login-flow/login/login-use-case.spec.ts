import { Password } from "@applications/services/Client/entities/User/Password";
import { SessionDeviceTypesEnum } from "@applications/services/Client/entities/User/Session";
import ErrorUserNotFound from "@applications/services/Client/errors/userNotFound";
import InMemoryUserSessionRepository from "@applications/services/Client/repositories/session/inMemorySessionRepository";
import InMemoryUserRepositroy from "@applications/services/Client/repositories/user/inMemoryUserRepository";
import AuthServiceStub from "@applications/services/Client/services/AuthServiceStub";
import { makeUser } from "@applications/services/Client/tests/factories/makeUser";
import LoginUseCase from "./login-use-case";

const makeUseCaseSut = () => {
    const userRepository = new InMemoryUserRepositroy();
    const authService = new AuthServiceStub();
    const userSessionRepository = new InMemoryUserSessionRepository();
    
    const loginUseCase =  new LoginUseCase( 
        userRepository, 
        authService,
        userSessionRepository
    );
    
    return { loginUseCase, userRepository, authService, userSessionRepository };
}

describe("Login use-case", () => {
    it ("Should create a user session and return a login token to the user", async () => {
        const { loginUseCase, userRepository, userSessionRepository } = makeUseCaseSut();

        const usedPassword = "password";
        const user = makeUser({ password_hash: new Password(usedPassword)});
        await userRepository.save(user);

        const userToken = await loginUseCase.execute({
            email: user.email,
            password: "password",
            ip: "124.20.02",
            deviceType: SessionDeviceTypesEnum.DESKTOP
        });

        expect(userToken).toBeTruthy();
        expect(userSessionRepository.userSessionDatabase).toHaveLength(1);
    });

    it ("Should error with none users exists with that email", async () => {
        const { loginUseCase, } = makeUseCaseSut();

        const loginUseCasePromise = loginUseCase.execute({
            email: "nonExistingemail@gmail.com",
            password: "password",
            ip: "123.131",
            deviceType: SessionDeviceTypesEnum.DESKTOP
        });

        expect(loginUseCasePromise).rejects.toThrow(ErrorUserNotFound);
    });

    it ("Should throw an error if the password of the user is wrong", async () => {
        const { loginUseCase, userRepository } = makeUseCaseSut();

        const usedPassword = "password";
        const user = makeUser({ password_hash: new Password(usedPassword)});
        await userRepository.save(user);

        const loginUsePromise = loginUseCase.execute({
            email: user.email,
            password: "WrongPassword",
            ip: "123.131",
            deviceType: SessionDeviceTypesEnum.DESKTOP
        });

        expect(loginUsePromise).rejects.toStrictEqual(new Error("Wrong password"));
    });
})