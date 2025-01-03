import { Field, FieldType } from "@vannatta-software/ts-core";
import { Model, Validation } from "@vannatta-software/ts-domain";

// LaunchCampaignCommand - Behaving like a create command
export class LaunchCampaignCommand extends Model {
    @Field("Campaign ID", FieldType.Text)
    @Validation({ required: true })
    public campaignId: string;

    @Field("Sales Package ID", FieldType.Text)
    @Validation({ required: true })
    public salesPackageId: string;

    @Field("Workflow ID", FieldType.Text)
    @Validation({ required: true })
    public workflowId: string;

    @Field("Target Leads", FieldType.Text)
    public leads: string[];

    @Field("Start Date", FieldType.Text)
    @Validation({ required: true })
    public startDate: Date;

    @Field("End Date", FieldType.Text)
    @Validation({ required: true })
    public endDate: Date;
}

export class UpdateCampaignCommand extends Model {
    @Field("Campaign ID", FieldType.Text)
    @Validation({ required: true })
    public campaignId: string;

    @Field("Name", FieldType.Text)
    @Validation({ required: true })
    public name: string;

    @Field("Start Date", FieldType.Text)
    @Validation({ required: true })
    public startDate: Date;

    @Field("End Date", FieldType.Text)
    @Validation({ required: true })
    public endDate: Date;

    @Field("Target Leads", FieldType.Text)
    public leads: string[];
}

export class PauseCampaignCommand extends Model {
    @Field("Campaign ID", FieldType.Text)
    @Validation({ required: true })
    public campaignId: string;

    constructor(campaignId: string) {
        super();
        this.campaignId = campaignId;
    }
}

export class ResumeCampaignCommand extends Model {
    @Field("Campaign ID", FieldType.Text)
    @Validation({ required: true })
    public campaignId: string;

    constructor(campaignId: string) {
        super();
        this.campaignId = campaignId;
    }
}

export class CompleteCampaignCommand extends Model {
    @Field("Campaign ID", FieldType.Text)
    @Validation({ required: true })
    public campaignId: string;

    @Field("Successful Outcomes", FieldType.Number)
    @Validation({ required: true })
    public successfulOutcomes: number;

    @Field("Failed Outcomes", FieldType.Number)
    @Validation({ required: true })
    public failedOutcomes: number;

    constructor(campaignId: string, successfulOutcomes: number, failedOutcomes: number) {
        super();
        this.campaignId = campaignId;
        this.successfulOutcomes = successfulOutcomes;
        this.failedOutcomes = failedOutcomes;
    }
}

export type ILaunchCampaignCommand = Pick<LaunchCampaignCommand, "campaignId" | "salesPackageId" | "workflowId" | "leads" | "startDate" | "endDate">;
export type IUpdateCampaignCommand = Pick<UpdateCampaignCommand, "campaignId" | "leads" | "startDate" | "endDate" | "name">;

export type IPauseCampaignCommand = Pick<PauseCampaignCommand, "campaignId">;

export type IResumeCampaignCommand = Pick<ResumeCampaignCommand, "campaignId">;

export type ICompleteCampaignCommand = Pick<
    CompleteCampaignCommand,
    "campaignId" | "successfulOutcomes" | "failedOutcomes"
>;
