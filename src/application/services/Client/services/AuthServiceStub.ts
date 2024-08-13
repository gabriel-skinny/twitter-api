import User from "../entities/User/User";
import { AbstractAuthService, TokenTypeEnum } from "./AuthService";

export default class AuthServiceStub extends AbstractAuthService {
    async makeLoginTokenToUser(user: User): Promise<string> {
        return "jwt_string_token";
    }

    async makeToken(data: { userEmail: string; tokenType: TokenTypeEnum; }): Promise<string> {
        return "jwt_string_token";
    }
    
}