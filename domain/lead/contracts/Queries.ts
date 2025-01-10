import { Model, Validation } from "@vannatta-software/ts-domain";
import { FieldType, Field } from "@vannatta-software/ts-core";

export class GetLeadDetailsQuery extends Model {
    @Field("Lead ID", FieldType.Text)
    @Validation({ required: true })
    public leadId: string;

    constructor(leadId: string) {
        super();
        this.leadId = leadId;
    }
}

export class ListLeadsQuery extends Model {
    @Field("Status", FieldType.Text)
    public status?: string;

    @Field("Tags", FieldType.Text)
    public tags?: string[];

    constructor(status?: string, tags?: string[]) {
        super();
        this.status = status;
        this.tags = tags;
    }
}

export type IGetLeadDetailsQuery = Pick<GetLeadDetailsQuery, "leadId">;

export type IListLeadsQuery = Pick<ListLeadsQuery, "status" | "tags">;
