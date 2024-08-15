import { IsEmail, IsEnum, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { SessionDeviceTypesEnum } from 'src/Client/application/entities/User/Session';

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(SessionDeviceTypesEnum)
  deviceType: SessionDeviceTypesEnum;
}

export class UpdatePasswordDTO {
  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string;
}

export class ForgotPasswordDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
