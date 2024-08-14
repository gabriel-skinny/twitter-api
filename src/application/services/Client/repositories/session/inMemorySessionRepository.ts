
import UserSession from "../../entities/User/Session";
import AbstractUserSessionRepository from "./sessionRepository";

export default class InMemoryUserSessionRepository  extends AbstractUserSessionRepository {
    public userSessionDatabase: UserSession[] = [];
    
    async save(session: UserSession): Promise<void> {
        console.log({ session: JSON.stringify(session)})
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

    async findAllUserSessionsByUserIdWhereNot<T extends keyof UserSession>
    (data: { userId: string; whereNot?: Partial<UserSession>; select?: { [P in T]: boolean; }; }): Promise<{ [P in T]: UserSession[P]; }[] | null> {
        const whereNotKeys = Object.keys(data.whereNot);
        
        console.log({ dataBase: JSON.stringify(this.userSessionDatabase)});

        const userSession = this.userSessionDatabase
        .filter(session => 
            session.userId == data.userId && 
            !(whereNotKeys.find(key => session[key] == data.whereNot[key]))
        );

        console.log({ return: JSON.stringify(userSession)})

        if (!userSession) return null;

        return userSession;
    } 
} 