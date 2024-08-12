import InMemoryLoginAttemptRepository from "@applications/services/Client/repositories/loginAttempt/InMemoryLoginAttemptRepository";
import LoginUseCase from "./login-use-case";
import InMemoryUserRepositroy from "@applications/services/Client/repositories/userRepository/inMemoryUserRepository";
import AuthServiceStub from "@applications/services/Client/services/AuthServiceStub";
import { makeUser } from "@applications/services/Client/tests/factories/makeUser";
import { Password } from "@applications/services/Client/entities/Password";
import { LoginAttempt } from "@applications/services/Client/entities/LoginAttempt";
import { MAX_RETRIS_LOGIN_ATTEMPT } from "@constants/loginAttempt";
import ErrorUserNotFound from "@applications/services/Client/errors/userNotFound";

const makeUseCaseSut = () => {
    const loginAttemptRepository = new InMemoryLoginAttemptRepository(); 
    const userRepository = new InMemoryUserRepositroy();
    const authService = new AuthServiceStub();
    
    
    const loginUseCase =  new LoginUseCase(
        loginAttemptRepository, 
        userRepository, 
        authService);
    
    return { loginUseCase, loginAttemptRepository, userRepository, authService};
}

describe("Login use-case", () => {
    it ("Should return a login token to the user", async () => {
        const { loginUseCase, userRepository } = makeUseCaseSut();

        const usedPassword = "password";
        const user = makeUser({ password_hash: new Password(usedPassword)});
        await userRepository.save(user);

        const userToken = await loginUseCase.execute({
            email: user.email,
            password: "password"
        });

        expect(userToken).toBeTruthy();
    });

    it ("Should throw an error when loginAtempt is more than the defined", async () => {
        const { loginUseCase, userRepository, loginAttemptRepository } = makeUseCaseSut();

        const usedPassword = "password";
        const user = makeUser({ password_hash: new Password(usedPassword)});
        await userRepository.save(user);

       for (let i = 0; i <= MAX_RETRIS_LOGIN_ATTEMPT; i++) {
            try {
                await loginUseCase.execute({
                    email: user.email,
                    password: "WrongPassword"
                    });
            } catch (error) {}
        }

       const maxRetriesLoginPromise = loginUseCase.execute({
        email: user.email,
        password: "WrongPassword"
        })

        expect(maxRetriesLoginPromise).rejects
        .toStrictEqual(new Error(`Too much login retries. Wait ${loginAttemptRepository.loginAttemptDatabase[0].expiresIn} minutes to retry`));
        expect(loginAttemptRepository.loginAttemptDatabase[0].attempts).toBe(10);
    });

    it ("Should error with none users exists with that email", async () => {
        const { loginUseCase, } = makeUseCaseSut();

        const loginUseCasePromise = loginUseCase.execute({
            email: "nonExistingemail@gmail.com",
            password: "password"
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
            password: "WrongPassword"
        });

        expect(loginUsePromise).rejects.toStrictEqual(new Error("Wrong password"));
    });

    it ("Should create an login attempt when the password of the user is wrong", async () => {
        const { loginUseCase, userRepository, loginAttemptRepository } = makeUseCaseSut();

        const usedPassword = "password";
        const user = makeUser({ password_hash: new Password(usedPassword)});
        await userRepository.save(user);

        try {
            await loginUseCase.execute({
                email: user.email,
                password: "WrongPassword"
            });
        } catch (error) {}

        expect(loginAttemptRepository.loginAttemptDatabase[0].userEmail).toBe(user.email);
    });

    it ("Should add atempt to a login attempt when the password of the user is wrong", async () => {
        const { loginUseCase, userRepository, loginAttemptRepository } = makeUseCaseSut();

        const usedPassword = "password";
        const user = makeUser({ password_hash: new Password(usedPassword)});
        await userRepository.save(user);

       try {
        await  loginUseCase.execute({
            email: user.email,
            password: "WrongPassword"
        })
       } catch (error) {
            try {
                await loginUseCase.execute({
                    email: user.email,
                    password: "WrongPassword"
                })
            } catch (error) {}
       }
        
        
        expect(loginAttemptRepository.loginAttemptDatabase[0].userEmail).toBe(user.email);
        expect(loginAttemptRepository.loginAttemptDatabase).toHaveLength(1);
        expect(loginAttemptRepository.loginAttemptDatabase[0].attempts).toBe(1);
        
    });
})