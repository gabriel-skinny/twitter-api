import { Validation } from "src/Client/application/entities/Validation/Validation";
import { AbstractCreateValidationCodeUseCase, ICreateValidationCodeParams } from "./create-validation-code";
import { ValidationCode } from "src/Client/application/entities/Validation/ValidationCode";

export class CreateValidationCodeMock extends AbstractCreateValidationCodeUseCase {
    async execute(data: ICreateValidationCodeParams): Promise<Validation> {
        return new Validation({ 
            email: data.email, 
            operationToValidateType: data.operationToValidateType, 
            validationCode: new ValidationCode(123456)
        })
    }
}