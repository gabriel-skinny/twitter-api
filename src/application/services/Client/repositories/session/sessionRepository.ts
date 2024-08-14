import UserSession from "../../entities/User/Session";

export default abstract class AbstractUserSessionRepository {
    abstract save(userSession: UserSession): Promise<void>;
    abstract findByUserIdAndIp(data: {userId: string, ip: string}): Promise<UserSession | null>;
    abstract delete(id: string): Promise<void>;
} 