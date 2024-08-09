import { randomUUID } from "crypto";
import ErrorEmailValidationEntityCreation from "../errors/emailValidationEntityCreation";
import { randomSixNumberLengthGenerator } from "@helpers/randomNumberGenerator";
import { ValidationCode } from "./ValidationCode";

interface IEmailValidationProps {
	id?: string;
	validated?: boolean;
    userId: string;
    validationCode: ValidationCode;
	expirationInHours?: number;
    createdAt?: Date;
}

type IRawValues = Omit<IEmailValidationProps, 
"id" | "createdAt" | "validated" | "expirationInHours"
>;

const FIXED_EXPIRATION_HOURS = 2;

export class EmailValidation {
	private _id: string;
	private _createdAt: Date;
	private _validated: boolean;
	private _validationCode: ValidationCode;
	private _expirationInHours: number;
	private rawValues: IRawValues;

 constructor(props: IEmailValidationProps) {
	this._id = props.id || randomUUID();
	this._createdAt = props.createdAt || new Date();
	this._validated = props.validated || false;
	this._validationCode = props.validationCode;
	this._expirationInHours = props.expirationInHours || FIXED_EXPIRATION_HOURS;

	this.fieldValidation();

	this.rawValues = { ...props }
 }

 private fieldValidation() {
	if (this._expirationInHours !== FIXED_EXPIRATION_HOURS) 
			throw new ErrorEmailValidationEntityCreation(`ExpirationInHours has to be ${FIXED_EXPIRATION_HOURS}`) 
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

 public get userId() {
	return this.rawValues.userId;
 }

 public get validationCode() {
	return this._validationCode;
 }

 public get expirationInHours() {
	return this._expirationInHours
 }

 public get createdAt() {
	return this._createdAt;
 }
}