import { OperationToValidateTypeEnum, Validation } from "../../entities/Validation/Validation";
import { ValidationCode } from "../../entities/Validation/ValidationCode";

export const makeValidation = (props?: Partial<Validation>) => {
    return new Validation({
        email: "teste@gmail.com",
        operationToValidateType: OperationToValidateTypeEnum.EMAIL_CONFIRMATION,
        validationCode: new ValidationCode(123456),
        ...props
    });
}