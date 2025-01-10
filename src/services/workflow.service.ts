import { Injectable } from '@nestjs/common';
import { Workflow } from '@domain/workflow/Workflow';
import { WorkflowActivity } from '@domain/workflow/WorkflowActivity';
import { WorkflowStatus } from '@domain/workflow/WorkflowStatus';
import { WorkflowRepository } from '../repositories/workflow.repository';
import * as Contracts from '@domain/workflow/contracts';
import { GlobalIdentifier, UniqueIdentifier } from '@vannatta-software/ts-domain';
import { EventPublisherService } from '../services/eventPublisher.service';
import { PriorityType } from '@domain/activity';

@Injectable()
export class WorkflowService {
    constructor(
        private readonly repository: WorkflowRepository
    ) {}

    async createWorkflow(command: Contracts.ICreateWorkflowCommand): Promise<Workflow> {
        console.log(command)

        const workflow = new Workflow({
            name: command.name,
            description: command.description,
            status: WorkflowStatus.Draft,
            ownerId: command.ownerId ? new UniqueIdentifier(command.ownerId) : undefined,
            category: command.category,
            activities: command.activities?.map((activity) =>
                new WorkflowActivity({
                    type: activity.type,
                    priorityRules: activity.priorityRules,
                    notes: activity.notes,
                })
            ),
        });

        await this.repository.insert(workflow);
        return workflow;
    }

    async updateWorkflow(command: Contracts.IUpdateWorkflowCommand): Promise<Workflow> {
        const workflow = await this.repository.findById(command.workflowId);

        if (!workflow) {
            throw new Error(`Workflow with ID ${command.workflowId} not found.`);
        }

        Object.assign(workflow, command.updatedFields);

        await this.repository.update(workflow);
        return workflow;
    }

    async activateWorkflow(command: Contracts.IActivateWorkflowCommand): Promise<Workflow> {
        const workflow = await this.repository.findById(command.workflowId);

        if (!workflow) {
            throw new Error(`Workflow with ID ${command.workflowId} not found.`);
        }

        workflow.status = WorkflowStatus.Active;
        await this.repository.update(workflow);
        return workflow;
    }

    async pauseWorkflow(command: Contracts.IPauseWorkflowCommand): Promise<Workflow> {
        const workflow = await this.repository.findById(command.workflowId);

        if (!workflow) {
            throw new Error(`Workflow with ID ${command.workflowId} not found.`);
        }

        workflow.status = WorkflowStatus.Paused;
        await this.repository.update(workflow);
        return workflow;
    }

    async archiveWorkflow(command: Contracts.IArchiveWorkflowCommand): Promise<Workflow> {
        const workflow = await this.repository.findById(command.workflowId);

        if (!workflow) {
            throw new Error(`Workflow with ID ${command.workflowId} not found.`);
        }

        workflow.status = WorkflowStatus.Archived;

        await this.repository.delete(workflow);
        return workflow;
    }

    async getWorkflowDetails(query: Contracts.IGetWorkflowDetailsQuery): Promise<Workflow> {
        const workflow = await this.repository.findById(query.workflowId);

        if (!workflow) {
            throw new Error(`Workflow with ID ${query.workflowId} not found.`);
        }

        return workflow;
    }

    async listWorkflows(query: Contracts.IListWorkflowsQuery): Promise<Workflow[]> {
        const workflows = await this.repository.findAll();

        if (query.status) {
            return workflows.filter((wf) => wf.status.name === query.status);
        }

        return workflows;
    }

    async getWorkflowActivities(workflowId: GlobalIdentifier): Promise<WorkflowActivity[]> {
        const workflow = await this.repository.findById(workflowId.value);

        if (!workflow) {
            throw new Error(`Workflow with ID ${workflowId.value} not found.`);
        }

        return workflow.activities;
    }

    async updateWorkflowActivities(command: Contracts.IUpdateWorkflowActivitiesCommand): Promise<Workflow> {
        const workflow = await this.repository.findById(command.workflowId);

        if (!workflow) {
            throw new Error(`Workflow with ID ${command.workflowId} not found.`);
        }

        workflow.activities = command.activities.map(
            (activity) =>
                new WorkflowActivity({
                    type: activity.type,
                    priority: PriorityType.fromName(activity.priority.name),
                    priorityRules: activity.priorityRules,
                    notes: activity.notes,
                })
        );

        await this.repository.update(workflow);
        return workflow;
    }
}
