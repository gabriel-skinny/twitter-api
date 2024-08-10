import { EmailValidationAttempt } from "@applications/services/Client/entities/EmailValidationAttempt";


export default abstract class AbstractEmailValidationAttemptRepository {
    abstract save(emailValidationAttempt: EmailValidationAttempt): Promise<void>; 
    abstract findByEmailValidationId(emailValidationId: string): Promise<EmailValidationAttempt | null>;
}