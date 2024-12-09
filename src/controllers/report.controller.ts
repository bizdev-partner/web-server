import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ReportService } from '../services/report.service';
import * as Contracts from '@domain/report/contracts';

@Controller('reports')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Post()
    async createReport(@Body() command: Contracts.CreateReportCommand) {
        return this.reportService.createReport(command);
    }

    @Delete(':id')
    async deleteReport(@Param('id') id: string) {
        const command = new Contracts.DeleteReportCommand();
        command.reportId = id;
        return this.reportService.deleteReport(command);
    }

    @Patch(':id/mark-in-progress')
    async markReportInProgress(@Param('id') id: string) {
        return this.reportService.markReportInProgress(id);
    }

    @Patch(':id/complete')
    async completeReport(
        @Param('id') id: string,
        @Body('data') data: Record<string, any>
    ) {
        return this.reportService.completeReport(id, data);
    }

    @Patch(':id/fail')
    async failReport(
        @Param('id') id: string,
        @Body('reason') reason: string
    ) {
        return this.reportService.failReport(id, reason);
    }

    @Get('/status/:status')
    async getReportsByStatus(@Param('status') status: string) {
        return this.reportService.getReportsByStatus(status);
    }

    @Get(':id')
    async getReportDetails(@Param('id') id: string) {
        const query = new Contracts.GetReportDetailsQuery();

        query.reportId = id;

        return this.reportService.getReportDetails(query);
    }

    @Get()
    async listReports(@Query() query: Contracts.ListReportsQuery) {
        return this.reportService.listReports(query);
    }
}
