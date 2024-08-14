import UserSession, { SessionDeviceTypesEnum } from "src/Client/application/entities/User/Session";
import ErrorUserNotFound from "src/Client/application/errors/userNotFound";

import AbstractSessionRepository from "src/Client/application/repositories/session/sessionRepository";
import AbstractUserRepository from "src/Client/application/repositories/user/userRepository";
import { AbstractAuthService } from "src/Client/application/services/AuthService";
import { Injectable } from "@nestjs/common";

interface ILoginUseCaseParams {
    email: string; 
    password: string; 
    ip: string;
    deviceType: SessionDeviceTypesEnum
}

@Injectable()
export default class LoginUseCase {
    constructor(
        private readonly userRepository: AbstractUserRepository,
        private readonly authService: AbstractAuthService,
        private readonly userSessionRepository: AbstractSessionRepository
    ) {}

    async execute({ email, password, ip, deviceType }: ILoginUseCaseParams): Promise<{ loginToken: string }> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) throw new ErrorUserNotFound();

        if (!user.password_hash.isTheSameValue(password)) throw new Error("Wrong password");

        const userSession = new UserSession({ 
            userId: user.id,
            ip,
            deviceType
        });
        
        await this.userSessionRepository.save(userSession);

        const loginToken = await this.authService.makeLoginTokenToUser(user);

        return { loginToken }
    }
}