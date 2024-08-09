import { EXPIRES_LOGIN_ATTEMP_IN_MINUTES } from "@constants/loginAttempt";
import { randomUUID } from "crypto";
import ErrorLoginAttempEntityCreation from "../errors/loginAttempEntityCreation";

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

export class LoginAttempt {
    private _id: string;
    private _expiresInMinutes: number;
    private _attemps: number;
    private _createdAt: Date;

    private rawValues: IRawValues;

    constructor(props: ILoginAttemptProps) {
        this._id = props.id || randomUUID();
        this._expiresInMinutes = props.expiresInMinutes || EXPIRES_LOGIN_ATTEMP_IN_MINUTES;
        this._attemps = 0;
        this._createdAt = new Date();

        this.dataValidation();

        this.rawValues = { ...props }
    }

    private dataValidation () {
        if (this._expiresInMinutes !== EXPIRES_LOGIN_ATTEMP_IN_MINUTES) {
            throw new ErrorLoginAttempEntityCreation(`Expires in has to be equal to ${EXPIRES_LOGIN_ATTEMP_IN_MINUTES}`)
        }
    }
 
    public get id() {
        return this._id;
    }

    public get expiresInMinutes() {
        return this._expiresInMinutes;
    }

    public get attempts() {
        return this._attemps;
    }

    public get userEmail() {
        return this.rawValues.userEmail;
    }

    public get createdAt() {
        return this._createdAt;
    }
}