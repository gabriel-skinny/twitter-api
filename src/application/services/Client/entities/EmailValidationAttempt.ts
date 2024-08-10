import { EXPIRES_EMAIL_ATTEMPT_IN_MINUTES, MAX_RETRIES_EMAIL_VALIDATION_ATTEMPT } from "@constants/emailValidationAttempt";
import { BaseAttempt } from "./baseAttempt";
import { randomUUID } from "crypto";

interface IEmailValidationAttemptProps {
    id?: string;
    emailValidationId: string;
    expiresInMinutes?: number;
    attempts?: number;
    createdAt?: Date;
}

export class EmailValidationAttempt extends BaseAttempt {
    private readonly _id: string;
    private readonly _emailValidationId: string;

    constructor(props: IEmailValidationAttemptProps) {
        super({
            attempts: props.attempts,
            createdAt: props.createdAt,
            max_attempts: MAX_RETRIES_EMAIL_VALIDATION_ATTEMPT,
            expiresInMinutes: props.expiresInMinutes,
            expiresInMinutesFixedValue: EXPIRES_EMAIL_ATTEMPT_IN_MINUTES
        });    
        this._emailValidationId = props.emailValidationId;
        this._id = props.id || randomUUID();
    }

    public get emailValidationId() {
        return this._emailValidationId;
    }

    public get id() {
        return this._id;
    }

}