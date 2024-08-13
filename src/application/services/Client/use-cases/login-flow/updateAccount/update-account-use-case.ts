import ErrorUserNotFound from "@applications/services/Client/errors/userNotFound";
import AbstractUserRepository from "@applications/services/Client/repositories/user/userRepository";

interface IParamsUpdateAccount {
    id: string;
    userData: {
        bannerPictureS3Url?: string;
        profilePictureS3Url?: string;
        bio?: string;
        location?: string;
        website?: string,
        profileName?: string;
    }
}

export default class UpdateAccountUseCase {
    
    constructor(
        private readonly userRepository: AbstractUserRepository,
    ) {}
    
    async execute({ id, userData }: IParamsUpdateAccount) {
        const user = await this.userRepository.findById(id);

        if (!user) throw new ErrorUserNotFound();

        user.updateFields(userData);

        await this.userRepository.save(user);
    }
}