import { Workflow } from "@domain/workflow/Workflow";
import { WorkflowActivity } from "@domain/workflow/WorkflowActivity";
import { WorkflowStatus } from "@domain/workflow/WorkflowStatus";
import { GlobalIdentifier } from "@vannatta-software/ts-domain";
import * as Contracts from "./contracts";

export interface IWorkflowService {
    /**
     * Creates a new workflow based on the provided command.
     * @param command The command containing the details to create a workflow.
     * @returns The created workflow.
     */
    createWorkflow(command: Contracts.ICreateWorkflowCommand): Promise<Workflow>;

    /**
     * Updates an existing workflow with the provided data.
     * @param command The command containing the workflow ID and updated fields.
     * @returns The updated workflow.
     */
    updateWorkflow(command: Contracts.IUpdateWorkflowCommand): Promise<Workflow>;

    /**
     * Activates a workflow, transitioning it to the active state.
     * @param command The command containing the workflow ID to activate.
     * @returns The updated workflow.
     */
    activateWorkflow(command: Contracts.IActivateWorkflowCommand): Promise<Workflow>;

    /**
     * Pauses an active workflow.
     * @param command The command containing the workflow ID to pause.
     * @returns The updated workflow.
     */
    pauseWorkflow(command: Contracts.IPauseWorkflowCommand): Promise<Workflow>;

    /**
     * Archives a workflow, removing it from active use.
     * @param command The command containing the workflow ID to archive.
     * @returns The updated workflow.
     */
    archiveWorkflow(command: Contracts.IArchiveWorkflowCommand): Promise<Workflow>;

    /**
     * Retrieves the details of a specific workflow by its ID.
     * @param query The query containing the workflow ID.
     * @returns The workflow with its details.
     */
    getWorkflowDetails(query: Contracts.IGetWorkflowDetailsQuery): Promise<Workflow>;

    /**
     * Retrieves a list of workflows based on the provided query.
     * @param query The query for listing workflows.
     * @returns An array of workflows matching the criteria.
     */
    listWorkflows(query: Contracts.IListWorkflowsQuery): Promise<Workflow[]>;

    /**
     * Retrieves all activities within a specific workflow.
     * @param workflowId The unique identifier of the workflow.
     * @returns An array of activities within the workflow.
     */
    getWorkflowActivities(workflowId: GlobalIdentifier): Promise<WorkflowActivity[]>;

    /**
     * Updates the activities of an existing workflow.
     * @param command The command containing the workflow ID and the updated activities.
     * @returns The updated workflow.
     */
    updateWorkflowActivities(command: Contracts.IUpdateWorkflowActivitiesCommand): Promise<Workflow>;
}
