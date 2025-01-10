import { Report } from "./Report";
import * as Contracts from "./contracts";

export interface IReportService {
    /**
     * Validates and creates a new report.
     * @param command The command containing the details to create a report.
     * @returns The created report.
     */
    createReport(command: Contracts.ICreateReportCommand): Promise<Report>;

    /**
     * Deletes a report and triggers necessary domain events.
     * @param command The command containing the report ID to delete.
     * @returns A promise resolving when the report is deleted.
     */
    deleteReport(command: Contracts.IDeleteReportCommand): Promise<void>;

    /**
     * Marks a report as in-progress.
     * @param reportId The unique identifier of the report.
     * @returns The updated report.
     */
    markReportInProgress(reportId: string): Promise<Report>;

    /**
     * Completes a report, storing its data and updating its status.
     * @param reportId The unique identifier of the report.
     * @param data The data to store in the report.
     * @returns The completed report.
     */
    completeReport(reportId: string, data: Record<string, any>): Promise<Report>;

    /**
     * Marks a report as failed with a reason.
     * @param reportId The unique identifier of the report.
     * @param reason The reason for the failure.
     * @returns The failed report.
     */
    failReport(reportId: string, reason: string): Promise<Report>;

    /**
     * Retrieves all reports with a specific status.
     * @param status The status of the reports to retrieve.
     * @returns An array of reports with the specified status.
     */
    getReportsByStatus(status: string): Promise<Report[]>;

    /**
     * Retrieves detailed information about a specific report.
     * @param query The query containing the report ID.
     * @returns The detailed report.
     */
    getReportDetails(query: Contracts.IGetReportDetailsQuery): Promise<Report>;

    /**
     * Lists reports based on the provided filter.
     * @param query The query containing the filter criteria.
     * @returns An array of reports matching the filter.
     */
    listReports(query: Contracts.IListReportsQuery): Promise<Report[]>;
}
