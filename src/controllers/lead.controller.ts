import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LeadService } from '../services/lead.service';
import * as Contracts from '@domain/lead/contracts';
import { extractRelevantSchema, MongoSchema } from 'src/schemas/mongo.schema';
import { Lead } from '@domain/lead';

@Controller('leads')
export class LeadController {
    constructor(private readonly leadService: LeadService) {}

    @Get(':id')
    async getLeadDetails(@Param('id') id: string) {
        return this.leadService.getLeadDetails({ leadId: id });
    }

    @Get()
    async listLeads(@Body() query: Contracts.IListLeadsQuery) {
        return this.leadService.listLeads(query);
    }

    @Post()
    async createLead(@Body() command: Contracts.ICreateLeadCommand) {
        return this.leadService.createLead(command);
    }

    @Patch(':id')
    async updateLead(@Param('id') id: string, @Body() command: Contracts.IUpdateLeadCommand) {
        return this.leadService.updateLead({ ...command, leadId: id });
    }

    @Patch(':id/status')
    async updateLeadStatus(@Param('id') id: string, @Body() command: Contracts.IUpdateLeadStatusCommand) {
        return this.leadService.updateLeadStatus({ ...command, leadId: id });
    }

    @Patch(':id/groups')
    async updateLeadGroups(@Param('id') id: string, @Body() command: Contracts.IUpdateLeadGroupsCommand) {
        return this.leadService.setGroups({ ...command, leadId: id });
    }

    @Delete(':id')
    async deleteLead(@Param('id') id: string) {
        return this.leadService.deleteLead(id);
    }
}
