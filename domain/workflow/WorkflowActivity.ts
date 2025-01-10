import { Entity } from "@vannatta-software/ts-domain";
import { ActivityType, PriorityType } from "../activity/ActivityTypes";
import { WorkflowActivityCreatedEvent, WorkflowActivityDeletedEvent } from "./contracts";
import { Schema } from "@vannatta-software/ts-core";
import { EnumUtils } from "@domain/common/EnumUtils";

export class WorkflowActivity extends Entity {
    @Schema({ type: ActivityType, enum: EnumUtils.names(ActivityType) })
    public type: ActivityType;

    @Schema({ type: PriorityType, enum: EnumUtils.names(PriorityType) })
    public priority: PriorityType;

    @Schema({
        type: Object,
        properties: {
            pending: { type: Number },
            due: { type: Number },
            overdue: { type: Number }
        }
    })
    public priorityRules: {
        pending: number;
        due: number;
        overdue: number;
    };

    @Schema({ type: String, optional: true })
    public notes?: string;

    constructor(props: Partial<WorkflowActivity>) {
        super(props);
        this.type = props.type || ActivityType.EmailOutreach;
        this.priority = props.priority || PriorityType.Medium;
        this.priorityRules = props.priorityRules || { pending: 0, due: 4, overdue: 5 };
        this.notes = props.notes;
    }

    public create(): void {
        this.addDomainEvent(new WorkflowActivityCreatedEvent(this.id.value, this.type.name));
    }

    public delete(): void {
        this.addDomainEvent(new WorkflowActivityDeletedEvent(this.id.value));
    }
}
