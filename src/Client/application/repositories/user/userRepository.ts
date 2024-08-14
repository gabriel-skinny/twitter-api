import User from "../../entities/User/User";

export default abstract class AbstractUserRepository {
    abstract save(user: User): Promise<void>; 
    abstract existsByEmail(email: string): Promise<boolean>
    abstract existsByName(name: string): Promise<boolean>;
    abstract findById(id: string): Promise<User | null>;
    abstract findByEmail(email: string): Promise<User | null>;
    abstract delete(id: string): Promise<void>;
}