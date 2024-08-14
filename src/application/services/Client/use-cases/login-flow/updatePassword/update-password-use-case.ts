
import { Password } from "@applications/services/Client/entities/User/Password";
import ErrorUserNotFound from "@applications/services/Client/errors/userNotFound";
import AbstractUserRepository from "@applications/services/Client/repositories/user/userRepository";


interface IUpdatePasswordParams {
    userId: string;
    newPassword: string;
}

export default class UpdatePasswordUseCase {
    constructor(private readonly userRepository: AbstractUserRepository) {}
    
    async execute({ userId, newPassword }: IUpdatePasswordParams) {
        const user = await this.userRepository.findById(userId);

        if (!user) throw new ErrorUserNotFound();

        if (user.password_hash.isTheSameValue(newPassword)) throw new Error("Cannot be the same password");

        const newPasswordHash = new Password(newPassword)
        user.password_hash = newPasswordHash;         

        await this.userRepository.save(user);
    }
} 