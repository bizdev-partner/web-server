import { IWorkflowRepository, WorkflowActivity } from "@domain/workflow";
import { Workflow } from "@domain/workflow/Workflow";
import { WorkflowStatus } from "@domain/workflow/WorkflowStatus";
import { GlobalIdentifier } from "@vannatta-software/ts-domain";
import { IWorkflowService } from "@domain/workflow/IWorkflowService";
import * as Contracts from "@domain/workflow/contracts";

export class MockWorkflowRepository implements IWorkflowRepository {
    private workflows: Map<string, Workflow> = new Map();

    async save(workflow: Workflow): Promise<void> {
        this.workflows.set(workflow.id.value, workflow);
    }

    async findById(workflowId: GlobalIdentifier): Promise<Workflow | undefined> {
        return this.workflows.get(workflowId.value);
    }

    async findByStatus(status: WorkflowStatus): Promise<Workflow[]> {
        return Array.from(this.workflows.values()).filter(
            (workflow) => workflow.status.equals(status)
        );
    }

    async delete(workflowId: GlobalIdentifier): Promise<void> {
        this.workflows.delete(workflowId.value);
    }
}

export class MockWorkflowService implements IWorkflowService {
    private repository: IWorkflowRepository;

    constructor(repository: IWorkflowRepository = new MockWorkflowRepository()) {
        this.repository = repository;
    }

    async createWorkflow(command: Contracts.ICreateWorkflowCommand): Promise<Workflow> {
        const workflow = new Workflow({
            name: command.name,
            description: command.description,
            status: WorkflowStatus.Draft,
            activities: command.activities,
        });

        await this.repository.save(workflow);
        return workflow;
    }

    async updateWorkflow(command: Contracts.IUpdateWorkflowCommand): Promise<Workflow> {
        const workflow = await this.repository.findById(
            new GlobalIdentifier(command.workflowId)
        );
        if (!workflow) {
            throw new Error(`Workflow with ID ${command.workflowId} not found.`);
        }

        Object.assign(workflow, command.updatedFields);
        await this.repository.save(workflow);
        return workflow;
    }

    async activateWorkflow(command: Contracts.IActivateWorkflowCommand): Promise<Workflow> {
        const workflow = await this.repository.findById(
            new GlobalIdentifier(command.workflowId)
        );
        if (!workflow) {
            throw new Error(`Workflow with ID ${command.workflowId} not found.`);
        }

        workflow.status = WorkflowStatus.Active;
        await this.repository.save(workflow);
        return workflow;
    }

    async pauseWorkflow(command: Contracts.IPauseWorkflowCommand): Promise<Workflow> {
        const workflow = await this.repository.findById(
            new GlobalIdentifier(command.workflowId)
        );
        if (!workflow) {
            throw new Error(`Workflow with ID ${command.workflowId} not found.`);
        }

        workflow.status = WorkflowStatus.Paused;
        await this.repository.save(workflow);
        return workflow;
    }

    async archiveWorkflow(command: Contracts.IArchiveWorkflowCommand): Promise<Workflow> {
        const workflow = await this.repository.findById(
            new GlobalIdentifier(command.workflowId)
        );
        if (!workflow) {
            throw new Error(`Workflow with ID ${command.workflowId} not found.`);
        }

        workflow.status = WorkflowStatus.Archived;
        await this.repository.save(workflow);
        return workflow;
    }

    async getWorkflowDetails(query: Contracts.IGetWorkflowDetailsQuery): Promise<Workflow> {
        const workflow = await this.repository.findById(
            new GlobalIdentifier(query.workflowId)
        );
        if (!workflow) {
            throw new Error(`Workflow with ID ${query.workflowId} not found.`);
        }

        return workflow;
    }

    async listWorkflows(): Promise<Workflow[]> {
        const workflows = await this.repository.findByStatus(WorkflowStatus.Draft);

        return Array.from(workflows);
    }

    async getWorkflowActivities(workflowId: GlobalIdentifier): Promise<WorkflowActivity[]> {
        const workflow = await this.repository.findById(workflowId);
        if (!workflow) {
            throw new Error(`Workflow with ID ${workflowId.value} not found.`);
        }

        return workflow.activities;
    }

    async updateWorkflowActivities(command: Contracts.IUpdateWorkflowActivitiesCommand): Promise<Workflow> {
        const workflow = await this.repository.findById(new GlobalIdentifier(command.workflowId));
        if (!workflow) {
            throw new Error(`Workflow with ID ${command.workflowId} not found.`);
        }

        workflow.activities = command.activities;
        await this.repository.save(workflow);
        return workflow;
    }
}
