import { LoginAttempt } from "../../entities/LoginAttempt";
import AbstractLoginAttemptRepository from "./loginAttemptRepository";


export default class InMemoryLoginAttemptRepository implements AbstractLoginAttemptRepository {
    public loginAttemptDatabase: LoginAttempt[] = [];
    
    async save(loginAttempt: LoginAttempt): Promise<void> {
      const foundedLoginIndex = this.loginAttemptDatabase.findIndex(l => l.id == loginAttempt.id);  
      if (foundedLoginIndex != -1) this.loginAttemptDatabase[foundedLoginIndex] = loginAttempt;
      else this.loginAttemptDatabase.push(loginAttempt);
    }

    async findByUserEmail(userEmail: string): Promise<LoginAttempt> {
      const loginAttempt = this.loginAttemptDatabase.find(loginAttempt => loginAttempt.userEmail == userEmail);

      if (!loginAttempt) return null;

      return loginAttempt;
    }
}