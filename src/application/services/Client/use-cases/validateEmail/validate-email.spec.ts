import { EmailValidation } from "../../entities/EmailValidation";
import { Password } from "../../entities/Password";
import User from "../../entities/User";
import { ValidationCode } from "../../entities/ValidationCode";
import ErrorUserNotFound from "../../errors/userNotFound";
import ErrorWrongValidationCode from "../../errors/wrongValidationCode";
import InMemoryEmailValidationRepository from "../../repositories/emailValidation/inMemoryEmailValidationRepository";
import InMemoryUserRepositroy from "../../repositories/userRepository/inMemoryUserRepository";
import { makeUser } from "../../tests/factories/makeUser";
import ValidateEmailUseCase from "./validate-email-use-case";

const makeUseCaseSut = () => {
    const userRepository = new InMemoryUserRepositroy();
    const emailValidationRepository = new InMemoryEmailValidationRepository();

    const validateEmail =  new ValidateEmailUseCase(emailValidationRepository, userRepository);
    
    return { validateEmail, userRepository, emailValidationRepository};
}

describe("Validate Email Use Case", () => {
    it ("should validate the email of a user", async () => {
        const { validateEmail, userRepository, emailValidationRepository } = makeUseCaseSut()
        const user = makeUser();
        const emailValidation = new EmailValidation({
            userId: user.id,
            validationCode: new ValidationCode(),
        });

        await userRepository.save(user);
        await emailValidationRepository.save(emailValidation)

        await validateEmail.execute({ 
            userId: user.id, 
            validationCode: emailValidation.validationCode.value
        });

        expect(user.email_validated).toBeTruthy();
    });

    it ("should throw an error if user does not exists", async () => {
        const { validateEmail } = makeUseCaseSut()

        const validateEmailPromisse = validateEmail.execute({ 
            userId: "not-existing", 
            validationCode: 10000
        });

        expect(validateEmailPromisse).rejects.toThrow(ErrorUserNotFound);
    });

    it ("should throw an error if email validation does not exists", async () => {
        const { validateEmail, userRepository } = makeUseCaseSut()

        const user = makeUser();

        await userRepository.save(user);

        const validateEmailPromisse = validateEmail.execute({ 
            userId: user.id, 
            validationCode: 10000
        });

        expect(validateEmailPromisse).rejects.toThrow(ErrorWrongValidationCode);
    });

    it ("should throw an error if the emailValidationCode is wrong", async () => {
        const { validateEmail, userRepository, emailValidationRepository } = makeUseCaseSut()

        const user = makeUser();
        const emailValidation = new EmailValidation({
            userId: user.id,
            validationCode: new ValidationCode(),
        });

        await userRepository.save(user);
        await emailValidationRepository.save(emailValidation)

        const validateEmailPromisse = validateEmail.execute({ 
            userId: user.id, 
            validationCode: 10000
        });

        expect(validateEmailPromisse).rejects.toThrow(ErrorWrongValidationCode);
    });
})