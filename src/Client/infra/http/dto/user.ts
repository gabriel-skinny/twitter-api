import { IsOptional, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    @IsStrongPassword({ minLength: 8 })
    password: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    profileName?: string;

    @IsOptional()
    @IsString()
    profilePictureS3Url?: string;

    @IsOptional()
    @IsString()
    bannerS3Url?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    website?: string;
    
    @IsOptional()
    @IsString()
    bio?: string;
}