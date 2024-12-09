import { Schema } from "@vannatta-software/ts-core";
import { ValueObject } from "@vannatta-software/ts-domain";

export class ActivityOutcome extends ValueObject {
    @Schema({ type: String })
    public readonly description: string;

    @Schema({ type: Boolean })
    public readonly success: boolean;

    constructor(props: Partial<ActivityOutcome>) {
        super();
        this.description = props.description;
        this.success = props.success;
    }

    protected *getAtomicValues(): IterableIterator<any> {
        yield this.description;
        yield this.success;
    }

    toString(): string {
        return `${this.description} (Success: ${this.success})`;
    }
}
