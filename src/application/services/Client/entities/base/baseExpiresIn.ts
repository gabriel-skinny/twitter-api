import DateManipulation from "@helpers/DateManipulation";

interface IBaseExpiresInProps {
    expiresInValue?: number;
    expiresInMinutesFixedValue: number;
    createdAt?: Date;
}

export class BaseExpiresIn {
    private readonly _expiresIn: number;
    private readonly _createdAt: Date;

    constructor(props: IBaseExpiresInProps) {
        this._expiresIn = props.expiresInValue || props.expiresInMinutesFixedValue;
        this._createdAt = props.createdAt || new Date();

        if (this._expiresIn !== props.expiresInMinutesFixedValue) throw new Error("Could not create entity with that expiresIn value");
    }

    public isExpired() {
        return DateManipulation.differenceInMinutes(this._createdAt, new Date()) >= this._expiresIn;
    }

    public get expiresIn() {
        return this._expiresIn;
    }
    
    public get createdAt() {
        return this._createdAt;
    }
}