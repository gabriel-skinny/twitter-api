import User from "../entities/User/User";

export enum TokenTypeEnum {
    LOGIN = "login",
    PASSWORD_CHANGE = "password_change",
    EMAIL_CONFIMATION = "email_confirmation"
}

export abstract class AbstractAuthService {
    abstract makeLoginTokenToUser(user: User): Promise<string>;
    abstract makeToken(data: {userEmail: string, tokenType: TokenTypeEnum}): Promise<string>;
}