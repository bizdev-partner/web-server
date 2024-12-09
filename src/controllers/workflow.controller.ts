import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { WorkflowService } from '../services/workflow.service';
import * as Contracts from '@domain/workflow/contracts';
import { GlobalIdentifier } from '@vannatta-software/ts-domain';

@Controller('workflows')
export class WorkflowController {
    constructor(private readonly workflowService: WorkflowService) {}

    @Post()
    async createWorkflow(@Body() command: Contracts.CreateWorkflowCommand) {
        return this.workflowService.createWorkflow(command);
    }

    @Patch(':id')
    async updateWorkflow(
        @Param('id') id: string,
        @Body() command: Contracts.UpdateWorkflowCommand
    ) {
        command.workflowId = id;
        return this.workflowService.updateWorkflow(command);
    }

    @Patch(':id/activate')
    async activateWorkflow(@Param('id') id: string) {
        const command = new Contracts.ActivateWorkflowCommand();
        command.workflowId = id;
        return this.workflowService.activateWorkflow(command);
    }

    @Patch(':id/pause')
    async pauseWorkflow(@Param('id') id: string) {
        const command = new Contracts.PauseWorkflowCommand();
        command.workflowId = id;
        return this.workflowService.pauseWorkflow(command);
    }

    @Patch(':id/archive')
    async archiveWorkflow(@Param('id') id: string) {
        const command = new Contracts.ArchiveWorkflowCommand();
        command.workflowId = id;
        return this.workflowService.archiveWorkflow(command);
    }

    @Patch(':id/activities')
    async updateWorkflowActivities(
        @Param('id') id: string,
        @Body() command: Contracts.UpdateWorkflowActivitiesCommand
    ) {
        command.workflowId = id;
        return this.workflowService.updateWorkflowActivities(command);
    }

    @Get(':id')
    async getWorkflowDetails(@Param('id') id: string) {
        const query = new Contracts.GetWorkflowDetailsQuery(id);
        return this.workflowService.getWorkflowDetails(query);
    }

    @Get()
    async listWorkflows() {
        const query = new Contracts.ListWorkflowsQuery();
        return this.workflowService.listWorkflows(query);
    }

    @Get(':id/activities')
    async getWorkflowActivities(@Param('id') id: string) {
        return this.workflowService.getWorkflowActivities(new GlobalIdentifier(id));
    }
}
