
export class CreateUserDto {
    name: string;
    email: string;
    password: string;
}

export class UpdateUserDto {
    profileName?: string;
    profilePictureS3Url?: string;
    bannerS3Url?: string;
    location?: string;
    website?: string;
    bio?: string;
}