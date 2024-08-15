import { Validation } from 'src/Client/application/entities/Validation/Validation';
import { ValidationCode } from 'src/Client/application/entities/Validation/ValidationCode';
import { ValidationModel } from '../mongodb/schemas/validation';

export const validationToModel = (validation: Partial<Validation>) => {
  return new ValidationModel({
    id: validation.id,
    email: validation.email,
    validated: validation.validated,
    expirationIn: validation.expiresIn,
    createdAt: validation.createdAt,
    operationToValidateType: validation.operationToValidateType,
    validationCode: validation.validationCode.value,
  });
};

export const validationModelToRaw = (validationModel: ValidationModel) => {
  return new Validation({
    id: validationModel.id,
    email: validationModel.email,
    validated: validationModel.validated,
    expirationIn: validationModel.expirationIn,
    createdAt: validationModel.createdAt,
    operationToValidateType: validationModel.operationToValidateType,
    validationCode: new ValidationCode(validationModel.validationCode),
  });
};
