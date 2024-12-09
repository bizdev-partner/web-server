import { Report } from "./Report";
import { GlobalIdentifier } from "@vannatta-software/ts-domain";
import { ReportStatus, ReportType } from "./ReportType";

export interface IReportRepository {
    /**
     * Stores a new or updated report.
     * @param report The report to save.
     */
    save(report: Report): Promise<void>;

    /**
     * Retrieves a report by its unique identifier.
     * @param reportId The unique identifier of the report.
     * @returns The report or undefined if not found.
     */
    findById(reportId: GlobalIdentifier): Promise<Report | undefined>;

    /**
     * Retrieves reports with a specific type.
     * @param type The type of the reports to retrieve.
     * @returns An array of reports with the given type.
     */
    findByType(type: ReportType, filter?: Record<string, any>): Promise<Report[]>;

    /**
     * Retrieves reports with a specific status.
     * @param status The status of the reports to retrieve.
     * @returns An array of reports with the given status.
     */
    findByStatus(status: ReportStatus, filter?: Record<string, any>): Promise<Report[]>;

    /**
     * Deletes a report from the repository.
     * @param reportId The unique identifier of the report to delete.
     */
    delete(reportId: GlobalIdentifier): Promise<void>;
}
