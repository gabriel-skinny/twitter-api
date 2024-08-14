import UserSession from "../../entities/User/Session";

type SelectProperties<T, K extends keyof T> = {
    [P in K]: T[P];
  };

export default abstract class AbstractUserSessionRepository {
    abstract save(userSession: UserSession): Promise<void>;
    abstract findByUserIdAndIp(data: {userId: string, ip: string}): Promise<UserSession | null>;
    abstract findAllUserSessionsByUserIdWhereNot<T extends keyof UserSession>(data: { 
        userId: string, 
        whereNot?: Partial<UserSession>, 
        select?: {[P in T]: boolean}})
        : Promise<SelectProperties<UserSession, T>[] | null>;
    abstract delete(id: string): Promise<void>;
} 