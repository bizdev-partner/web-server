import { LeadStatus } from "@domain/lead";
import { Schema } from "@vannatta-software/ts-core";
import { ValueObject } from "@vannatta-software/ts-domain";

export class ActivityOutcome extends ValueObject {
    @Schema({ type: String })
    public readonly description: string;

    @Schema({ type: LeadStatus, embedded: true })
    public readonly leadStatus: LeadStatus

    constructor(props: Partial<ActivityOutcome>) {
        super();
        this.description = props.description;
        this.leadStatus = props.leadStatus ? LeadStatus.fromName(props.leadStatus.name) : LeadStatus.Known;
    }

    protected *getAtomicValues(): IterableIterator<any> {
        yield this.description;
        yield this.leadStatus.name;
    }

    toString(): string {
        return `${this.description}`;
    }
}
