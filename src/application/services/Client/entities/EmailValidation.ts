import { EXPIRES_EMAIL_VALIDATION_IN_MINUTES } from "@constants/emailValidation";
import { randomUUID } from "crypto";
import { ValidationCode } from "./ValidationCode";
import { BaseExpiresIn } from "./baseExpiresIn";
import { EmailValidationAttempt } from "./EmailValidationAttempt";

interface IEmailValidationProps {
	id?: string;
	validated?: boolean;
    userEmail: string;
    validationCode: ValidationCode;
	validationAttempt?: EmailValidationAttempt;
	expirationIn?: number;
    createdAt?: Date;
}

type IRawValues = Omit<IEmailValidationProps, 
"id" | "createdAt" | "validated" | "expirationIn"
>;

export class EmailValidation extends BaseExpiresIn{
	private _id: string;
	private _validated: boolean;
	private _validationCode: ValidationCode;
	private _validationAttempt: EmailValidationAttempt;
	private rawValues: IRawValues;

 constructor(props: IEmailValidationProps) {
	super({ 
		expiresInMinutesFixedValue: EXPIRES_EMAIL_VALIDATION_IN_MINUTES,
		expiresInValue: props.expirationIn,
		createdAt: props.createdAt
	})

	this._id = props.id || randomUUID();
	this._validated = props.validated || false;
	this._validationCode = props.validationCode;

	this.rawValues = { ...props }

	this._validationAttempt = props.validationAttempt || new EmailValidationAttempt({ emailValidationId: this._id });
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

 public get userEmail() {
	return this.rawValues.userEmail;
 }

 public set userEmail(email: string) {
	this.rawValues.userEmail = email;
 }

 public get validationCode() {
	return this._validationCode;
 }

 public get validationAttempt() {
	return this._validationAttempt;
 }

 public set validationCode(validationCode: ValidationCode) {
	this._validationCode = validationCode;
 }

}