import {
  OperationToValidateTypeEnum,
  Validation,
} from '../../entities/Validation/Validation';

export default abstract class AbstractValidationRepository {
  abstract save(validation: Validation): Promise<void>;
  abstract findByEmail(email: string): Promise<Validation | null>;
  abstract findByEmailAndOperation(data: {
    email: string;
    operationToValidateType: OperationToValidateTypeEnum;
  }): Promise<Validation | null>;
  abstract delete(id: string): Promise<void>;
  abstract updateById(data: {
    id: string;
    data: Partial<Validation>;
  }): Promise<void>;
}
