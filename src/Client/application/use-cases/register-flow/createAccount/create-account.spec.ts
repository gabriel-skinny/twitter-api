
import ErrorUserNotFound from "../../../errors/userNotFound";

import InMemoryPreUserRepositroy from "src/Client/application/repositories/preUser/inMemoryPreUserRepository";
import InMemoryUserRepositroy from "../../../repositories/user/inMemoryUserRepository";
import AuthServiceStub from "../../../services/AuthServiceStub";
import { makePreUser } from "../../../tests/factories/makePreUser";
import ValidateAccountUseCase from "./create-account-use-case";

const makeUseCaseSut = () => {
    const preUserRepository = new InMemoryPreUserRepositroy();
    const userRepository = new InMemoryUserRepositroy();
    const authService = new AuthServiceStub();

    const validateAccountUseCase =  new ValidateAccountUseCase(preUserRepository, userRepository, authService);
    
    return { validateAccountUseCase, preUserRepository, userRepository };
}

describe("Create Account Use Case", () => {
    it ("should validate and create the account of a user and return a user token", async () => {
        const { validateAccountUseCase, userRepository, preUserRepository  } = makeUseCaseSut()
        const preUser = makePreUser();

        await preUserRepository.save(preUser);

        const userToken = await validateAccountUseCase.execute(preUser.id);

        expect(userToken).toBeTruthy();
        expect(userRepository.userDatabase).toHaveLength(1);
        expect(userRepository.userDatabase[0].name).toBe(preUser.name);
        expect(userRepository.userDatabase[0].email).toBe(preUser.email);
    });

    it ("should throw an error if user does not exists", async () => {
        const { validateAccountUseCase } = makeUseCaseSut()

        const validateEmailPromisse = validateAccountUseCase.execute("notExistsId");

        expect(validateEmailPromisse).rejects.toThrow(ErrorUserNotFound);
    });
})