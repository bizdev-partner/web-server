import { Enumeration } from "@vannatta-software/ts-domain";
import { EnumUtils } from "@domain/common/EnumUtils";

export class WorkflowStatus extends Enumeration {
    public static readonly Draft = new WorkflowStatus({ id: 1, name: "Draft" });
    public static readonly Active = new WorkflowStatus({ id: 2, name: "Active" });
    public static readonly Paused = new WorkflowStatus({ id: 3, name: "Paused" });
    public static readonly Archived = new WorkflowStatus({ id: 4, name: "Archived" });

    constructor(partial: Partial<WorkflowStatus>) {
        super(partial);
    }

    protected *getAtomicValues(): IterableIterator<any> {
        yield this.id;
        yield this.name;
    }

    /**
     * Gets a WorkflowStatus instance by name.
     * @param name The name of the WorkflowStatus.
     * @returns The corresponding WorkflowStatus instance.
     */
    public static fromName(name: string): WorkflowStatus {
        return EnumUtils.fromName(WorkflowStatus, name);
    }
}
