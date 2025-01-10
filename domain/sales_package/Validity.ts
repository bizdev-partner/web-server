import { ValueObject } from "@vannatta-software/ts-domain";
import { Schema } from "@vannatta-software/ts-core";

export class Validity extends ValueObject {
    @Schema({ type: Date })
    public readonly startDate: Date;

    @Schema({ type: Date })
    public readonly endDate: Date;

    constructor(validity?: Partial<Validity>) {
        super();
        this.startDate = validity?.startDate ?? new Date();
        this.endDate = validity?.endDate ?? new Date(this.startDate.getTime() + 24 * 60 * 60 * 1000); // Default: 1 day
    }

    protected *getAtomicValues(): IterableIterator<any> {
        yield this.startDate;
        yield this.endDate;
    }

    public isValid(): boolean {
        return this.startDate < this.endDate;
    }
}
