import { randomUUID } from "crypto";

export enum SessionDeviceTypesEnum {
    DESKTOP = "Desktop",
    MOBILE = "Mobile"
}

interface ISessionProps {
    id?: string;
    userId: string;
    ip: string;
    deviceType: SessionDeviceTypesEnum;
    active?: boolean;
    createdAt?: Date;
}

type IRawValues = Omit<ISessionProps, "id" | "active" | "createdAt">; 

export default class UserSession {
    private readonly _id: string;
    private readonly _active: boolean;
    private readonly _createdAt: Date;
    private readonly rawValues: IRawValues;

    constructor(props: ISessionProps) {
        this._id = props.id || randomUUID();
        this._active = props.active || true;
        this._createdAt = props.createdAt || new Date();

        this.rawValues = { ...props };
    }

    public get id() {
        return this._id;
    }

    public get active() {
        return this._active;
    }

    public get createdAt() {
        return this._createdAt;
    }

    public get userId() {
        return this.rawValues.userId;
    }

    public get deviceType() {
        return this.rawValues.deviceType;
    }

    public get ip() {
        return this.rawValues.ip;
    }
}