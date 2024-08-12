import { EmailValidation } from "../../../entities/EmailValidation";
import PreUser from "../../../entities/PreUser";
import { ValidationCode } from "../../../entities/ValidationCode";
import ErrorUserAlreadyCreated from "../../../errors/userAlreadyCreated";
import ErrorUserNotFound from "../../../errors/userNotFound";
import InMemoryEmailValidationRepository from "../../../repositories/emailValidation/inMemoryEmailValidationRepository";
import InMemoryPreUserRepositroy from "../../../repositories/preUserRepository/inMemoryPreUserRepository";
import InMemoryUserRepositroy from "../../../repositories/userRepository/inMemoryUserRepository";
import { makePreUser } from "../../../tests/factories/makePreUser";
import { makeUser } from "../../../tests/factories/makeUser";
import { ChangeValidationEmailUseCase } from "./change-validation-email";

const makeUseCaseSut = () => {
    const userRepository = new InMemoryUserRepositroy();
    const preUserRepository = new InMemoryPreUserRepositroy();
    const emailValidationRepository = new InMemoryEmailValidationRepository();

    const createAccountUseCase =  new ChangeValidationEmailUseCase(userRepository, preUserRepository, emailValidationRepository);
    
    return { createAccountUseCase, userRepository, preUserRepository, emailValidationRepository };
}

describe("Change validatio email", () => {
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

    it("Should update email validation with exists", async () => {
        const { createAccountUseCase, preUserRepository, emailValidationRepository } = makeUseCaseSut();
        
        const preUser = makePreUser();
        await preUserRepository.save(preUser)

        await emailValidationRepository.save(new EmailValidation({
            userEmail: preUser.email,
            validationCode: new ValidationCode(131131),
        }))

        const newEmail = "newEmail@gmail.com"; 
        await createAccountUseCase.execute({
            newEmail: newEmail,
            preUserId: preUser.id
        })

        expect(emailValidationRepository.emailValidationDatabase[0].userEmail).toBe(newEmail);
    })
})