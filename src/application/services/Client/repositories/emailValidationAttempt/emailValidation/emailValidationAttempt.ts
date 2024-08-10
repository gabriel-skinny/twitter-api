import { EmailValidationAttempt } from "@applications/services/Client/entities/EmailValidationAttempt";


export default abstract class AbstractEmailValidationAttemptRepository {
    abstract save(emailValidationAttempt: EmailValidationAttempt): Promise<void>; 
    abstract findByUserId(userId: string): Promise<EmailValidationAttempt | null>;
}