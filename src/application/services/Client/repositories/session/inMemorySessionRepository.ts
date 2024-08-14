
import UserSession from "../../entities/User/Session";
import AbstractUserSessionRepository from "./sessionRepository";

export default class InMemoryUserSessionRepository  extends AbstractUserSessionRepository { 
    public userSessionDatabase: UserSession[] = [];
    
    async save(session: UserSession): Promise<void> {
        this.userSessionDatabase.push(session);
    };

    async findByUserIdAndIp({userId, ip }: { userId: string, ip: string }): Promise<UserSession | null> {
        const userSession = this.userSessionDatabase
        .find(session => session.userId == userId && session.ip == ip);

        if (!userSession) return null;

        return userSession;
    }

    async delete(id: string): Promise<void> {
        this.userSessionDatabase = this.userSessionDatabase.filter(u => u.id !== id);
    }
} 