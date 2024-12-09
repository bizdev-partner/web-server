import { Model, Validation } from "@vannatta-software/ts-domain";
import { FieldType, Field } from "@vannatta-software/ts-core";
import { ReportType, ReportFormat } from "../ReportType";
import { TimeRange } from "../TimeRange";


export class CreateReportCommand extends Model {
    @Field("Title", FieldType.Text)
    @Validation({ required: true })
    public title: string;

    @Field("Description", FieldType.TextArea)
    public description?: string;

    @Field("Type", FieldType.Select)
    @Validation({ required: true })
    public type: ReportType;

    @Field("Format", FieldType.Select)
    @Validation({ required: true })
    public format: ReportFormat;

    @Field("Requested By", FieldType.Text)
    @Validation({ required: true })
    public requestedBy: string;

    @Field("Time Range", FieldType.Text)
    @Validation({ required: true })
    public parameters: TimeRange;
}

export class DeleteReportCommand extends Model {
    @Field("Report ID", FieldType.Text)
    @Validation({ required: true })
    public reportId: string;
}

export type ICreateReportCommand = Pick<
    CreateReportCommand,
    "title" | "description" | "type" | "format" | "requestedBy" | "parameters"
>;

export type IDeleteReportCommand = Pick<DeleteReportCommand, "reportId">;