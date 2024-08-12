import User from "../entities/User";
import { AbstractAuthService } from "./AuthService";

export default class AuthServiceStub extends AbstractAuthService {
    async makeAuthTokenToUser(user: User): Promise<string> {
        return "jwt_string_token";
    }
    
}