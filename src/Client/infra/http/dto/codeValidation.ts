import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Length,
} from 'class-validator';
import { OperationToValidateTypeEnum } from 'src/Client/application/entities/Validation/Validation';

export class ValidateDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(OperationToValidateTypeEnum)
  operationToValidateType: OperationToValidateTypeEnum;

  @IsNotEmpty()
  @IsInt()
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

export class CreateCodeValidationDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(OperationToValidateTypeEnum)
  operationToValidateType: OperationToValidateTypeEnum;
}
