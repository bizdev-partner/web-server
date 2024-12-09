import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LeadService } from '../services/lead.service';
import * as Contracts from '@domain/lead/contracts';

@Controller('leads')
export class LeadController {
    constructor(private readonly leadService: LeadService) {}

    @Get(':id')
    async getLeadDetails(@Param('id') id: string) {
        const query = new Contracts.GetLeadDetailsQuery(id);
        query.leadId = id;
        return this.leadService.getLeadDetails(query);
    }

    @Get()
    async listLeads(@Body() query: Contracts.ListLeadsQuery) {
        return this.leadService.listLeads(query);
    }

    @Post()
    async createLead(@Body() command: Contracts.CreateLeadCommand) {
        return this.leadService.createLead(command);
    }

    @Patch(':id')
    async updateLead(
        @Param('id') id: string,
        @Body() command: Contracts.UpdateLeadCommand
    ) {
        command.leadId = id;
        return this.leadService.updateLead(command);
    }

    @Patch(':id/status')
    async updateLeadStatus(
        @Param('id') id: string,
        @Body() command: Contracts.UpdateLeadStatusCommand
    ) {
        command.leadId = id;
        return this.leadService.updateLeadStatus(command);
    }

    @Delete(':id')
    async deleteLead(@Param('id') id: string) {
        return this.leadService.deleteLead(id);
    }
}
