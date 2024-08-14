
import { ValidationAttempt } from "../../entities/Validation/ValidationAttempt";
import AbstractValidationAttemptRepository from "./validationAttempt";


export default class InMemoryValidationAttemptRepository implements AbstractValidationAttemptRepository {
    public validationAttempDatabase: ValidationAttempt[] = [];
    
    async save(Validation: ValidationAttempt): Promise<void> {
        this.validationAttempDatabase.push(Validation);
    }

    async findByValidationId(validationId: string): Promise<ValidationAttempt> {
      const validation = this.validationAttempDatabase.find(validation => validation.validationId == validationId);

      if (!validation) return null;

      return validation;
    }
}