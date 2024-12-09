import { ActivityType } from "@domain/activity";
import { Workflow } from "@domain/workflow/Workflow";
import { WorkflowActivity } from "@domain/workflow/WorkflowActivity";
import { WorkflowStatus } from "@domain/workflow/WorkflowStatus";
import * as Contracts from "@domain/workflow/contracts";
import { MockWorkflowRepository, MockWorkflowService } from "../mocks/workflow.mocks";

describe("Workflow Domain", () => {
    let workflowService: MockWorkflowService;
    let mockRepository: MockWorkflowRepository;

    beforeEach(() => {
        mockRepository = new MockWorkflowRepository();
        workflowService = new MockWorkflowService(mockRepository);
    });

    it("should create a new workflow", async () => {
        const command: Contracts.ICreateWorkflowCommand = {
            name: "Test Workflow",
            description: "Workflow for testing",
            status: WorkflowStatus.Draft.name,
            activities: [
                new WorkflowActivity({
                    type: ActivityType.fromName("Email Outreach"),
                    priorityRules: { pending: 4, due: 5, overdue: 6 },
                }),
            ],
        };

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

        const command: Contracts.IUpdateWorkflowCommand = {
            workflowId: workflow.id.value,
            updatedFields: { status: WorkflowStatus.Active },
        };

        const updatedWorkflow = await workflowService.updateWorkflow(command);

        expect(updatedWorkflow.status).toEqual(WorkflowStatus.Active);
    });

    it("should activate a workflow", async () => {
        const workflow = new Workflow({
            name: "Activation Workflow",
            status: WorkflowStatus.Draft,
        });

        await mockRepository.save(workflow);

        const activatedWorkflow = await workflowService.activateWorkflow({
            workflowId: workflow.id.value,
        });

        expect(activatedWorkflow.status).toEqual(WorkflowStatus.Active);
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

        const updatedWorkflow = await workflowService.updateWorkflowActivities({
            workflowId: workflow.id.value,
            activities: updatedActivities,
        });

        expect(updatedWorkflow.activities).toHaveLength(2);
        expect(updatedWorkflow.activities[0].type.name).toEqual("Phone Call");
        expect(updatedWorkflow.activities[1].type.name).toEqual("In-Person Meeting");
    });

    it("should retrieve workflow details", async () => {
        const workflow = new Workflow({
            name: "Details Workflow",
            status: WorkflowStatus.Draft,
        });

        await mockRepository.save(workflow);

        const details = await workflowService.getWorkflowDetails({
            workflowId: workflow.id.value,
        });

        expect(details).toBeDefined();
        expect(details.name).toEqual("Details Workflow");
    });
});

