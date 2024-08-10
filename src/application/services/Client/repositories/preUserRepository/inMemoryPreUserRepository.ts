import PreUser from "../../entities/PreUser";
import AbstractPreUserRepository from "./preUserRepository";


export default class InMemoryPreUserRepositroy implements AbstractPreUserRepository {
    public preUserDatabase: PreUser[] = [];
    
    async save(preUser: PreUser): Promise<void> {
        this.preUserDatabase.push(preUser);
    }

    async existsByEmail(email: string): Promise<boolean> {
        return !!this.preUserDatabase.filter(u => u.email == email).length;
    }
    async existsByName(name: string): Promise<boolean> {
        return !!this.preUserDatabase.filter(u => u.name == name).length;
    }

    async findById(id: string): Promise<PreUser | null> {
        const preUser = this.preUserDatabase.find(u => u.id == id);

        if (!preUser) return null

        return preUser;
    }

    async deleteByEmail(email: string): Promise<void> {
        this.preUserDatabase = this.preUserDatabase.filter(u => u.email !== email); 
    }
}