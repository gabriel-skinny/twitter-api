import { EXPIRES_LOGIN_ATTEMPT_IN_MINUTES, MAX_RETRIS_LOGIN_ATTEMPT } from "@constants/loginAttempt";
import { BaseAttempt } from "./base/baseAttempt";
import { randomUUID } from "crypto";

interface ILoginAttemptProps {
    id?: string;
    expiresInMinutes?: number;
    userEmail: string;
    attempts?: number;
    createdAt?: Date;
}



export class LoginAttempt extends BaseAttempt {
    private readonly _id: string;
    private readonly _userEmail: string;

    constructor(props: ILoginAttemptProps) {
        super({
            attempts: props.attempts,
            createdAt: props.createdAt,
            max_attempts: MAX_RETRIS_LOGIN_ATTEMPT,
            expiresInMinutes: props.expiresInMinutes,
            expiresInMinutesFixedValue: EXPIRES_LOGIN_ATTEMPT_IN_MINUTES
        })

        this._userEmail = props.userEmail;
        this._id = props.id || randomUUID();
    }

    public get userEmail() {
        return this._userEmail;
    }

    public get id() {
        return this._id;
    }
}