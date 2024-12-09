import { ValueObject } from "@vannatta-software/ts-domain";
import { Schema } from "@vannatta-software/ts-core";

export class Pricing extends ValueObject {
    @Schema({ type: Number })
    public readonly basePrice: number;

    @Schema({ type: Number, optional: true })
    public readonly discount?: number;

    constructor(pricing?: Partial<Pricing>) {
        super();
        this.basePrice = pricing?.basePrice ?? 0;
        this.discount = pricing?.discount;
    }

    protected *getAtomicValues(): IterableIterator<any> {
        yield this.basePrice;
        yield this.discount;
    }
}
