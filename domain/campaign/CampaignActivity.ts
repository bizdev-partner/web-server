import { Entity, GlobalIdentifier, UniqueIdentifier } from "@vannatta-software/ts-domain";
import { Schema } from "@vannatta-software/ts-core";
import { EnumUtils } from "@domain/common/EnumUtils";
import { ActivityStatus } from "@domain/activity";
import * as Contracts from "./contracts";

export class CampaignActivity extends Entity {
    @Schema({ type: String })
    public name: string;

    @Schema({ type: UniqueIdentifier, embedded: true })
    public workflowActivityId: UniqueIdentifier;

    @Schema({ type: UniqueIdentifier, embedded: true })
    public leadId: UniqueIdentifier;

    @Schema({ type: Date })
    public scheduledDate: Date;

    @Schema({ type: Date, optional: true })
    public completionDate?: Date;

    @Schema({ type: String, optional: true })
    public outcome?: string;

    @Schema({ type: ActivityStatus, enum: EnumUtils.names(ActivityStatus) })
    public status: ActivityStatus;

    constructor(activity?: Partial<CampaignActivity>) {
        super(activity);
        this.name = activity?.name ?? "Unnamed Activity";
        this.workflowActivityId = activity?.workflowActivityId!;
        this.leadId = activity?.leadId!;
        this.scheduledDate = activity?.scheduledDate ?? new Date();
        this.completionDate = activity?.completionDate ?? undefined;
        this.outcome = activity?.outcome ?? undefined;
        this.status = activity?.status ?? ActivityStatus.Open;
    }

    public create(): void {
        if (!this.name || !this.workflowActivityId || !this.leadId) {
            throw new Error("Cannot create campaign activity without required fields.");
        }
        this.status = ActivityStatus.Open;
        this.addDomainEvent(new Contracts.CampaignActivityScheduled(this.id.value, this.scheduledDate));
    }

    public delete(): void {
        this.status = ActivityStatus.Cancelled;
        this.addDomainEvent(new Contracts.CampaignActivityCancelled(this.id.value));
    }

    public complete(outcome: string): void {
        if (this.status !== ActivityStatus.Open && this.status !== ActivityStatus.InProgress) {
            throw new Error("Only Open or InProgress activities can be completed.");
        }
        this.completionDate = new Date();
        this.status = ActivityStatus.Complete;
        this.outcome = outcome;
        this.addDomainEvent(new Contracts.CampaignActivityCompleted(this.id.value, outcome, this.completionDate));
    }

    public cancel(): void {
        if (this.status === ActivityStatus.Complete) {
            throw new Error("Cannot cancel a completed activity.");
        }
        this.status = ActivityStatus.Cancelled;
        this.addDomainEvent(new Contracts.CampaignActivityCancelled(this.id.value));
    }
}
