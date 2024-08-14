import AbstractPreUserRepository from "src/Client/application/repositories/preUser/preUserRepository";
import { Injectable } from "@nestjs/common";
import User from "../../../entities/User/User";
import ErrorUserNotFound from "../../../errors/userNotFound";
import AbstractUserRepository from "../../../repositories/user/userRepository";
import { AbstractAuthService } from "../../../services/AuthService";


@Injectable()
export default class CreateAccountUseCase {
    constructor(
        private readonly preUserRepository: AbstractPreUserRepository,
        private readonly userRepository: AbstractUserRepository,
        private readonly authService: AbstractAuthService
    ) {}
    
    async execute( preUserId: string) {
        const preUser = await this.preUserRepository.findById(preUserId);
        
        if (!preUser) throw new ErrorUserNotFound();

        const user = new User({
            name: preUser.name,
            email: preUser.email,
            password_hash: preUser.password_hash
        });

        await this.userRepository.save(user);

        const userToken = await this.authService.makeLoginTokenToUser(user);

        return userToken;
    }
}