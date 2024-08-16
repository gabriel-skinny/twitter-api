import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
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
  @IsUrl()
  profilePictureS3Url?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
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

export class UpdateUserEmailDTO {
  @IsNotEmpty()
  @IsEmail()
  newEmail: string;
}
