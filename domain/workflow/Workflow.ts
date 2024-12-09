import { AggregateRoot, UniqueIdentifier } from "@vannatta-software/ts-domain";
import * as Contracts from "./contracts";
import { Schema } from "@vannatta-software/ts-core";
import { WorkflowStatus } from "./WorkflowStatus";
import { WorkflowActivity } from "./WorkflowActivity";
import { EnumUtils } from "@domain/common/EnumUtils";

export class Workflow extends AggregateRoot {
    @Schema({ type: String })
    public name: string;

    @Schema({ type: String, optional: true })
    public description?: string;

    @Schema({ type: WorkflowStatus, enum: EnumUtils.names(WorkflowStatus) })
    public status: WorkflowStatus;

    @Schema({ type: Array, items: String, optional: true })
    public tags: string[];

    @Schema({ type: String, optional: true })
    public category?: string;

    @Schema({ type: Array, items: WorkflowActivity, embedded: true })
    public activities: WorkflowActivity[];

    @Schema({ type: UniqueIdentifier, optional: true, embedded: true })
    public ownerId?: UniqueIdentifier;

    constructor(props: Partial<Workflow>) {
        super(props);
        this.name = props.name || "Untitled Workflow";
        this.description = props.description;
        this.status = props.status || WorkflowStatus.Draft;
        this.tags = props.tags || [];
        this.category = props.category;
        this.activities = props.activities || [];
        this.ownerId = props.ownerId;
    }

    public addActivity(activity: WorkflowActivity): void {
        this.activities.push(activity);
        this.updatedAt = new Date();
    }

    public activate(): void {
        if (this.status !== WorkflowStatus.Draft) {
            throw new Error("Only workflows in Draft status can be activated.");
        }
        this.status = WorkflowStatus.Active;
        this.updatedAt = new Date();
        this.addDomainEvent(new Contracts.WorkflowActivatedEvent(this.id.value));
    }

    public pause(): void {
        if (this.status !== WorkflowStatus.Active) {
            throw new Error("Only active workflows can be paused.");
        }
        this.status = WorkflowStatus.Paused;
        this.updatedAt = new Date();
        this.addDomainEvent(new Contracts.WorkflowPausedEvent(this.id.value));
    }

    public archive(): void {
        if (![WorkflowStatus.Draft, WorkflowStatus.Paused].includes(this.status)) {
            throw new Error("Only Draft or Paused workflows can be archived.");
        }
        this.status = WorkflowStatus.Archived;
        this.updatedAt = new Date();
        this.addDomainEvent(new Contracts.WorkflowArchivedEvent(this.id.value));
    }

    public create(): void {
        this.addDomainEvent(new Contracts.WorkflowCreatedEvent(this.id.value, this.name));
    }

    public delete(): void {
        this.addDomainEvent(new Contracts.WorkflowDeletedEvent(this.id.value));
    }
}
