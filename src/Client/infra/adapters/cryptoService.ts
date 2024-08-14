import { SALT_OR_ROUNDS_ENCRYPTION } from "src/Client/application/constants/encryption";
import AbstractCryptoService from "./abstractCryptoService";
import * as bcrypt from "bcrypt";

export class CryptoService extends AbstractCryptoService {
    public compare(compareValue: string, hashedValue: string): boolean {
        return bcrypt.compareSync(compareValue, hashedValue);
    }
    public hash(value: string): string {
        return bcrypt.hashSync(value, SALT_OR_ROUNDS_ENCRYPTION);
    }
    public isHashed(value: string): boolean {
        try {
            const roundsUsed = bcrypt.getRounds(value);
        
            return roundsUsed == SALT_OR_ROUNDS_ENCRYPTION;
        } catch (error) {
            return false;
        }
    }
    
}