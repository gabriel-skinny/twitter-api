import AbstractCryptoService from "src/Client/infra/adapters/abstractCryptoService"


export default class CryptoServiceStub implements AbstractCryptoService {
    public compare(compareValue: string, hashedValue: string): boolean {
        return compareValue == "equal_value"
    }
    public isHashed(value: string) {
        return value === "hashedValue"
    }
    public hash(value: string): string {
        return "password_hashed"
    }
}