import { Model, Validation } from "@vannatta-software/ts-domain";
import { Field, FieldType } from "@vannatta-software/ts-core";
import { Client } from "../Client";

export class GetClientDetailsQuery extends Model {
    @Field("Client ID", FieldType.Text)
    @Validation({ required: true })
    public clientId: string;
}

export class ListClientsQuery extends Model {
    @Field("Status", FieldType.Text)
    public status?: string;

    @Field("Filter", FieldType.TextArea)
    public filter?: Partial<Client> = {};
}

export class GetClientSalesPackagesQuery extends Model {
    @Field("Client ID", FieldType.Text)
    @Validation({ required: true })
    public clientId: string;
}

export class GetClientCampaignsQuery extends Model {
    @Field("Client ID", FieldType.Text)
    @Validation({ required: true })
    public clientId: string;
}
