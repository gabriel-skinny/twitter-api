import { randomUUID } from "crypto";
import { Replace } from "src/helpers/replace";
import CryptoService from "../util/cryptoService";
import { Password } from "./Password";

interface IUserProps {
    id?: string;
    name: string;
    email: string;
    password_hash: Password;
    profileName?: string;
    email_validated: boolean;
    profilePictureS3Url?: string;
    bannerS3Url?: string;
    location?: string;
    website?: string;
    bio?: string;
    createdAt?: Date;
}

type IRawValues = Omit<IUserProps, "id" | "createdAt">; 

export default class User {
    private readonly _id: string;
    private readonly _createdAt: Date; 
    private readonly rawValues: IRawValues;
    
    constructor (props: IUserProps) {
        this._id =  props.id || randomUUID();
        this._createdAt = props.createdAt || new Date();

        this.rawValues = { ...props };
    }

    public get id() {
        return this._id;
    }

    public get email() {
        return this.rawValues.email;
    }

    public get name() {
        return this.rawValues.name
    }

    public get profileName() {
        return this.rawValues.profileName;
    }
    
    public get email_validated() {
        return this.rawValues.email_validated;
    }
    
    public get profilePictureS3Url() {
        return this.rawValues.profilePictureS3Url;
    }
    public get bannerS3Url() {
        return this.rawValues.bannerS3Url;
    }

    public get location() {
        return this.rawValues.location;
    }
    public get website() {
        return this.rawValues.website;
    }
    public get bio() {
        return this.rawValues.bio;
    }
    
    public get password_hash(): Password {
        return this.rawValues.password_hash;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }
}