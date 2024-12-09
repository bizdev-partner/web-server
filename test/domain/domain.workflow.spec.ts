import { Workflow } from "@domain/workflow/Workflow";
import { WorkflowActivity } from "@domain/workflow/WorkflowActivity";
import { WorkflowStatus } from "@domain/workflow/WorkflowStatus";
import * as Contracts from "@domain/workflow/contracts";
import { GlobalIdentifier, UniqueIdentifier } from "@vannatta-software/ts-domain";
import { MockWorkflowRepository, MockWorkflowService } from "../mocks/workflow.mocks";
import { ActivityType } from "@domain/activity";

describe("Workflow Domain", () => {
    let workflowService: MockWorkflowService;
    let mockRepository: MockWorkflowRepository;

    beforeEach(() => {
        mockRepository = new MockWorkflowRepository();
        workflowService = new MockWorkflowService(mockRepository);
    });

    it("should create a new workflow", async () => {
        const command = new Contracts.CreateWorkflowCommand();
        command.name = "Test Workflow";
        command.description = "Workflow for testing";
        command.status = WorkflowStatus.Draft.name;
        command.activities = [
            new WorkflowActivity({
                type: ActivityType.fromName("Email Outreach"),
                priorityRules: { pending: 4, due: 5, overdue: 6 },
            }),
        ];

        const workflow = await workflowService.createWorkflow(command);
        const savedWorkflow = await mockRepository.findById(workflow.id);

        expect(savedWorkflow).toBeDefined();
        expect(savedWorkflow?.name).toEqual("Test Workflow");
        expect(savedWorkflow?.status).toEqual(WorkflowStatus.Draft);
        expect(savedWorkflow?.activities).toHaveLength(1);
    });

    it("should update a workflow", async () => {
        const workflow = new Workflow({
            name: "Initial Workflow",
            status: WorkflowStatus.Draft,
        });

        await mockRepository.save(workflow);

        const command = new Contracts.UpdateWorkflowCommand();
        command.workflowId = workflow.id.value;
        command.updatedFields = { status: WorkflowStatus.Active };

        const updatedWorkflow = await workflowService.updateWorkflow(command);

        expect(updatedWorkflow.status).toEqual(WorkflowStatus.Active);
    });

    it("should activate a workflow", async () => {
        const workflow = new Workflow({
            name: "Activation Workflow",
            status: WorkflowStatus.Draft,
        });

        await mockRepository.save(workflow);

        const command = new Contracts.ActivateWorkflowCommand();
        command.workflowId = workflow.id.value;

        const activatedWorkflow = await workflowService.activateWorkflow(command);

        expect(activatedWorkflow.status).toEqual(WorkflowStatus.Active);
    });

    it("should pause a workflow", async () => {
        const workflow = new Workflow({
            name: "Pause Workflow",
            status: WorkflowStatus.Active,
        });

        await mockRepository.save(workflow);

        const command = new Contracts.PauseWorkflowCommand();
        command.workflowId = workflow.id.value;

        const pausedWorkflow = await workflowService.pauseWorkflow(command);

        expect(pausedWorkflow.status).toEqual(WorkflowStatus.Paused);
    });

    it("should archive a workflow", async () => {
        const workflow = new Workflow({
            name: "Archive Workflow",
            status: WorkflowStatus.Paused,
        });

        await mockRepository.save(workflow);

        const command = new Contracts.ArchiveWorkflowCommand();
        command.workflowId = workflow.id.value;

        const archivedWorkflow = await workflowService.archiveWorkflow(command);

        expect(archivedWorkflow.status).toEqual(WorkflowStatus.Archived);
    });

    it("should retrieve workflow details", async () => {
        const workflow = new Workflow({
            name: "Details Workflow",
            status: WorkflowStatus.Draft,
        });

        await mockRepository.save(workflow);

        const query = new Contracts.GetWorkflowDetailsQuery(workflow.id.value);
        const details = await workflowService.getWorkflowDetails(query);

        expect(details).toBeDefined();
        expect(details.name).toEqual("Details Workflow");
    });

    it("should update a workflow's activities", async () => {
        const workflow = new Workflow({
            name: "Workflow With Activities",
            status: WorkflowStatus.Draft,
            activities: [
                new WorkflowActivity({
                    type: ActivityType.fromName("Email Outreach"),
                    priorityRules: { pending: 4, due: 5, overdue: 6 },
                }),
            ],
        });
    
        await mockRepository.save(workflow);
    
        const updatedActivities = [
            new WorkflowActivity({
                type: ActivityType.fromName("Phone Call"),
                priorityRules: { pending: 1, due: 2, overdue: 3 },
            }),
            new WorkflowActivity({
                type: ActivityType.fromName("In-Person Meeting"),
                priorityRules: { pending: 2, due: 3, overdue: 4 },
            }),
        ];
    
        const command = new Contracts.UpdateWorkflowActivitiesCommand(workflow.id.value, updatedActivities);
        const updatedWorkflow = await workflowService.updateWorkflowActivities(command);
    
        expect(updatedWorkflow.activities).toHaveLength(2);
        expect(updatedWorkflow.activities[0].type.name).toEqual("Phone Call");
        expect(updatedWorkflow.activities[1].type.name).toEqual("In-Person Meeting");
    });
    
});
