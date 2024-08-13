import { OperationToValidateTypeEnum, Validation } from "../../../entities/Validation/Validation";
import InMemoryValidationRepository from "../../../repositories/validation/InMemoryValidationRepository";
import AuthServiceStub from "../../../services/AuthServiceStub";
import { makeValidation } from "../../../tests/factories/makeValidation";
import ValidateCodeUseCase from "./validate-code-use-case";


const makeUseCaseSut = () => {
    const validationRepository = new InMemoryValidationRepository();
    const authService = new AuthServiceStub();

    const validateCodeUseCase =  new ValidateCodeUseCase(validationRepository, authService);
    
    return { validateCodeUseCase, validationRepository, authService};
}


describe("Validate code use-case", () => {
    it ("should validate email confirmation use operation", async () => {
        const { validateCodeUseCase, validationRepository } = makeUseCaseSut();

        const validation = makeValidation({
            operationToValidateType: OperationToValidateTypeEnum.EMAIL_CONFIMATION
        })
        await validationRepository.save(validation);

        
        const jwtToken = await validateCodeUseCase.execute({ 
            userEmail: validation.userEmail,
            validationCode: validation.validationCode.value,
            operationToValidateType: OperationToValidateTypeEnum.EMAIL_CONFIMATION
        })

        expect(jwtToken).toBeTruthy();
        expect(validationRepository.validationDatabase).toHaveLength(0);
    })

    it ("should validate email password_change use operation", async () => {
        const { validateCodeUseCase, validationRepository } = makeUseCaseSut();

        const validation = makeValidation({
            operationToValidateType: OperationToValidateTypeEnum.PASSWORD_CHANGE
        })
        await validationRepository.save(validation);

        
        const jwtToken = await validateCodeUseCase.execute({ 
            userEmail: validation.userEmail,
            validationCode: validation.validationCode.value,
            operationToValidateType: OperationToValidateTypeEnum.PASSWORD_CHANGE
        })

        expect(jwtToken).toBeTruthy();
        expect(validationRepository.validationDatabase).toHaveLength(0);
    })

    it ("Should throw an error with validation does not exists", async () => {
        const { validateCodeUseCase, validationRepository } = makeUseCaseSut();

        const validateUseCasePromise = validateCodeUseCase.execute({ 
            userEmail: "nonExisting@gmail.com",
            validationCode: 100,
            operationToValidateType: OperationToValidateTypeEnum.EMAIL_CONFIMATION 
        })

        expect(validateUseCasePromise).rejects.toStrictEqual(new Error("Validation does not exists for that user"));
    })

    it ("should throw an error with validation code is wrong", async () => {
        const { validateCodeUseCase, validationRepository } = makeUseCaseSut();

        const validation = makeValidation()
        await validationRepository.save(validation);

        
        const validateCodeUseCasePromise = validateCodeUseCase.execute({ 
            userEmail: validation.userEmail,
            validationCode: 1000,
            operationToValidateType: validation.operationToValidateType
        })

        expect(validateCodeUseCasePromise).rejects.toStrictEqual(new Error("Wrong validation code"));
    })

    it ("should throw an error with operationToValidateType is wrong", async () => {
        const { validateCodeUseCase, validationRepository } = makeUseCaseSut();

        const validation = makeValidation()
        await validationRepository.save(validation);

        
        const validateCodeUseCasePromise = validateCodeUseCase.execute({ 
            userEmail: validation.userEmail,
            validationCode: validation.validationCode.value,
            operationToValidateType: "InvalidOperationType" as any
        })

        expect(validateCodeUseCasePromise).rejects.toStrictEqual(new Error("Wrong validation code"));
    })
})