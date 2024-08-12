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

    async findById(id: string): Promise<User | null> {
        const user = this.userDatabase.find(u => u.id == id);

        if (!user) return null

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = this.userDatabase.find(u => u.email == email);

        if (!user) return null

        return user;
    }
}