import { randomUUID } from 'crypto';
import { EXPIRES_EMAIL_VALIDATION_IN_MINUTES } from 'src/Client/application/constants/emailValidation';
import { BaseExpiresIn } from '../base/baseExpiresIn';
import { ValidationCode } from './ValidationCode';

export enum OperationToValidateTypeEnum {
  EMAIL_CONFIRMATION = 'email_confirmation',
  PASSWORD_CHANGE = 'password_change',
}

interface IValidationProps {
  id?: string;
  validated?: boolean;
  operationToValidateType: OperationToValidateTypeEnum;
  email: string;
  validationCode: ValidationCode;
  expirationIn?: number;
  createdAt?: Date;
}

type IRawValues = Omit<
  IValidationProps,
  'id' | 'createdAt' | 'validated' | 'expirationIn'
>;

export class Validation extends BaseExpiresIn {
  private _id: string;
  private _validated: boolean;
  private _validationCode: ValidationCode;
  private rawValues: IRawValues;

  constructor(props: IValidationProps) {
    super({
      expiresInMinutesFixedValue: EXPIRES_EMAIL_VALIDATION_IN_MINUTES,
      expiresInValue: props.expirationIn,
      createdAt: props.createdAt,
    });

    this._id = props.id || randomUUID();
    this._validated = props.validated || false;
    this._validationCode = props.validationCode;

    this.rawValues = { ...props };
  }

  public get id() {
    return this._id;
  }

  public validate() {
    this._validated = true;
  }

  public get validated() {
    return this._validated;
  }

  public get email() {
    return this.rawValues.email;
  }

  public set email(email: string) {
    this.rawValues.email = email;
  }

  public get validationCode() {
    return this._validationCode;
  }

  public get operationToValidateType() {
    return this.rawValues.operationToValidateType;
  }

  public set validationCode(validationCode: ValidationCode) {
    this._validationCode = validationCode;
  }
}
