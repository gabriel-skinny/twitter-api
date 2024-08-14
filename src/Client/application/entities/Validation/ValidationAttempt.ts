import { EXPIRES_EMAIL_ATTEMPT_IN_MINUTES, MAX_RETRIES_EMAIL_VALIDATION_ATTEMPT } from "src/Client/application/constants/emailValidationAttempt";
import { BaseAttempt } from "../base/baseAttempt";
import { randomUUID } from "crypto";

interface IValidationAttemptProps {
    id?: string;
    validationId: string;
    expiresInMinutes?: number;
    attempts?: number;
    createdAt?: Date;
}

export class ValidationAttempt extends BaseAttempt {
    private readonly _id: string;
    private readonly _validationId: string;

    constructor(props: IValidationAttemptProps) {
        super({
            attempts: props.attempts,
            createdAt: props.createdAt,
            max_attempts: MAX_RETRIES_EMAIL_VALIDATION_ATTEMPT,
            expiresInMinutes: props.expiresInMinutes,
            expiresInMinutesFixedValue: EXPIRES_EMAIL_ATTEMPT_IN_MINUTES
        });    
        this._validationId = props.validationId;
        this._id = props.id || randomUUID();
    }

    public get validationId() {
        return this._validationId;
    }

    public get id() {
        return this._id;
    }

}