import { randomUUID } from "crypto";
import { Password } from "./Password";
import { EXPIRES_PREUSER_IN_MINUTES } from "src/Client/application/constants/preUser";
import { BaseExpiresIn } from "../base/baseExpiresIn";


interface IPreUserProps {
    id?: string;
    name: string;
    email: string;
    password_hash: Password;
    expiresIn?: number;
    createdAt?: Date;
}

type IRawValues = Omit<IPreUserProps, "id" | "expiresIn" | "createdAt">; 

export default class PreUser extends BaseExpiresIn {
    private readonly _id: string;
    private readonly rawValues: IRawValues;
    
    constructor (props: IPreUserProps) {
        super({
            expiresInMinutesFixedValue: EXPIRES_PREUSER_IN_MINUTES,
            expiresInValue: props.expiresIn,
            createdAt: props.createdAt
        })

        this._id =  props.id || randomUUID();
        this.rawValues = { ...props };
    }

    public get id() {
        return this._id;
    }

    public get email() {
        return this.rawValues.email;
    }
    
    public set email(email: string) {
        this.rawValues.email = email;
    }

    public get name() {
        return this.rawValues.name
    }

    public get password_hash(): Password {
        return this.rawValues.password_hash;
    }
}