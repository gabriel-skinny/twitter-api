import { Password } from "@applications/services/Client/entities/Password";
import ErrorUserNotFound from "@applications/services/Client/errors/userNotFound";
import AbstractUserRepository from "@applications/services/Client/repositories/user/userRepository";


interface IResetPasswordParams {
    userId: string;
    newPassword: string;
    oldPassword: string;
}

export default class ResetPasswordUseCase {
    constructor(private readonly userRepository: AbstractUserRepository) {}
    
    async execute({ userId, newPassword }: IResetPasswordParams) {
        const user = await this.userRepository.findById(userId);

        if (!user) throw new ErrorUserNotFound();

        const newPasswordEntity = new Password(newPassword);

        if (newPasswordEntity.isTheSameValue(oldPassword)) throw new Error("Cannot be the same password");



    }
} 