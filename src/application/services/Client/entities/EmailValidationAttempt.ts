import { EXPIRES_EMAIL_ATTEMPT_IN_MINUTES, MAX_RETRIES_EMAIL_VALIDATION_ATTEMPT } from "@constants/emailValidationAttempt";
import { BaseAttempt } from "./baseAttempt";

interface IEmailValidationAttemptProps {
    id?: string;
    userId: string;
    expiresInMinutes?: number;
    attempts?: number;
    createdAt?: Date;
}

export class EmailValidationAttempt extends BaseAttempt {
    private readonly _userId: string;

    constructor(props: IEmailValidationAttemptProps) {
        super({
            ...props, 
            max_attempts: MAX_RETRIES_EMAIL_VALIDATION_ATTEMPT,
            expiresInMinutes: EXPIRES_EMAIL_ATTEMPT_IN_MINUTES
        });    
        this._userId = props.userId;
    }

    public get userId() {
        return this._userId;
    }

}