import { LoginAttempt } from "../../entities/LoginAttempt";


export default abstract class AbstractLoginAttemptRepository {
    abstract save(loginAttempt: LoginAttempt): Promise<void>; 
    abstract findByUserEmail(userEmail: string): Promise<LoginAttempt | null>;
}