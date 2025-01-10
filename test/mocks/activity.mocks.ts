import { Activity } from "@domain/activity/Activity";
import { ActivityOutcome } from "@domain/activity/ActivityOutcome";
import { ActivityStatus, ActivityType, PriorityType } from "@domain/activity/ActivityTypes";
import { IActivityRepository } from "@domain/activity/IActivityRepository";
import { IActivityService } from "@domain/activity/IActivityService";
import * as Contracts from "@domain/activity/contracts";
import { Note } from "@domain/common/Note";
import { GlobalIdentifier, UniqueIdentifier } from "@vannatta-software/ts-domain";

// Mock Repository
class MockActivityRepository implements IActivityRepository {
    private activities: Map<string, Activity> = new Map();

    async save(activity: Activity): Promise<void> {
        this.activities.set(activity.id.value, activity);
    }

    async findById(activityId: GlobalIdentifier): Promise<Activity | undefined> {
        return this.activities.get(activityId.value);
    }

    async findByLeadId(leadId: UniqueIdentifier): Promise<Activity[]> {
        return Array.from(this.activities.values()).filter(
            (activity) => activity.leadId?.value === leadId.value
        );
    }

     async findByCampaign(campaignId: UniqueIdentifier): Promise<Activity[]> {
        return Array.from(this.activities.values()).filter(
            (activity) => activity.campaignId?.value === campaignId.value
        );
     }

    async delete(activityId: GlobalIdentifier): Promise<void> {
        this.activities.delete(activityId.value);
    }
}


// Mock Service
class MockActivityService implements IActivityService {
    private repository: IActivityRepository;

    constructor(repository: IActivityRepository = new MockActivityRepository()) {
        this.repository = repository;
    }

    async scheduleActivity(
        command: Contracts.IScheduleActivityCommand
    ): Promise<Activity> {
        const activity = new Activity({
            type: Activity.getType(command.type),
            priority: PriorityType.fromName(command.priority),
            status: ActivityStatus.Open,
            scheduledDate: command.scheduledDate,
            leadId: command.leadId ? new UniqueIdentifier({ value: command.leadId }) : undefined,
            notes: command.notes?.map((content) => new Note({ content })),
        });

        await this.repository.save(activity);
        return activity;
    }

    async completeActivity(
        command: Contracts.ICompleteActivityCommand
    ): Promise<Activity> {
        const activity = await this.repository.findById(new GlobalIdentifier(command.activityId));
        if (!activity) {
            throw new Error(`Activity with ID ${command.activityId} not found.`);
        }

        const outcome = new ActivityOutcome({
            description: command.outcome,
        });
        activity.complete(outcome);
        await this.repository.save(activity);
        return activity;
    }

    async cancelActivity(
        command: Contracts.ICancelActivityCommand
    ): Promise<Activity> {
        const activity = await this.repository.findById(new GlobalIdentifier(command.activityId));
        if (!activity) {
            throw new Error(`Activity with ID ${command.activityId} not found.`);
        }

        activity.cancel();
        await this.repository.save(activity);
        return activity;
    }

    async rescheduleActivity(
        command: Contracts.IRescheduleActivityCommand
    ): Promise<Activity> {
        const activity = await this.repository.findById(new GlobalIdentifier(command.activityId));
        if (!activity) {
            throw new Error(`Activity with ID ${command.activityId} not found.`);
        }

        activity.reschedule(command.newScheduledDate);
        await this.repository.save(activity);
        return activity;
    }

    async getActivitiesForLead(
        query: Contracts.IListActivitiesForLeadQuery
    ): Promise<Activity[]> {
        return this.repository.findByLeadId(new UniqueIdentifier({ value: query.leadId }));
    }

    async getActivityDetails(
        query: Contracts.IGetActivityDetailsQuery
    ): Promise<Activity> {
        const activity = await this.repository.findById(new GlobalIdentifier(query.activityId));
        if (!activity) {
            throw new Error(`Activity with ID ${query.activityId} not found.`);
        }

        return activity;
    }
    
    async getActivityTemplates(query: Contracts.IListActivityTemplatesQuery): Promise<Activity[]> {
        return Activity.generateTemplates();
    }
}

export { MockActivityRepository, MockActivityService };
