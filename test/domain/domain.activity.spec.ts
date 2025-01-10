import { Activity } from "@domain/activity/Activity";
import { ActivityOutcome } from "@domain/activity/ActivityOutcome";
import { ActivityStatus, ActivityType, PriorityType } from "@domain/activity/ActivityTypes";
import * as Contracts from "@domain/activity/contracts";
import { GlobalIdentifier, UniqueIdentifier } from "@vannatta-software/ts-domain";
import { MockActivityRepository, MockActivityService } from "../mocks/activity.mocks";
import { PriorityRules } from "@domain/activity";

describe("Activity Domain", () => {
    let activityService: MockActivityService;
    let mockRepository: MockActivityRepository;

    beforeEach(() => {
        mockRepository = new MockActivityRepository();
        activityService = new MockActivityService(mockRepository);
    });

    it("should create and schedule a new activity", async () => {
        const scheduleDate = new Date();
        const command: Contracts.IScheduleActivityCommand = {
            type: ActivityType.EmailOutreach.name,
            rules: new PriorityRules({}),
            priority: PriorityType.Medium.name,
            scheduledDate: scheduleDate,
            leadId: "lead-1",
            notes: ["Initial outreach"],
        };

        const activity = await activityService.scheduleActivity(command);
        const savedActivity = await mockRepository.findById(activity.id);

        expect(savedActivity).toBeDefined();
        expect(savedActivity?.type).toEqual(ActivityType.EmailOutreach);
        expect(savedActivity?.priority).toEqual(PriorityType.Medium);
        expect(savedActivity?.status).toEqual(ActivityStatus.Open);
        expect(savedActivity?.scheduledDate).toEqual(scheduleDate);
        expect(savedActivity?.notes).toHaveLength(1);
        expect(savedActivity?.leadId?.value).toBe("lead-1");
    });

    it("should complete an activity", async () => {
        const activity = new Activity({
            type: ActivityType.PhoneCall,
            priority: PriorityType.High,
            status: ActivityStatus.InProgress,
            scheduledDate: new Date(),
            leadId: new UniqueIdentifier("lead-2"),
        });

        await mockRepository.save(activity);

        const command: Contracts.ICompleteActivityCommand = {
            activityId: activity.id.value,
            outcome: "Call Connected",
            success: true,
            completionDate: new Date(),
        };

        const completedActivity = await activityService.completeActivity(command);

        expect(completedActivity.status).toEqual(ActivityStatus.Complete);
        expect(completedActivity.outcome?.description).toEqual("Call Connected");
        expect(completedActivity.completionDate).toBeDefined();
    });

    it("should cancel an activity", async () => {
        const activity = new Activity({
            type: ActivityType.InPersonVisit,
            priority: PriorityType.Low,
            status: ActivityStatus.Open,
            leadId: new UniqueIdentifier({ value: "lead-3" }),
        });

        await mockRepository.save(activity);

        const command: Contracts.ICancelActivityCommand = {
            activityId: activity.id.value,
        };

        const canceledActivity = await activityService.cancelActivity(command);

        expect(canceledActivity.status).toEqual(ActivityStatus.Cancelled);
    });

    it("should reschedule an activity", async () => {
        const activity = new Activity({
            type: ActivityType.ProductDemo,
            priority: PriorityType.High,
            status: ActivityStatus.Open,
            scheduledDate: new Date(),
            leadId: new UniqueIdentifier({ value: "lead-4" }),
        });

        await mockRepository.save(activity);

        const newDate = new Date(Date.now() + 86400000); // 1 day later
        const command: Contracts.IRescheduleActivityCommand = {
            activityId: activity.id.value,
            newScheduledDate: newDate,
        };

        const rescheduledActivity = await activityService.rescheduleActivity(command);

        expect(rescheduledActivity.scheduledDate).toEqual(newDate);
        expect(rescheduledActivity.status).toEqual(ActivityStatus.Open);
    });

    it("should retrieve activities for a specific lead", async () => {
        const leadId = new UniqueIdentifier({ value: "lead-5" });
        const activities = [
            new Activity({
                type: ActivityType.EmailOutreach,
                leadId: leadId,
            }),
            new Activity({
                type: ActivityType.PhoneCall,
                leadId: leadId,
            }),
            new Activity({
                type: ActivityType.NetworkingEvent,
                leadId: new UniqueIdentifier({ value: "other-lead" }),
            }),
        ];

        for (const activity of activities) {
            await mockRepository.save(activity);
        }

        const query: Contracts.IListActivitiesForLeadQuery = { leadId: leadId.value };
        const leadActivities = await activityService.getActivitiesForLead(query);

        expect(leadActivities).toHaveLength(2);
        expect(leadActivities.every((activity) => activity.leadId?.equals(leadId))).toBe(true);
    });

    it("should retrieve activity details", async () => {
        const activity = new Activity({
            type: ActivityType.ContractNegotiation,
            priority: PriorityType.High,
            leadId: new UniqueIdentifier({ value: "lead-6" }),
        });

        await mockRepository.save(activity);

        const query: Contracts.IGetActivityDetailsQuery = { activityId: activity.id.value };
        const details = await activityService.getActivityDetails(query);

        expect(details).toBeDefined();
        expect(details.type).toEqual(ActivityType.ContractNegotiation);
        expect(details.priority).toEqual(PriorityType.High);
        expect(details.leadId?.value).toBe("lead-6");
    });
});
