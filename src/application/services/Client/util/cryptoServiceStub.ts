import AbstractCryptoService from "./cryptoService";

export default class CryptoServiceStub implements AbstractCryptoService {
    public isHashed(value: string): boolean {
        return value === "hashedValue"
    }
    public hash(value: string): string {
        return "password_hashed"
    }
}