import { IsEmail, IsEnum, IsNotEmpty, IsNumber, Length } from 'class-validator';
import { OperationToValidateTypeEnum } from 'src/Client/application/entities/Validation/Validation';

export class ValidateDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(OperationToValidateTypeEnum)
  operationToValidateType: OperationToValidateTypeEnum;

  @IsNotEmpty()
  @IsNumber()
  @Length(6)
  validationCode: number;
}

export class ResendCodeValidationDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(OperationToValidateTypeEnum)
  operationToValidateType: OperationToValidateTypeEnum;
}
