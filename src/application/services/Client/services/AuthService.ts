import User from "../entities/User";

export abstract class AbstractAuthService {
    abstract makeAuthTokenToUser(user: User): Promise<string>;
}