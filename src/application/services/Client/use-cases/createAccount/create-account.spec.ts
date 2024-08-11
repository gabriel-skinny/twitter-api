import { EmailValidation } from "../../entities/EmailValidation";
import { EmailValidationAttempt } from "../../entities/EmailValidationAttempt";
import { ValidationCode } from "../../entities/ValidationCode";
import ErrorUserAlreadyCreated from "../../errors/userAlreadyCreated";
import EmailProviderStub from "../../provider/emailProviderStub";
import InMemoryEmailValidationRepository from "../../repositories/emailValidation/inMemoryEmailValidationRepository";
import InMemoryEmailValidationAttemptRepository from "../../repositories/emailValidationAttempt/emailValidation/inMemoryEmailValidationAttempRepository";
import InMemoryPreUserRepositroy from "../../repositories/preUserRepository/inMemoryPreUserRepository";
import InMemoryUserRepositroy from "../../repositories/userRepository/inMemoryUserRepository";
import { makePreUser } from "../../tests/factories/makePreUser";
import { makeUser } from "../../tests/factories/makeUser";
import CryptoServiceStub from "../../util/cryptoServiceStub";
import { CreateAccountUseCase } from "./create-account-use-case";

const makeUseCaseSut = () => {
    const cryptoService = new CryptoServiceStub(); 
    const userRepository = new InMemoryUserRepositroy();
    const preUserRepository = new InMemoryPreUserRepositroy();
    const emailValidationAttemptRepository = new InMemoryEmailValidationAttemptRepository();
    const emailValidationRepository = new InMemoryEmailValidationRepository();
    const emailProvider = new EmailProviderStub();
    
    const createAccountUseCase =  new CreateAccountUseCase(
        cryptoService, 
        userRepository, 
        preUserRepository, 
        emailValidationRepository,
        emailValidationAttemptRepository,  
        emailProvider);
    
    return { cryptoService, preUserRepository, emailValidationAttemptRepository, emailProvider, emailValidationRepository, userRepository, createAccountUseCase };
}

describe("Create Account Use Case", () => {
    describe("sucess cases", () => {
        it ("should create a preUser", async () => {
            const { createAccountUseCase, preUserRepository } = makeUseCaseSut()
            
            await createAccountUseCase.execute({
                email: "gabriel@gmail.com",
                name: "gabriel",
                password: "teste"
            });
    
            expect(preUserRepository.preUserDatabase).toHaveLength(1);
        });
    
        it ("should Create a email Validation if preUser has none created", async () => {
            const { createAccountUseCase, emailValidationRepository } = makeUseCaseSut()
            
            await createAccountUseCase.execute({
                email: "gabriel@gmail.com",
                name: "gabriel",
                password: "teste"
            });
    
            expect(emailValidationRepository.emailValidationDatabase).toHaveLength(1);
        });

        it ("Should send an email with the rigth data", async () => {
            const { createAccountUseCase, emailValidationRepository, emailProvider } = makeUseCaseSut()
            
            emailProvider.sendEmail = jest.fn();

            const emailCreated = "gabriel@gmail.com";
            await createAccountUseCase.execute({
                email: emailCreated,
                name: "gabriel",
                password: "teste"
            });

            const emailValidationCreated = emailValidationRepository.emailValidationDatabase[0];
    
            expect(emailProvider.sendEmail).toHaveBeenCalledWith({ 
                destinyEmail: emailCreated, 
                emailType: "emailConfirmation",
                content: `Send this validation code: ${emailValidationCreated.validationCode.value}`
            });
        })
    })

    describe("Exceptions cases", () => {
        it("should not be able to create a preUser with a used email", async () => {
            const { createAccountUseCase, userRepository } = makeUseCaseSut()
            
            const usedEmail = "duplicatedEmail@gmail.com";
            const user = makeUser({ email: usedEmail});
            await userRepository.save(user);
    
            const createAccountPromise = createAccountUseCase.execute({
                email: usedEmail,
                name: "name",
                password: "pass"
            });
    
            expect(userRepository.userDatabase).toHaveLength(1);
            expect(createAccountPromise).rejects.toStrictEqual(new ErrorUserAlreadyCreated("email"));
        });
    
        it("should not be able to create a preUser with the same name", async () => {
            const { createAccountUseCase, userRepository } = makeUseCaseSut()
            
            const usedName = "usedName";
            const user = makeUser({ name: usedName});
            await userRepository.save(user);
    
            const createAccountPromise = createAccountUseCase.execute({
                email: "email@gmail.com",
                name: usedName,
                password: "pass"
            });
            
    
            expect(userRepository.userDatabase).toHaveLength(1);
            expect(createAccountPromise).rejects.toStrictEqual(new ErrorUserAlreadyCreated("name"));
        });

        it("should not be able to create a preUser with the same name as a preUser", async () => {
            const { createAccountUseCase, preUserRepository } = makeUseCaseSut()
            
            const usedName = "usedName";
            const preUser = makePreUser({ name: usedName});
            await preUserRepository.save(preUser);
    
            const createAccountPromise = createAccountUseCase.execute({
                email: "email@gmail.com",
                name: usedName,
                password: "pass"
            });
            
    
            expect(preUserRepository.preUserDatabase).toHaveLength(1);
            expect(createAccountPromise).rejects.toStrictEqual(new ErrorUserAlreadyCreated("name"));
        });
    
        it("should delete a preUser with the same email", async () => {
            const { createAccountUseCase, preUserRepository } = makeUseCaseSut()
            
            const usedEmail = "usedEmail@gmail.com";
            const preUser = makePreUser({ email: usedEmail});
            await preUserRepository.save(preUser);
    
            await createAccountUseCase.execute({
                email: usedEmail,
                name: "rightName",
                password: "pass"
            });
            
    
            expect(preUserRepository.preUserDatabase).toHaveLength(1); 
            expect(preUserRepository.preUserDatabase[0].id).not.toBe(preUser.id);
        });

        it("should used already created validation code and update emailValidationAttemp", async () => {
            const { createAccountUseCase, emailValidationRepository, emailValidationAttemptRepository, emailProvider } = makeUseCaseSut()
            emailProvider.sendEmail = jest.fn();

            const usedEmail = "usedEmail@gmail.com";
            const usedValidationCode = new ValidationCode(123456);
            const emailValidation = new EmailValidation({
                userEmail: usedEmail,
                validationCode: usedValidationCode,
            })
            await emailValidationRepository.save(emailValidation);

            const emailValidationAttempt = new EmailValidationAttempt({
                emailValidationId: emailValidation.id, 
            })
            await emailValidationAttemptRepository.save(emailValidationAttempt);
    
            await createAccountUseCase.execute({
                email: usedEmail,
                name: "rightName",
                password: "pass"
            });
            
    
            expect(emailValidationRepository.emailValidationDatabase).toHaveLength(1); 
            expect(emailValidationAttemptRepository.emailValidationAttempDatabase[0].attempts).toBe(1);
            expect(emailProvider.sendEmail).toHaveBeenCalledWith({ 
                destinyEmail: usedEmail, 
                emailType: "emailConfirmation",
                content: `Send this validation code: ${usedValidationCode.value}`
            });
        });
    })
})