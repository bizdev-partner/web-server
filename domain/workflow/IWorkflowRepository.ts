import { Workflow } from "./Workflow";
import { WorkflowStatus } from "./WorkflowStatus";
import { GlobalIdentifier } from "@vannatta-software/ts-domain";

export interface IWorkflowRepository {
    /**
     * Stores a new or updated workflow.
     * @param workflow The workflow to save.
     */
    save(workflow: Workflow): Promise<void>;

    /**
     * Retrieves a workflow by its unique identifier.
     * @param id The unique identifier of the workflow.
     */
    findById(id: GlobalIdentifier): Promise<Workflow | undefined>;

    /**
     * Retrieves workflows based on their status.
     * @param status The status of the workflows to retrieve.
     */
    findByStatus(status: WorkflowStatus): Promise<Workflow[]>;

    /**
     * Removes a workflow from the repository.
     * @param id The unique identifier of the workflow to delete.
     */
    delete(id: GlobalIdentifier): Promise<void>;
}
