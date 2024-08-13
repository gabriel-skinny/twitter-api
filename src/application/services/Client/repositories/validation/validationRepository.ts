import { Validation } from "../../entities/Validation/Validation";

export default abstract class AbstractValidationRepository {
    abstract save(validation: Validation): Promise<void>; 
    abstract findByUserEmail(userEmail: string): Promise<Validation | null>;
    abstract delete(validation: Validation): Promise<void>;
}