import { Activity } from "@domain/activity/Activity";
import { ActivityOutcome } from "@domain/activity/ActivityOutcome";
import { ActivityStatus, ActivityType, PriorityType } from "@domain/activity/ActivityTypes";
import * as Contracts from "@domain/activity/contracts";
import { GlobalIdentifier, UniqueIdentifier } from "@vannatta-software/ts-domain";
import { MockActivityRepository, MockActivityService } from "../mocks/activity.mocks";

describe("Activity Domain", () => {
    let activityService: MockActivityService;
    let mockRepository: MockActivityRepository;

    beforeEach(() => {
        mockRepository = new MockActivityRepository();
        activityService = new MockActivityService(mockRepository);
    });

    it("should create and schedule a new activity", async () => {
        const scheduleDate = new Date();
        const command = new Contracts.ScheduleActivityCommand();

        command.type = ActivityType.EmailOutreach.name;
        command.priority = PriorityType.Medium.name;
        command.scheduledDate = scheduleDate;
        command.leadId = "lead-1";
        command.notes = ["Initial outreach"];

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

        const command = new Contracts.CompleteActivityCommand();
        command.activityId = activity.id.value;
        command.outcome = new ActivityOutcome({
            description: "Call Connected",
            success: true,
        }).description;
        command.completionDate = new Date();

        const completedActivity = await activityService.completeActivity(command);

        expect(completedActivity.status).toEqual(ActivityStatus.Complete);
        expect(completedActivity.outcome?.description).toEqual("Call Connected");
        expect(completedActivity.completionDate).toBeDefined();
    });

    it("should cancel an activity", async () => {
        const activity = new Activity({
            type: ActivityType.InPersonMeeting,
            priority: PriorityType.Low,
            status: ActivityStatus.Open,
            leadId: new UniqueIdentifier({ value: "lead-3"}),
        });

        await mockRepository.save(activity);

        const command = new Contracts.CancelActivityCommand();
        command.activityId = activity.id.value;

        const canceledActivity = await activityService.cancelActivity(command);

        expect(canceledActivity.status).toEqual(ActivityStatus.Cancelled);
    });

    it("should reschedule an activity", async () => {
        const activity = new Activity({
            type: ActivityType.ProductDemo,
            priority: PriorityType.High,
            status: ActivityStatus.Open,
            scheduledDate: new Date(),
            leadId: new UniqueIdentifier({ value: "lead-4"}),
        });

        await mockRepository.save(activity);

        const newDate = new Date(Date.now() + 86400000); // 1 day later
        const command = new Contracts.RescheduleActivityCommand();
        command.activityId = activity.id.value;
        command.newScheduledDate = newDate;

        const rescheduledActivity = await activityService.rescheduleActivity(command);

        expect(rescheduledActivity.scheduledDate).toEqual(newDate);
        expect(rescheduledActivity.status).toEqual(ActivityStatus.Open);
    });

    it("should retrieve activities for a specific lead", async () => {
        const leadId = new UniqueIdentifier({ value: "lead-5"});
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
                leadId: new UniqueIdentifier({ value: "other-lead"}),
            }),
        ];

        for (const activity of activities) {
            await mockRepository.save(activity);
        }

        const query = new Contracts.ListActivitiesForLeadQuery(leadId.value);
        const leadActivities = await activityService.getActivitiesForLead(query);

        expect(leadActivities).toHaveLength(2);
        expect(leadActivities.every((activity) => activity.leadId?.equals(leadId))).toBe(true);
    });

    it("should retrieve activity details", async () => {
        const activity = new Activity({
            type: ActivityType.Closing,
            priority: PriorityType.High,
            leadId: new UniqueIdentifier({ value: "lead-6"}),
        });

        await mockRepository.save(activity);

        const query = new Contracts.GetActivityDetailsQuery(activity.id.value);
        const details = await activityService.getActivityDetails(query);

        expect(details).toBeDefined();
        expect(details.type).toEqual(ActivityType.Closing);
        expect(details.priority).toEqual(PriorityType.High);
        expect(details.leadId?.value).toBe("lead-6");
    });
});
