import { randomUUID } from "crypto";

interface IBaseAttemp {
    id?: string;
    expiresInMinutes: number;
    attempts?: number;
    max_attempts: number;
    createdAt?: Date;
}

export class BaseAttempt {
    private _id: string;
    private _expiresInMinutes: number;
    private _attemps: number;
    private _createdAt: Date;
    private _max_attempts: number;

    constructor(props: IBaseAttemp) {
        this._id = props.id || randomUUID();
        this._expiresInMinutes = props.expiresInMinutes;
        this._attemps = 0;
        this._max_attempts = props.max_attempts;
        this._createdAt = new Date();
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

    public addAttempt() {
        if (this.isOnMaxAttemps) throw new Error("Cannot add more attemps")
        this._attemps += 1;
    }

    public isOnMaxAttemps() {
        return this._attemps >= this._max_attempts
    }

    public isExpired() {
        return diferenceInMinutes(this._createdAt, Date.now()) >= this._expiresInMinutes;
    }

    public get createdAt() {
        return this._createdAt;
    }
}