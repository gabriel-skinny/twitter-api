import CryptoService from "../util/cryptoService";


export class Password {
    private readonly _password: string;
    private readonly _cryptoService: CryptoService;

    constructor(password: string, cryptoService: CryptoService) {
        this._cryptoService = cryptoService;

        if (this.isHashed(password)) this._password = password;
        else this._password = this.setPasswordHash(password);
    }

    public setPasswordHash(password: string) {
        return this._cryptoService.hash(password);
    }

    
    private isHashed(password_hash: string): boolean {
        return this._cryptoService.isHashed(password_hash);
    }

    public get value() {
        return this._password;
    }
}