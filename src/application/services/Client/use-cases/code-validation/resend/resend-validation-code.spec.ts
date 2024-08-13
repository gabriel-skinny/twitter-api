import InMemoryValidationRepository from "@applications/services/Client/repositories/validation/InMemoryValidationRepository";
import EmailProviderStub from "@applications/services/Client/services/emailProviderStub";
import { ResendValidationUseCase } from "./resend-validation-code";
import { makeValidation } from "@applications/services/Client/tests/factories/makeValidation";
import { OperationToValidateTypeEnum } from "@applications/services/Client/entities/Validation/Validation";



const makeUseCaseSut = () => {
    const validationRepository = new InMemoryValidationRepository();
    const emailService = new EmailProviderStub();

    const resendValidationUseCase =  new ResendValidationUseCase(validationRepository, emailService);
    
    return { resendValidationUseCase, validationRepository, emailService };
}

describe("User resend validation code use case", () => {
    it ("Should resend validation code to the email passed", async () => {
        const { resendValidationUseCase, validationRepository, emailService } = makeUseCaseSut();

        emailService.sendEmail = jest.fn();

        const validation = makeValidation();
        await validationRepository.save(validation);

        await resendValidationUseCase.execute({ 
            email: validation.email,
            operationToValidateType: validation.operationToValidateType
        })
        
        expect(emailService.sendEmail).toHaveBeenCalledWith({
            destinyEmail: validation.email,
            emailType: "emailConfirmation",
            content: `Send this validation code: ${validation.validationCode.value}`
        })
    })

    it ("Should throw an error with validation does not exists", async () => {
        const { resendValidationUseCase } = makeUseCaseSut();

        const resendValidationPromise = resendValidationUseCase.execute({ 
            email: "notExstingEmail@gmail.com",
            operationToValidateType: OperationToValidateTypeEnum.EMAIL_CONFIRMATION
        })
        
        expect(resendValidationPromise).rejects.toStrictEqual(new Error("Validation does not exists for that user"))
    })
})