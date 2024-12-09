import { Schema } from "@vannatta-software/ts-core";
import { ValueObject } from "@vannatta-software/ts-domain";

export class TimeRange extends ValueObject {
    @Schema({ type: Date })
    public readonly startDate: Date;

    @Schema({ type: Date })
    public readonly endDate: Date;

    constructor(props: Partial<TimeRange>) {
        super();
        this.startDate = props.startDate!;
        this.endDate = props.endDate!;
    }

    protected *getAtomicValues(): IterableIterator<any> {
        yield this.startDate;
        yield this.endDate;
    }
}
