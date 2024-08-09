
export default abstract class AbstractCryptoService {
    public abstract hash(value: string): string;
    public abstract isHashed(value: string): boolean;
}