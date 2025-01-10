import { Model, Validation } from "@vannatta-software/ts-domain";
import { FieldType, Field } from "@vannatta-software/ts-core";

export class GetActivityDetailsQuery extends Model {
    @Field("Activity ID", FieldType.Text)
    @Validation({ required: true })
    public activityId: string;

    constructor(activityId: string) {
        super();
        this.activityId = activityId;
    }
}

export type IGetActivityDetailsQuery = Pick<
    GetActivityDetailsQuery,
    "activityId"
>;

export class ListActivitiesForLeadQuery extends Model {
    @Field("Lead ID", FieldType.Text)
    @Validation({ required: true })
    public leadId: string;

    constructor(leadId: string) {
        super();
        this.leadId = leadId;
    }
}

export class ListActivitiesForCampaignQuery extends Model {
    @Field("Campaign ID", FieldType.Text)
    @Validation({ required: true })
    public campaignId: string;

    constructor(leadId: string) {
        super();
        this.campaignId = leadId;
    }
}

export type IListActivitiesForLeadQuery = Pick<
    ListActivitiesForLeadQuery,
    "leadId"
>;
export type IListAcivitiesByCampaignQuery = Pick<
ListActivitiesForCampaignQuery,
    "campaignId"
>;

export class ListActivitiesByStatusQuery extends Model {
    @Field("Status", FieldType.Text)
    @Validation({ required: true })
    public status: string;

    constructor(status: string) {
        super();
        this.status = status;
    }
}

export type IListActivitiesByStatusQuery = Pick<
    ListActivitiesByStatusQuery,
    "status"
>;

export class ListActivityTemplatesQuery {
    // No additional properties required, this query is for retrieving predefined templates.
}

export type IListActivityTemplatesQuery = {}; // An empty object type since there are no properties.
