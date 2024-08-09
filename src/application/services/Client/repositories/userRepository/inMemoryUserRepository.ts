import User from "../../entities/User";
import AbstractUserRepository from "./userRepository";


export default class InMemoryUserRepositroy implements AbstractUserRepository {

    public userDatabase: User[] = [];
    
    async save(user: User): Promise<void> {
        this.userDatabase.push(user);
    }

    async existsByEmail(email: string): Promise<boolean> {
        return !!this.userDatabase.filter(u => u.email == email).length;
    }
    async existsByName(name: string): Promise<boolean> {
        return !!this.userDatabase.filter(u => u.name == name).length;
    }
}