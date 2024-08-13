import { OperationToValidateTypeEnum, Validation } from "../../entities/Validation/Validation";
import AbstractValidationRepository from "./validationRepository";


export default class InMemoryValidationRepository implements AbstractValidationRepository {
    public validationDatabase: Validation[] = [];
    
    async save(Validation: Validation): Promise<void> {
        this.validationDatabase.push(Validation);
    }

    async findByEmail(email: string): Promise<Validation> {
      const validation = this.validationDatabase.find(validation => validation.email == email);

      if (!validation) return null;

      return validation;
    }

    async findByEmailAndOperation(data: { email: string; operationToValidateType: OperationToValidateTypeEnum; }): Promise<Validation | null> {
      const validation = this.validationDatabase.find(validation => validation.email == data.email && validation.operationToValidateType == data.operationToValidateType);

      if (!validation) return null;

      return validation;
    }

    async delete(validation: Validation): Promise<void> {
      this.validationDatabase = this.validationDatabase.filter(v => v.id !== validation.id);
    }
}