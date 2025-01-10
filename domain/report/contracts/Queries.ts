import { Model, Validation } from "@vannatta-software/ts-domain";
import { FieldType, Field } from "@vannatta-software/ts-core";

export class GetReportDetailsQuery extends Model {
    @Field("Report ID", FieldType.Text)
    @Validation({ required: true })
    public reportId: string;
}

export class ListReportsQuery extends Model {
    @Field("Filter", FieldType.TextArea)
    public filter?: Record<string, any>;
}

export type IGetReportDetailsQuery = Pick<GetReportDetailsQuery, "reportId">;

export type IListReportsQuery = Pick<ListReportsQuery, "filter">;