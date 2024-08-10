import { EXPIRES_LOGIN_ATTEMPT_IN_MINUTES, MAX_RETRIS_LOGIN_ATTEMPT } from "@constants/loginAttempt";
import ErrorLoginAttempEntityCreation from "../errors/loginAttempEntityCreation";
import { BaseAttempt } from "./baseAttempt";

interface ILoginAttemptProps {
    id?: string;
    expiresInMinutes?: number;
    userEmail: string;
    attempts?: number;
    createdAt?: Date;
}

type IRawValues = Omit<ILoginAttemptProps, 
"id" | "expiresInMinutes" | "attempts" | "createdAt"
>

export class LoginAttempt extends BaseAttempt {
    private readonly _userEmail: string;

    constructor(props: ILoginAttemptProps) {
        super({
            ...props,
            max_attempts: MAX_RETRIS_LOGIN_ATTEMPT,
            expiresInMinutes: EXPIRES_LOGIN_ATTEMPT_IN_MINUTES
        })
        this.dataValidation();

        this._userEmail = props.userEmail;
    }

    private dataValidation () {
        if (this.expiresInMinutes !== EXPIRES_LOGIN_ATTEMPT_IN_MINUTES) {
            throw new ErrorLoginAttempEntityCreation(`Expires in has to be equal to ${EXPIRES_LOGIN_ATTEMPT_IN_MINUTES}`)
        }
    }

    public get userEmail() {
        return this._userEmail;
    }
}