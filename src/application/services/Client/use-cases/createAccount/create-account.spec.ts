import ErrorUserAlreadyCreated from "../../errors/userAlreadyCreated";
import EmailProviderStub from "../../provider/emailProviderStub";
import InMemoryEmailValidationRepository from "../../repositories/emailValidation/inMemoryEmailValidationRepository";
import InMemoryUserRepositroy from "../../repositories/userRepository/inMemoryUserRepository";
import CryptoServiceStub from "../../util/cryptoServiceStub";
import { CreateAccountUseCase } from "./create-account-use-case";

const makeUseCaseSut = () => {
    const cryptoService = new CryptoServiceStub(); 
    const userRepository = new InMemoryUserRepositroy();
    const emailProvider = new EmailProviderStub();
    const emailValidationRepository = new InMemoryEmailValidationRepository();

    const createAccountUseCase =  new CreateAccountUseCase(cryptoService, userRepository, emailValidationRepository, emailProvider);
    
    return { cryptoService, emailProvider, emailValidationRepository, userRepository, createAccountUseCase };
}

describe("Create Account Use Case", () => {
    it ("should create a user", async () => {
        const { createAccountUseCase, userRepository } = makeUseCaseSut()
        
        await createAccountUseCase.execute({
            email: "gabriel@gmail.com",
            name: "gabriel",
            password: "teste"
        });

        expect(userRepository.userDatabase).toHaveLength(1);
    });

    it ("should Create a email Validation", async () => {
        const { createAccountUseCase, emailValidationRepository } = makeUseCaseSut()
        
        await createAccountUseCase.execute({
            email: "gabriel@gmail.com",
            name: "gabriel",
            password: "teste"
        });

        expect(emailValidationRepository.emailValidation).toHaveLength(1);
    });

    it("should not be able to create a user with the same email", async () => {
        const { createAccountUseCase, userRepository } = makeUseCaseSut()
        
        const userData = {
            email: "gabriel@gmail.com",
            name: "gabriel",
            password: "teste"
        }

        await createAccountUseCase.execute(userData);
        const secondCallPromise = createAccountUseCase.execute({...userData, name: "diferentName"})
        

        expect(userRepository.userDatabase).toHaveLength(1);
        expect(secondCallPromise).rejects.toStrictEqual(new ErrorUserAlreadyCreated("email"));
    });

    it("should not be able to create a user with the same name", async () => {
        const { createAccountUseCase, userRepository } = makeUseCaseSut()
        
        const userData = {
            email: "gabriel@gmail.com",
            name: "gabriel",
            password: "teste"
        }

        await createAccountUseCase.execute(userData);
        const secondCallPromise = createAccountUseCase.execute({...userData, email: "diferent@gmail.com"})
        

        expect(userRepository.userDatabase).toHaveLength(1);
        expect(secondCallPromise).rejects.toStrictEqual(new ErrorUserAlreadyCreated("name"));
    });

    it("should call send email with the rigth parameters", async () => {
        const { createAccountUseCase, emailProvider } = makeUseCaseSut()

        emailProvider.sendEmail = jest.fn();

        const userData = {
            email: "gabriel@gmail.com",
            name: "gabriel",
            password: "teste"
        }

        await createAccountUseCase.execute(userData);
        

        expect(emailProvider.sendEmail).toHaveBeenCalledWith({
            destinyEmail: userData.email,
            emailType: "emailConfirmation"
        });
        
    });
})