import { AggregateRoot, UniqueIdentifier } from "@vannatta-software/ts-domain";
import { Schema } from "@vannatta-software/ts-core";
import { ReportType, ReportFormat, ReportStatus } from "./ReportType";
import { TimeRange } from "./TimeRange";
import * as Contracts from "./contracts";
import { EnumUtils } from "@domain/common/EnumUtils";

export class Report extends AggregateRoot {
    @Schema({ type: String })
    public title: string;

    @Schema({ type: String })
    public description: string;

    @Schema({ type: ReportType, enum: EnumUtils.names(ReportType) })
    public type: ReportType;

    @Schema({ type: ReportFormat, enum: EnumUtils.names(ReportFormat) })
    public format: ReportFormat;

    @Schema({ type: ReportStatus, enum: EnumUtils.names(ReportStatus) })
    public status: ReportStatus;

    @Schema({ type: Date })
    public generatedDate?: Date;

    @Schema({ type: Object })
    public data?: Record<string, any>;

    @Schema({ type: UniqueIdentifier, embedded: true })
    public requestedBy: UniqueIdentifier;

    @Schema({ type: TimeRange, embedded: true })
    public parameters: TimeRange;

    constructor(report?: Partial<Report>) {
        super(report);
        this.title = report?.title ?? "";
        this.description = report?.description ?? "";
        this.type = report?.type ?? ReportType.ActivitySummary;
        this.format = report?.format ?? ReportFormat.Dashboard;
        this.status = report?.status ?? ReportStatus.Pending;
        this.generatedDate = report?.generatedDate ?? undefined;
        this.data = report?.data ?? undefined;
        this.requestedBy = report?.requestedBy!;
        this.parameters = report?.parameters!;
    }

    public create(): void {
        this.status = ReportStatus.Pending;
        this.addDomainEvent(
            new Contracts.ReportRequested(this.id.value, this.requestedBy.value, new Date())
        );
    }

    public delete(): void {
        this.addDomainEvent(new Contracts.ReportDeleted(this.id.value, new Date()));
    }

    public markInProgress(): void {
        this.status = ReportStatus.InProgress;
    }

    public complete(data: Record<string, any>): void {
        this.status = ReportStatus.Completed;
        this.data = data;
        this.generatedDate = new Date();
        this.addDomainEvent(new Contracts.ReportGenerated(this.id.value, this.generatedDate));
    }

    public fail(reason: string): void {
        this.status = ReportStatus.Failed;
        this.addDomainEvent(new Contracts.ReportGenerationFailed(this.id.value, new Date(), reason));
    }
}
