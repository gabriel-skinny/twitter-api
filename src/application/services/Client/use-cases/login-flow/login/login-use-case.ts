import UserSession, { SessionDeviceTypesEnum } from "@applications/services/Client/entities/User/Session";
import ErrorUserNotFound from "@applications/services/Client/errors/userNotFound";

import AbstractSessionRepository from "@applications/services/Client/repositories/session/sessionRepository";
import AbstractUserRepository from "@applications/services/Client/repositories/user/userRepository";
import { AbstractAuthService } from "@applications/services/Client/services/AuthService";
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

    async execute({ email, password, ip, deviceType }: ILoginUseCaseParams): Promise<{ userToken: string }> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) throw new ErrorUserNotFound();

        if (!user.password_hash.isTheSameValue(password)) throw new Error("Wrong password");

        const userSession = new UserSession({ 
            userId: user.id,
            ip,
            deviceType
        });
        
        await this.userSessionRepository.save(userSession);

        const userToken = await this.authService.makeLoginTokenToUser(user);

        return { userToken }
    }
}