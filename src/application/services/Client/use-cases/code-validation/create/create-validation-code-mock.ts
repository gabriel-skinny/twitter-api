import { Validation } from "@applications/services/Client/entities/Validation/Validation";
import { AbstractCreateValidationCodeUseCase, ICreateValidationCodeParams } from "./create-validation-code";
import { ValidationCode } from "@applications/services/Client/entities/Validation/ValidationCode";

export class CreateValidationCodeMock extends AbstractCreateValidationCodeUseCase {
    async execute(data: ICreateValidationCodeParams): Promise<Validation> {
        return new Validation({ 
            email: data.email, 
            operationToValidateType: data.operationToValidateType, 
            validationCode: new ValidationCode(123456)
        })
    }
}