import { Model, Validation } from "@vannatta-software/ts-domain";
import { Field, FieldType } from "@vannatta-software/ts-core";

export class GetWorkflowDetailsQuery extends Model {
    @Field("Workflow ID", FieldType.Text)
    @Validation({ required: true })
    public workflowId: string;

    constructor(workflowId: string) {
        super();
        this.workflowId = workflowId;
    }
}

export class ListWorkflowsQuery extends Model {
    status?: string;
    // No additional properties required for now.
}

export type IGetWorkflowDetailsQuery = Pick<GetWorkflowDetailsQuery, "workflowId">;

export type IListWorkflowsQuery = Pick<ListWorkflowsQuery, "status">;