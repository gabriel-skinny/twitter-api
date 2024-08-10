import { EmailValidation } from "../../entities/EmailValidation";

export default abstract class AbstractEmailValidationRepository {
    abstract save(emailValidation: EmailValidation): Promise<void>; 
    abstract findByUserEmail(userEmail: string): Promise<EmailValidation | null>;
}