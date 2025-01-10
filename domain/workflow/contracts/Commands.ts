import { Model, Validation } from "@vannatta-software/ts-domain";
import { Field, FieldType } from "@vannatta-software/ts-core";
import { WorkflowActivity } from "../WorkflowActivity";

export class UpdateWorkflowActivitiesCommand extends Model {
    @Field("Workflow Id", FieldType.Text)
    @Validation({ required: true })
    public workflowId: string;
    public activities: WorkflowActivity[];

    constructor(workflowId: string, activities: WorkflowActivity[]) {
        super();
        this.workflowId = workflowId;
        this.activities = activities;
    }
}

export class CreateWorkflowCommand extends Model {
    @Field("Workflow Name", FieldType.Text)
    @Validation({ required: true })
    public name: string;

    @Field("Description", FieldType.Text)
    public description?: string;

    @Field("Owner ID", FieldType.Text)
    public ownerId?: string;

    @Field("Category", FieldType.Text)
    public category?: string;

    @Field("Status", FieldType.Text)
    public status?: string;

    @Field("Tags", FieldType.Text)
    public tags?: string[];

    @Field("Activities", FieldType.Text)
    public activities: WorkflowActivity[];
}

export class UpdateWorkflowCommand extends Model {
    @Field("Workflow ID", FieldType.Text)
    @Validation({ required: true })
    public workflowId: string;

    @Field("Updated Fields", FieldType.Text)
    @Validation({ required: true })
    public updatedFields: object;
}

export class ActivateWorkflowCommand extends Model {
    @Field("Workflow ID", FieldType.Text)
    @Validation({ required: true })
    public workflowId: string;
}

export class PauseWorkflowCommand extends Model {
    @Field("Workflow ID", FieldType.Text)
    @Validation({ required: true })
    public workflowId: string;
}

export class ArchiveWorkflowCommand extends Model {
    @Field("Workflow ID", FieldType.Text)
    @Validation({ required: true })
    public workflowId: string;
}

export type ICreateWorkflowCommand = Pick<
    CreateWorkflowCommand,
    "name" | "description" | "ownerId" | "category" | "status" | "activities"
>;

export type IUpdateWorkflowCommand = Pick<UpdateWorkflowCommand, "workflowId" | "updatedFields">;

export type IActivateWorkflowCommand = Pick<ActivateWorkflowCommand, "workflowId">;

export type IPauseWorkflowCommand = Pick<PauseWorkflowCommand, "workflowId">;

export type IArchiveWorkflowCommand = Pick<ArchiveWorkflowCommand, "workflowId">;

export type IUpdateWorkflowActivitiesCommand = Pick<
    UpdateWorkflowActivitiesCommand,
    "workflowId" | "activities"
>;