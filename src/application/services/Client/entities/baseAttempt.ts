import { BaseExpiresIn } from "./baseExpiresIn";

interface IBaseAttempProps {
    expiresInMinutes?: number;
    expiresInMinutesFixedValue: number;
    attempts?: number;
    max_attempts: number;
    createdAt?: Date;
}

export class BaseAttempt extends BaseExpiresIn {
    private _attemps: number;
    private _max_attempts: number;

    constructor(props: IBaseAttempProps) {
        super({ 
            expiresInValue: props.expiresInMinutes,
            expiresInMinutesFixedValue: props.expiresInMinutesFixedValue,
            createdAt: props.createdAt
        })

        this._attemps = 0;
        this._max_attempts = props.max_attempts;
    }


    public get attempts() {
        return this._attemps;
    }

    public addAttempt() {
        if (this.isOnMaxAttemps()) throw new Error("Cannot add more attemps")
        this._attemps += 1;
    }

    public isOnMaxAttemps() {
        return this._attemps >= this._max_attempts
    }
}