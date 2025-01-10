import { EnumUtils } from "@domain/common/EnumUtils";
import { Schema } from "@vannatta-software/ts-core";
import { Enumeration, ValueObject } from "@vannatta-software/ts-domain";

export class LeadStatusMoment extends ValueObject {
    @Schema({ type: String })
    public status: string;
    @Schema({ type: Date })
    public date: Date;

    constructor(status: LeadStatus) {
        super();
        this.status = status.name;
        this.date = new Date();
    }

    protected *getAtomicValues(): IterableIterator<any> {
        yield this.status;
        yield this.date.getTime();
    }
}

export class LeadStatus extends Enumeration {
    public static readonly Known = new LeadStatus({ id: 1, name: "Known" });
    public static readonly Pursued = new LeadStatus({ id: 2, name: "Pursued" });
    public static readonly Unqualified = new LeadStatus({ id: 3, name: "Unqualified" });
    public static readonly Lost = new LeadStatus({ id: 4, name: "Lost" });
    public static readonly Won = new LeadStatus({ id: 5, name: "Won" });

    // No campaign -> InActive
    // In campaign -> Active
    // Lost / Won / Unqualified

    constructor(partial: Partial<LeadStatus>) {
        super(partial);
    }

    protected *getAtomicValues(): IterableIterator<any> {
        yield this.id;
        yield this.name;
    }

    /**
     * Gets a LeadStatus instance by name.
     * @param name The name of the LeadStatus.
     * @returns The corresponding LeadStatus instance.
     */
    public static fromName(name: string): LeadStatus {
        return EnumUtils.fromName(LeadStatus, name);
    }
}
