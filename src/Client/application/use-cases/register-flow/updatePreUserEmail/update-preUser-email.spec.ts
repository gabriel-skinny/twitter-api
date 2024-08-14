
import { ValidationCode } from "../../../entities/Validation/ValidationCode";
import ErrorUserAlreadyCreated from "../../../errors/userAlreadyCreated";
import ErrorUserNotFound from "../../../errors/userNotFound";
import InMemoryEmailValidationRepository from "../../../repositories/validation/InMemoryValidationRepository";

import InMemoryUserRepositroy from "../../../repositories/user/inMemoryUserRepository";
import { makePreUser } from "../../../tests/factories/makePreUser";
import { makeUser } from "../../../tests/factories/makeUser";
import InMemoryPreUserRepositroy from "src/Client/application/repositories/preUser/inMemoryPreUserRepository";
import { UpdatePreUserEmailUseCase } from "./update-preUser-email-use-case";
import { UpdateEmailCodeValidationUseCaseMock } from "../../code-validation/update-email/update-email-mock";


const makeUseCaseSut = () => {
    const userRepository = new InMemoryUserRepositroy();
    const preUserRepository = new InMemoryPreUserRepositroy();
    const updateEmailCodeValidationUseCase = new UpdateEmailCodeValidationUseCaseMock()

    const createAccountUseCase =  new UpdatePreUserEmailUseCase(userRepository, preUserRepository, updateEmailCodeValidationUseCase);
    
    return { createAccountUseCase, userRepository, preUserRepository, updateEmailCodeValidationUseCase };
}

describe("Update PreUser email use case", () => {
    it("Should change preUser email to the new email", async () => {
        const { createAccountUseCase, preUserRepository } = makeUseCaseSut();

        const preUser = makePreUser();
        await preUserRepository.save(preUser)

        const newEmail = "newEmail@gmail.com" 
        await createAccountUseCase.execute({
            newEmail: newEmail,
            preUserId: preUser.id
        })

        expect(preUserRepository.preUserDatabase[0].email).toBe(newEmail);
    })

    it("Should throw if the email is already used by a user", async () => {
        const { createAccountUseCase, userRepository } = makeUseCaseSut();

        const emailUsed = "usedEmail@gmail.com";
        const user = makeUser({ email: emailUsed });

        await userRepository.save(user);
 
        const createAccountPromise = createAccountUseCase.execute({
            newEmail: emailUsed,
            preUserId: "preUser.id"
        })

        expect(createAccountPromise).rejects.toStrictEqual(new ErrorUserAlreadyCreated("email"));
    })

    it("Should throw if the email is already used by a preUser", async () => {
        const { createAccountUseCase, preUserRepository } = makeUseCaseSut();

        const emailUsed = "usedEmail@gmail.com";
        const preUser = makePreUser({ email: emailUsed });

        await preUserRepository.save(preUser);
 
        const createAccountPromise = createAccountUseCase.execute({
            newEmail: emailUsed,
            preUserId: "preUser.id"
        })

        expect(createAccountPromise).rejects.toStrictEqual(new ErrorUserAlreadyCreated("email"));
    })

    it("Should throw if the preUser passed doest not exists", async () => {
        const { createAccountUseCase } = makeUseCaseSut();
 
        const createAccountPromise = createAccountUseCase.execute({
            newEmail: "notExists@gmail.com",
            preUserId: "notExistis"
        })

        expect(createAccountPromise).rejects.toStrictEqual(new ErrorUserNotFound());
    })
})