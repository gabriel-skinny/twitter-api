import { LoginAttempt } from "@applications/services/Client/entities/LoginAttempt";
import ErrorUserNotFound from "@applications/services/Client/errors/userNotFound";
import AbstractLoginAttemptRepository from "@applications/services/Client/repositories/loginAttempt/loginAttemptRepository";
import AbstractUserRepository from "@applications/services/Client/repositories/userRepository/userRepository";
import { AbstractAuthService } from "@applications/services/Client/services/AuthService";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class LoginUseCase {
    constructor(
        private readonly loginAttemptRepository: AbstractLoginAttemptRepository,
        private readonly userRepository: AbstractUserRepository,
        private readonly authService: AbstractAuthService
    ) {}

    async execute({ email, password }: {email: string; password: string; }): Promise<{ userToken: string }> {
        const loginAttempt = await this.loginAttemptRepository.findByUserEmail(email);

        if (loginAttempt?.isOnMaxAttemps()) 
            throw new Error(`Too much login retries. Wait ${loginAttempt.expiresIn} minutes to retry`);

        const user = await this.userRepository.findByEmail(email);

        if (!user) throw new ErrorUserNotFound();

        if (!user.password_hash.isTheSameValue(password)) {
            if (loginAttempt) {
                loginAttempt.addAttempt();
                await this.loginAttemptRepository.save(loginAttempt);
            } else {
                const newLoginAttempt = new LoginAttempt({ userEmail: user.email})
                await this.loginAttemptRepository.save(newLoginAttempt);
            }

            throw new Error("Wrong password");
        }

        const userToken = await this.authService.makeAuthTokenToUser(user);

        return { userToken }
    }
}