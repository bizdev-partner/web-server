import { Model, Validation } from "@vannatta-software/ts-domain";
import { FieldType, Field } from "@vannatta-software/ts-core";//
// Commands
//

export class LaunchCampaignCommand extends Model {
    @Field("Campaign ID", FieldType.Text)
    @Validation({ required: true })
    public campaignId: string;

    constructor(campaignId: string) {
        super();
        this.campaignId = campaignId;
    }
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

export type ILaunchCampaignCommand = Pick<LaunchCampaignCommand, "campaignId">;

export type IPauseCampaignCommand = Pick<PauseCampaignCommand, "campaignId">;

export type IResumeCampaignCommand = Pick<ResumeCampaignCommand, "campaignId">;

export type ICompleteCampaignCommand = Pick<
    CompleteCampaignCommand,
    "campaignId" | "successfulOutcomes" | "failedOutcomes"
>;
