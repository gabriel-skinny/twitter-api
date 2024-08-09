import User from "../../entities/User";

export default abstract class AbstractUserRepository {
    abstract save(user: User): Promise<void>; 
    abstract existsByEmail(email: string): Promise<boolean>
    abstract existsByName(name: string): Promise<boolean>;
}