import AbstractCryptoService from "src/Client/infra/adapters/abstractCryptoService";
import { CryptoService } from "src/Client/infra/adapters/cryptoService";

export class Password {
    private readonly _password: string;
    private readonly _cryptoService: AbstractCryptoService;

    constructor(password: string) {
        this._cryptoService = new CryptoService();

        if (this.isHashed(password)) this._password = password;
        else this._password = this.setPasswordHash(password);
    }

    private setPasswordHash(password: string) {
        return this._cryptoService.hash(password);
    }

    
    private isHashed(password_hash: string): boolean {
        return this._cryptoService.isHashed(password_hash);
    }

    public isTheSameValue(compareRawPassword: string) {
        return this._cryptoService.compare(compareRawPassword, this._password);
    }

    public get value() {
        return this._password;
    }
}