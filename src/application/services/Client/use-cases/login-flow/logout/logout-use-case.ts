import AbstractUserSessionRepository from "@applications/services/Client/repositories/session/sessionRepository";

export default class LogoutUseCase {
    constructor (
        private readonly userSessionRepository: AbstractUserSessionRepository 
    ) {}

    async execute({ userId, ip }: { userId: string, ip: string }) {
        const userSession = await this.userSessionRepository.findByUserIdAndIp({
            userId,
            ip
        });

        if (!userSession) throw new Error("User session not found");

        await this.userSessionRepository.delete(userSession.id);
    }
}