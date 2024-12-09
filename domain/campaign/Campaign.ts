import { AggregateRoot, GlobalIdentifier, UniqueIdentifier } from "@vannatta-software/ts-domain";
import { CampaignStatus } from "./CampaignStatus";
import { CampaignActivity } from "./CampaignActivity";
import { Note } from "../common/Note";
import { Schema } from "@vannatta-software/ts-core";
import { EnumUtils } from "@domain/common/EnumUtils";
import { ActivityStatus } from "@domain/activity/ActivityTypes";
import * as Contracts from "./contracts";

export class Campaign extends AggregateRoot {
    @Schema({ type: String })
    public name: string;

    @Schema({ type: UniqueIdentifier, embedded: true })
    public salesPackageId: UniqueIdentifier;

    @Schema({ type: Array, items: UniqueIdentifier, embedded: true })
    public targetLeads: UniqueIdentifier[];

    @Schema({ type: UniqueIdentifier, embedded: true })
    public workflowId: UniqueIdentifier;

    @Schema({ type: Array, items: CampaignActivity, embedded: true })
    public campaignActivities: CampaignActivity[];

    @Schema({ type: Date })
    public startDate: Date;

    @Schema({ type: Date })
    public endDate: Date;

    @Schema({ type: CampaignStatus, enum: EnumUtils.names(CampaignStatus)})
    public status: CampaignStatus;

    @Schema({ type: Object, optional: true })
    public metrics: {
        totalLeads: number;
        completedActivities: number;
        successfulOutcomes: number;
        failedOutcomes: number;
    };

    @Schema({ type: Array, items: Note, embedded: true, optional: true })
    public notes: Note[];

    constructor(campaign?: Partial<Campaign>) {
        super(campaign);
        this.name = campaign?.name ?? "Unnamed Campaign";
        this.salesPackageId = campaign?.salesPackageId!;
        this.targetLeads = campaign?.targetLeads ?? [];
        this.workflowId = campaign?.workflowId!;
        this.campaignActivities = campaign?.campaignActivities ?? [];
        this.startDate = campaign?.startDate ?? new Date();
        this.endDate = campaign?.endDate ?? new Date();
        this.status = campaign?.status ?? CampaignStatus.Planned;
        this.metrics = campaign?.metrics ?? { totalLeads: 0, completedActivities: 0, successfulOutcomes: 0, failedOutcomes: 0 };
        this.notes = campaign?.notes ?? [];
    }

    public create(): void {
        if (!this.name || !this.salesPackageId || !this.workflowId) {
            throw new Error("Cannot create campaign without required fields.");
        }
        this.status = CampaignStatus.Planned;
        this.addDomainEvent(new Contracts.CampaignLaunched(this.id.value, this.startDate));
    }

    public delete(): void {
        this.status = CampaignStatus.Cancelled;
        this.addDomainEvent(new Contracts.CampaignPaused(this.id.value));
    }

    public launch(): void {
        if (this.status !== CampaignStatus.Planned) {
            throw new Error("Campaign must be in Planned status to launch.");
        }
        this.status = CampaignStatus.Active;
        this.addDomainEvent(new Contracts.CampaignLaunched(this.id.value, this.startDate));
    }

    public pause(): void {
        if (this.status !== CampaignStatus.Active) {
            throw new Error("Only active campaigns can be paused.");
        }
        this.status = CampaignStatus.Paused;
        this.addDomainEvent(new Contracts.CampaignPaused(this.id.value));
    }

    public resume(): void {
        if (this.status !== CampaignStatus.Paused) {
            throw new Error("Only paused campaigns can be resumed.");
        }
        this.status = CampaignStatus.Active;
        this.addDomainEvent(new Contracts.CampaignResumed(this.id.value));
    }

    public complete(metrics: { successfulOutcomes: number; failedOutcomes: number }): void {
        if (this.status !== CampaignStatus.Active) {
            throw new Error("Only active campaigns can be completed.");
        }
        this.status = CampaignStatus.Completed;
        this.metrics = {
            ...this.metrics,
            completedActivities: this.campaignActivities.filter((activity) => activity.status === ActivityStatus.Complete).length,
            ...metrics,
        };
        this.addDomainEvent(new Contracts.CampaignCompleted(this.id.value, this.metrics));
    }
}
