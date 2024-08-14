import { makeValidation } from "src/Client/application/tests/factories/makeValidation";
import { UpdateEmailCodeValidationUseCase } from "./update-email-use-case";
import InMemoryValidationRepository from "src/Client/application/repositories/validation/InMemoryValidationRepository";
import { OperationToValidateTypeEnum } from "src/Client/application/entities/Validation/Validation";

const makeUseCaseSut = () => {
    const validationRepository = new InMemoryValidationRepository();

    const updateEmailCodeValidationUseCase = new UpdateEmailCodeValidationUseCase(
        validationRepository,
    );

    return { updateEmailCodeValidationUseCase, validationRepository }
}

describe("Update-email validation useCase", () => {
    it("Should update email validation with exists", async () => {
        const { updateEmailCodeValidationUseCase, validationRepository} = makeUseCaseSut();
        
        const validation = makeValidation();
        await validationRepository.save(validation)

        const newEmail = "newEmail@gmail.com"; 
        await updateEmailCodeValidationUseCase.execute({
            newEmail: newEmail,
            oldEmail: validation.email,
            operationToValidateType: validation.operationToValidateType
        })

        expect(validationRepository.validationDatabase[0].email).toBe(newEmail);
    })

    it("Should throw an error with a validation does not exists for that email", async () => {
        const { updateEmailCodeValidationUseCase } = makeUseCaseSut();
 
        const updateEmailCodeValidationPromise = updateEmailCodeValidationUseCase.execute({
            newEmail: "newEmail@gmail.com",
            oldEmail: "nonExistingemail@gmail.com",
            operationToValidateType: OperationToValidateTypeEnum.EMAIL_CONFIRMATION
        })

        expect(updateEmailCodeValidationPromise).rejects.toStrictEqual(new Error("That validation does not exists for that email"))
    })
})