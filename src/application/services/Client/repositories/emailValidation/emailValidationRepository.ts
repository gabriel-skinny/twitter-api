import { EmailValidation } from "../../entities/EmailValidation";

export default abstract class AbstractEmailValidationRepository {
    abstract save(emailValidation: EmailValidation): Promise<void>; 
}