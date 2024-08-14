import AbstractUserRepository from "@applications/services/Client/repositories/user/userRepository";

export class DeleteAccountUseCase {
    constructor(private readonly userRepository: AbstractUserRepository) {}

    async execute(userId: string) {
        await this.userRepository.delete(userId);
    }
}