import { Injectable } from '@nestjs/common';
import { Activity, ActivityOutcome, ActivityStatus, ActivityType, PriorityType } from '@domain/activity';
import { IActivityService } from '@domain/activity/IActivityService';
import * as Contracts from '@domain/activity/contracts';
import { ActivityRepository } from '../repositories/activity.repository';
import { GlobalIdentifier, UniqueIdentifier } from '@vannatta-software/ts-domain';
import { Note } from '@domain/common/Note';

@Injectable()
export class ActivityService implements IActivityService {
    constructor(private readonly activities: ActivityRepository) {}

    async getAll(): Promise<Activity[]> {
        return this.activities.findAll();
    }

    async getActivityDetails(query: Contracts.IGetActivityDetailsQuery): Promise<Activity> {
        const activity = await this.activities.findById(query.activityId);
        if (!activity) throw new Error('Activity not found');
        return activity;
    }

    async scheduleActivity(command: Contracts.IScheduleActivityCommand): Promise<Activity> {
        const activity = new Activity({
            type: ActivityType.fromName(command.type),
            priority: PriorityType.fromName(command.priority),
            scheduledDate: command.scheduledDate,
            leadId: command.leadId ? new UniqueIdentifier({ value: command.leadId }) : undefined,
            notes: command.notes?.map((note) => new Note({ content: note })),
            status: ActivityStatus.Open,
        });

        await this.activities.insert(activity);
        return activity;
    }

    async completeActivity(command: Contracts.ICompleteActivityCommand): Promise<Activity> {
        const activity = await this.getActivityDetails(new Contracts.GetActivityDetailsQuery(command.activityId));
        activity.complete(new ActivityOutcome({ description: command.outcome, success: command.success }));
        await this.activities.update(activity);
        return activity;
    }

    async cancelActivity(command: Contracts.ICancelActivityCommand): Promise<Activity> {
        const activity = await this.getActivityDetails(new Contracts.GetActivityDetailsQuery(command.activityId));
        activity.cancel();
        await this.activities.update(activity);
        return activity;
    }

    async rescheduleActivity(command: Contracts.IRescheduleActivityCommand): Promise<Activity> {
        const activity = await this.getActivityDetails(new Contracts.GetActivityDetailsQuery(command.activityId));
        activity.reschedule(command.newScheduledDate);
        await this.activities.update(activity);
        return activity;
    }

    async getActivitiesForLead(
        query: Contracts.IListActivitiesForLeadQuery
    ): Promise<Activity[]> {
        return this.activities.findByLeadId(new UniqueIdentifier({ value: query.leadId }));
    }

    async getActivityTemplates(query: Contracts.IListActivityTemplatesQuery): Promise<Activity[]> {
        return Activity.generateTemplates();
    }
}
