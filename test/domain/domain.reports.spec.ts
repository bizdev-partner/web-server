import { Report } from "@domain/report/Report";
import { ReportFormat, ReportStatus, ReportType } from "@domain/report/ReportType";
import { TimeRange } from "@domain/report/TimeRange";
import * as Contracts from "@domain/report/contracts";
import { UniqueIdentifier } from "@vannatta-software/ts-domain";
import { MockReportRepository, MockReportService } from "../mocks/report.mocks";

describe("Report Domain", () => {
    let reportService: MockReportService;
    let mockRepository: MockReportRepository;

    beforeEach(() => {
        mockRepository = new MockReportRepository();
        reportService = new MockReportService(mockRepository);
    });

    it("should create and save a new report", async () => {
        const command: Contracts.ICreateReportCommand = {
            title: "Activity Summary Report",
            description: "A summary of all activities.",
            type: ReportType.ActivitySummary,
            format: ReportFormat.PDF,
            requestedBy: "user-1",
            parameters: new TimeRange({ startDate: new Date(), endDate: new Date() }),
        };

        const report = await reportService.createReport(command);
        const savedReport = await mockRepository.findById(report.id);

        expect(savedReport).toBeDefined();
        expect(savedReport?.title).toEqual("Activity Summary Report");
        expect(savedReport?.type).toEqual(ReportType.ActivitySummary);
        expect(savedReport?.format).toEqual(ReportFormat.PDF);
        expect(savedReport?.status).toEqual(ReportStatus.Pending);
        expect(savedReport?.parameters).toEqual(command.parameters);
    });

    it("should mark a report as in-progress", async () => {
        const report = new Report({
            title: "Lead Status Changes",
            type: ReportType.LeadStatusChanges,
            format: ReportFormat.Excel,
            status: ReportStatus.Pending,
            requestedBy: new UniqueIdentifier({ value: "user-2" }),
        });

        await mockRepository.save(report);

        const updatedReport = await reportService.markReportInProgress(report.id.value);

        expect(updatedReport.status).toEqual(ReportStatus.InProgress);
    });

    it("should complete a report with generated data", async () => {
        const report = new Report({
            title: "Won Leads Report",
            type: ReportType.WonLeads,
            format: ReportFormat.HTML,
            status: ReportStatus.InProgress,
            requestedBy: new UniqueIdentifier({ value: "user-3" }),
        });

        await mockRepository.save(report);

        const data = { leadsWon: 42 };
        const completedReport = await reportService.completeReport(report.id.value, data);

        expect(completedReport.status).toEqual(ReportStatus.Completed);
        expect(completedReport.data).toEqual(data);
        expect(completedReport.generatedDate).toBeDefined();
    });

    it("should fail a report with a reason", async () => {
        const report = new Report({
            title: "Failed Report",
            type: ReportType.ActivitySummary,
            format: ReportFormat.Dashboard,
            status: ReportStatus.InProgress,
            requestedBy: new UniqueIdentifier({ value: "user-4" }),
        });

        await mockRepository.save(report);

        const reason = "Insufficient data.";
        const failedReport = await reportService.failReport(report.id.value, reason);

        expect(failedReport.status).toEqual(ReportStatus.Failed);
        expect(failedReport.description).toContain(reason);
    });

    it("should retrieve reports by status", async () => {
        const reports = [
            new Report({ title: "Pending Report", status: ReportStatus.Pending, type: ReportType.ActivitySummary }),
            new Report({ title: "Completed Report", status: ReportStatus.Completed, type: ReportType.LeadStatusChanges }),
            new Report({ title: "Failed Report", status: ReportStatus.Failed, type: ReportType.WonLeads }),
        ];

        for (const report of reports) {
            await mockRepository.save(report);
        }

        const pendingReports = await reportService.getReportsByStatus(ReportStatus.Pending.name);

        expect(pendingReports).toHaveLength(1);
        expect(pendingReports[0].status).toEqual(ReportStatus.Pending);
    });

    it("should retrieve report details", async () => {
        const report = new Report({
            title: "Detailed Report",
            type: ReportType.WonLeads,
            format: ReportFormat.PDF,
            requestedBy: new UniqueIdentifier({ value: "user-5" }),
        });

        await mockRepository.save(report);

        const reportDetails = await reportService.getReportDetails({ reportId: report.id.value });

        expect(reportDetails).toBeDefined();
        expect(reportDetails.title).toEqual("Detailed Report");
        expect(reportDetails.type).toEqual(ReportType.WonLeads);
        expect(reportDetails.format).toEqual(ReportFormat.PDF);
    });

    it("should list reports with a filter", async () => {
        const reports = [
            new Report({ title: "Type A Report", type: ReportType.ActivitySummary, status: ReportStatus.Pending }),
            new Report({ title: "Type B Report", type: ReportType.LeadStatusChanges, status: ReportStatus.Completed }),
            new Report({ title: "Type A Completed", type: ReportType.ActivitySummary, status: ReportStatus.Completed }),
        ];

        for (const report of reports) {
            await mockRepository.save(report);
        }

        const query: Contracts.IListReportsQuery = { filter: { type: ReportType.ActivitySummary.name, status: ReportStatus.Pending.name } };

        const filteredReports = await reportService.listReports(query);

        expect(filteredReports).toHaveLength(1);
        expect(filteredReports[0].type).toEqual(ReportType.ActivitySummary);
        expect(filteredReports[0].status).toEqual(ReportStatus.Pending);
    });
});

