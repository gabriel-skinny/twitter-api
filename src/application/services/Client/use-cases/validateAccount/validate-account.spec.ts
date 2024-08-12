import { EmailValidation } from "../../entities/EmailValidation";
import { ValidationCode } from "../../entities/ValidationCode";
import ErrorUserNotFound from "../../errors/userNotFound";
import ErrorWrongValidationCode from "../../errors/wrongValidationCode";
import InMemoryEmailValidationRepository from "../../repositories/emailValidation/inMemoryEmailValidationRepository";
import InMemoryPreUserRepositroy from "../../repositories/preUserRepository/inMemoryPreUserRepository";
import InMemoryUserRepositroy from "../../repositories/userRepository/inMemoryUserRepository";
import AuthServiceStub from "../../services/AuthServiceStub";
import { makePreUser } from "../../tests/factories/makePreUser";
import { makeUser } from "../../tests/factories/makeUser";
import ValidateAccountUseCase from "./validate-account-use-case";

const makeUseCaseSut = () => {
    const preUserRepository = new InMemoryPreUserRepositroy();
    const userRepository = new InMemoryUserRepositroy();
    const emailValidationRepository = new InMemoryEmailValidationRepository();
    const authService = new AuthServiceStub();

    const validateAccountUseCase =  new ValidateAccountUseCase(emailValidationRepository, preUserRepository, userRepository, authService);
    
    return { validateAccountUseCase, preUserRepository, userRepository, emailValidationRepository};
}

describe("Validate Email Use Case", () => {
    it ("should validate and create the account of a user and return a user token", async () => {
        const { validateAccountUseCase, userRepository, preUserRepository,emailValidationRepository } = makeUseCaseSut()
        const preUser = makePreUser();
        const emailValidation = new EmailValidation({
            userEmail: preUser.email,
            validationCode: new ValidationCode(),
        });

        await preUserRepository.save(preUser);
        await emailValidationRepository.save(emailValidation)

        const userToken = await validateAccountUseCase.execute({ 
            preUserId: preUser.id, 
            validationCode: emailValidation.validationCode.value
        });

        expect(userToken).toBeTruthy();
        expect(userRepository.userDatabase).toHaveLength(1);
        expect(userRepository.userDatabase[0].name).toBe(preUser.name);
        expect(userRepository.userDatabase[0].email).toBe(preUser.email);
    });

    it ("should throw an error if user does not exists", async () => {
        const { validateAccountUseCase } = makeUseCaseSut()

        const validateEmailPromisse = validateAccountUseCase.execute({ 
            preUserId: "not-existing", 
            validationCode: 10000
        });

        expect(validateEmailPromisse).rejects.toThrow(ErrorUserNotFound);
    });

    it ("should throw an error if email validation does not exists", async () => {
        const { validateAccountUseCase, preUserRepository } = makeUseCaseSut()

        const preUser = makePreUser();

        await preUserRepository.save(preUser);

        const validateAccountUseCasePromisse = validateAccountUseCase.execute({ 
            preUserId: preUser.id, 
            validationCode: 10000
        });

        expect(validateAccountUseCasePromisse).rejects.toThrow(ErrorWrongValidationCode);
    });

    it ("should throw an error if the emailValidationCode is wrong", async () => {
        const { validateAccountUseCase, preUserRepository, emailValidationRepository } = makeUseCaseSut()

        const preUser = makePreUser();
        const emailValidation = new EmailValidation({
            userEmail: preUser.email,
            validationCode: new ValidationCode(),
        });

        await preUserRepository.save(preUser);
        await emailValidationRepository.save(emailValidation)

        const validateAccountUseCasePromisse = validateAccountUseCase.execute({ 
            preUserId: preUser.id, 
            validationCode: 10000
        });

        expect(validateAccountUseCasePromisse).rejects.toThrow(ErrorWrongValidationCode);
    });
})