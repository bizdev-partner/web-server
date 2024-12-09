import { Injectable } from '@nestjs/common';
import { IReportService } from '@domain/report/IReportService';
import * as Contracts from '@domain/report/contracts';
import { ReportRepository } from '../repositories/report.repository';
import { Report } from '@domain/report/Report';
import { GlobalIdentifier, UniqueIdentifier } from '@vannatta-software/ts-domain';
import { ReportType, ReportStatus, ReportFormat } from '@domain/report/ReportType';
import { EnumUtils } from '@domain/common/EnumUtils';

@Injectable()
export class ReportService implements IReportService {
    constructor(private readonly reports: ReportRepository) {}

    async createReport(command: Contracts.ICreateReportCommand): Promise<Report> {
        const report = new Report({
            title: command.title,
            description: command.description,
            type: EnumUtils.fromName(ReportType, command.type.name),
            format: EnumUtils.fromName(ReportFormat, command.format.name),
            status: ReportStatus.Pending,
            requestedBy: new UniqueIdentifier(command.requestedBy),
            parameters: command.parameters,
        });

        await this.reports.insert(report);
        return report;
    }

    async deleteReport(command: Contracts.IDeleteReportCommand): Promise<void> {
        const report = await this.reports.findById(command.reportId);
        if (!report) throw new Error(`Report with ID ${command.reportId} not found`);
        await this.reports.delete(report);
    }

    async markReportInProgress(reportId: string): Promise<Report> {
        const report = await this.reports.findById(reportId);
        if (!report) throw new Error(`Report with ID ${reportId} not found`);

        report.status = ReportStatus.InProgress;
        await this.reports.update(report);
        return report;
    }

    async completeReport(reportId: string, data: Record<string, any>): Promise<Report> {
        const report = await this.reports.findById(reportId);
        if (!report) throw new Error(`Report with ID ${reportId} not found`);

        report.status = ReportStatus.Completed;
        report.data = data;
        report.generatedDate = new Date();
        await this.reports.update(report);

        return report;
    }

    async failReport(reportId: string, reason: string): Promise<Report> {
        const report = await this.reports.findById(reportId);
        if (!report) throw new Error(`Report with ID ${reportId} not found`);

        report.status = ReportStatus.Failed;
        report.description += ` | Failure Reason: ${reason}`;
        await this.reports.update(report);

        return report;
    }

    async getReportsByStatus(status: string): Promise<Report[]> {
        const reportStatus = EnumUtils.fromName(ReportStatus, status);
        return this.reports.findByStatus(reportStatus);
    }

    async getReportDetails(query: Contracts.IGetReportDetailsQuery): Promise<Report> {
        const report = await this.reports.findById(query.reportId);
        if (!report) throw new Error(`Report with ID ${query.reportId} not found`);
        return report;
    }

    async listReports(query: Contracts.IListReportsQuery): Promise<Report[]> {
        const filter = query.filter || {};
        const type = filter.type ? EnumUtils.fromName(ReportType, filter.type) : undefined;
        const status = filter.status ? EnumUtils.fromName(ReportStatus, filter.status) : undefined;

        if (type && status) {
            return this.reports.findByTypeAndStatus(type, status, filter);
        } else if (type) {
            return this.reports.findByType(type, filter);
        } else if (status) {
            return this.reports.findByStatus(status, filter);
        }

        return this.reports.findAll(filter);
    }
}
