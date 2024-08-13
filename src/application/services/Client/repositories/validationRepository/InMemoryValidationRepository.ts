import { Validation } from "../../entities/Validation/Validation";
import AbstractValidationRepository from "./validationRepository";


export default class InMemoryValidationRepository implements AbstractValidationRepository {
    public validationDatabase: Validation[] = [];
    
    async save(Validation: Validation): Promise<void> {
        this.validationDatabase.push(Validation);
    }

    async findByUserEmail(userEmail: string): Promise<Validation> {
      const validation = this.validationDatabase.find(validation => validation.userEmail == userEmail);

      if (!validation) return null;

      return validation;
    }
}