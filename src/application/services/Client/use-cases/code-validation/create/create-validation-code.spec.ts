import { OperationToValidateTypeEnum } from "@applications/services/Client/entities/Validation/Validation";
import InMemoryValidationRepository from "@applications/services/Client/repositories/validation/InMemoryValidationRepository";
import EmailProviderStub from "@applications/services/Client/services/emailProviderStub";
import { CreateValidationCodeUseCase } from "./create-validation-code";
import { makeValidation } from "@applications/services/Client/tests/factories/makeValidation";

const makeUseCaseSut = () => {
    const validationRepository = new InMemoryValidationRepository();
    const emailService = new EmailProviderStub();

    const createValidationCodeUseCase = new CreateValidationCodeUseCase(
        validationRepository,
        emailService
    );

    return { createValidationCodeUseCase, validationRepository, emailService }
}


describe("Create validation code use case", () => {
    it ("should Create a email Validation if email has none created", async () => {
        const { createValidationCodeUseCase, validationRepository, emailService } = makeUseCaseSut()
        
        emailService.sendEmail = jest.fn();

        const usedEmail = "testemail@gmail.com"
        await createValidationCodeUseCase.execute({
            email: usedEmail,
            operationToValidateType: OperationToValidateTypeEnum.EMAIL_CONFIRMATION
        });

        expect(validationRepository.validationDatabase).toHaveLength(1);
        expect(emailService.sendEmail).toHaveBeenCalledWith({
            destinyEmail: usedEmail,
            emailType: "emailConfirmation",
            content: `Send this validation code: ${validationRepository.validationDatabase[0].validationCode.value}`
        });
    });

    it ("Should throw an error with validation already exists", async () => {
        const { createValidationCodeUseCase, validationRepository } = makeUseCaseSut()
        
        const validation = makeValidation();
        await validationRepository.save(validation);

        const createValidationCodePromise = createValidationCodeUseCase.execute({
            email: validation.email,
            operationToValidateType: validation.operationToValidateType
        });

        expect(createValidationCodePromise).rejects.toStrictEqual(new Error("Email validation type already exists for that user"));
    })
})