import { IReportRepository } from "@domain/report/IReportRepository";
import { IReportService } from "@domain/report/IReportService";
import { Report } from "@domain/report/Report";
import { Enumeration, GlobalIdentifier, UniqueIdentifier } from "@vannatta-software/ts-domain";
import * as Contracts from "@domain/report/contracts";
import { ReportType, ReportStatus, ReportFormat } from "@domain/report/ReportType";
import { EnumUtils } from "@domain/common/EnumUtils";

export class MockReportRepository implements IReportRepository {
    private reports: Map<string, Report> = new Map();

    async save(report: Report): Promise<void> {
        this.reports.set(report.id.value, report);
    }

    async findById(reportId: GlobalIdentifier): Promise<Report | undefined> {
        return this.reports.get(reportId.value);
    }

    async findByType(type?: ReportType, filter?: Record<string, any>): Promise<Report[]> {
        return Array.from(this.reports.values()).filter((report) => {
            if (type && report.type.name !== type.name) {
                return false;
            }
            if (filter) {
                for (const key in filter) {
                    const reportValue = report[key as keyof Report];
                    const filterValue = filter[key];
                    if (reportValue instanceof Enumeration) {
                        if (reportValue.name !== filterValue) {
                            return false;
                        }
                    } else if (reportValue !== filterValue) {
                        return false;
                    }
                }
            }
            return true;
        });
    }
    
    async findByStatus(status?: ReportStatus, filter?: Record<string, any>): Promise<Report[]> {
        return Array.from(this.reports.values()).filter((report) => {
            if (status && report.status.name !== status.name) {
                return false;
            }
            if (filter) {
                for (const key in filter) {
                    const reportValue = report[key as keyof Report];
                    const filterValue = filter[key];
                    if (reportValue instanceof Enumeration) {
                        if (reportValue.name !== filterValue) {
                            return false;
                        }
                    } else if (reportValue !== filterValue) {
                        return false;
                    }
                }
            }
            return true;
        });
    }
    

    async delete(reportId: GlobalIdentifier): Promise<void> {
        this.reports.delete(reportId.value);
    }
}

export class MockReportService implements IReportService {
    private repository: IReportRepository;

    constructor(repository: IReportRepository = new MockReportRepository()) {
        this.repository = repository;
    }

    async createReport(command: Contracts.ICreateReportCommand): Promise<Report> {
        const report = new Report({
            title: command.title,
            description: command.description,
            type: command.type as ReportType,
            format: command.format as ReportFormat,
            status: ReportStatus.Pending,
            requestedBy: new UniqueIdentifier({ value: command.requestedBy}),
            parameters: command.parameters,
        });

        await this.repository.save(report);
        return report;
    }

    async deleteReport(command: Contracts.IDeleteReportCommand): Promise<void> {
        const report = await this.repository.findById(new GlobalIdentifier(command.reportId));
        if (!report) {
            throw new Error(`Report with ID ${command.reportId} not found.`);
        }

        await this.repository.delete(new GlobalIdentifier(command.reportId));
    }

    async markReportInProgress(reportId: string): Promise<Report> {
        const report = await this.repository.findById(new GlobalIdentifier(reportId));
        if (!report) {
            throw new Error(`Report with ID ${reportId} not found.`);
        }

        report.status = ReportStatus.InProgress;
        await this.repository.save(report);
        return report;
    }

    async completeReport(reportId: string, data: Record<string, any>): Promise<Report> {
        const report = await this.repository.findById(new GlobalIdentifier(reportId));
        if (!report) {
            throw new Error(`Report with ID ${reportId} not found.`);
        }

        report.status = ReportStatus.Completed;
        report.data = data;
        report.generatedDate = new Date();

        await this.repository.save(report);
        return report;
    }

    async failReport(reportId: string, reason: string): Promise<Report> {
        const report = await this.repository.findById(new GlobalIdentifier(reportId));
        if (!report) {
            throw new Error(`Report with ID ${reportId} not found.`);
        }

        report.status = ReportStatus.Failed;
        report.description += ` | Failure Reason: ${reason}`;

        await this.repository.save(report);
        return report;
    }

    async getReportsByStatus(status: string): Promise<Report[]> {
        return this.repository.findByStatus(EnumUtils.fromName(ReportStatus, status));
    }

    async getReportDetails(query: Contracts.IGetReportDetailsQuery): Promise<Report> {
        const report = await this.repository.findById(new GlobalIdentifier(query.reportId));
        if (!report) {
            throw new Error(`Report with ID ${query.reportId} not found.`);
        }

        return report;
    }

    async listReports(query: Contracts.IListReportsQuery): Promise<Report[]> {
        const filter = query.filter || {};
        const type = filter.type ? EnumUtils.fromName(ReportType, filter.type) : undefined;
        const status = filter.status ? EnumUtils.fromName(ReportStatus, filter.status) : undefined;

        if (type) {
            return this.repository.findByType(type, filter);
        } else if (status) {
            return this.repository.findByStatus(status, filter);
        }

        return await this.repository.findByType(undefined, filter);
    }
}

