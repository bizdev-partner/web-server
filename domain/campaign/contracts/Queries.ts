import { EnumUtils } from "@domain/common/EnumUtils";
import { Field, FieldType } from "@vannatta-software/ts-core";
import { Model, Validation } from "@vannatta-software/ts-domain";
import { CampaignStatus } from "../CampaignStatus";

export class GetCampaignDetailsQuery extends Model {
    @Field("Campaign ID", FieldType.Text)
    @Validation({ required: true })
    public campaignId: string;

    constructor(campaignId: string) {
        super();
        this.campaignId = campaignId;
    }
}

export class ListCampaignsQuery extends Model {
    @Field("Filter by Status", FieldType.Select, EnumUtils.names(CampaignStatus))
    public status?: string;

    constructor(status?: string) {
        super();
        this.status = status;
    }
}

export type IGetCampaignDetailsQuery = Pick<GetCampaignDetailsQuery, "campaignId">;

export type IListCampaignsQuery = Pick<ListCampaignsQuery, "status">;
