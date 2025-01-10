import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { WorkflowService } from '../services/workflow.service';
import * as Contracts from '@domain/workflow/contracts';
import { GlobalIdentifier } from '@vannatta-software/ts-domain';

@Controller('workflows')
export class WorkflowController {
    constructor(private readonly workflowService: WorkflowService) {}

    @Post()
    async createWorkflow(@Body() command: Contracts.ICreateWorkflowCommand) {
        return this.workflowService.createWorkflow(command);
    }

    @Patch(':id')
    async updateWorkflow(
        @Param('id') id: string,
        @Body() command: Contracts.IUpdateWorkflowCommand
    ) {
        return this.workflowService.updateWorkflow({ ...command, workflowId: id });
    }

    @Patch(':id/activate')
    async activateWorkflow(@Param('id') id: string) {
        return this.workflowService.activateWorkflow({ workflowId: id });
    }

    @Patch(':id/pause')
    async pauseWorkflow(@Param('id') id: string) {
        return this.workflowService.pauseWorkflow({ workflowId: id });
    }

    @Patch(':id/archive')
    async archiveWorkflow(@Param('id') id: string) {
        return this.workflowService.archiveWorkflow({ workflowId: id });
    }

    @Patch(':id/activities')
    async updateWorkflowActivities(
        @Param('id') id: string,
        @Body() command: Contracts.IUpdateWorkflowActivitiesCommand
    ) {
        return this.workflowService.updateWorkflowActivities({ ...command, workflowId: id });
    }

    @Get(':id')
    async getWorkflowDetails(@Param('id') id: string) {
        return this.workflowService.getWorkflowDetails({ workflowId: id });
    }

    @Get()
    async listWorkflows(@Body() query: Contracts.IListWorkflowsQuery) {
        return this.workflowService.listWorkflows(query);
    }

    @Get(':id/activities')
    async getWorkflowActivities(@Param('id') id: string) {
        return this.workflowService.getWorkflowActivities(new GlobalIdentifier(id));
    }
}
