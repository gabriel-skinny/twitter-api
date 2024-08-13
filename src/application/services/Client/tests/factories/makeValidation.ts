import { OperationToValidateTypeEnum, Validation } from "../../entities/Validation/Validation";
import { ValidationCode } from "../../entities/Validation/ValidationCode";

export const makeValidation = (props?: Partial<Validation>) => {
    return new Validation({
        userEmail: "teste@gmail.com",
        operationToValidateType: OperationToValidateTypeEnum.EMAIL_CONFIMATION,
        validationCode: new ValidationCode(123456),
        ...props
    });
}