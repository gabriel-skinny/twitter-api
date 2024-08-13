import { Validation } from "../../entities/Validation/Validation";

export default abstract class AbstractValidationRepository {
    abstract save(Validation: Validation): Promise<void>; 
    abstract findByUserEmail(userEmail: string): Promise<Validation | null>;
}