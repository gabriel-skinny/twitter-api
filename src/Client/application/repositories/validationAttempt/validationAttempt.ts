import { ValidationAttempt } from "../../entities/Validation/ValidationAttempt";

export default abstract class AbstractValidationAttemptRepository {
    abstract save(validationAttempt: ValidationAttempt): Promise<void>; 
    abstract findByValidationId(validationId: string): Promise<ValidationAttempt | null>;
}