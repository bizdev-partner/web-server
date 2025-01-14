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
            type: Activity.getType(command.type),
            scheduledDate: command.scheduledDate,
            priority: PriorityType.fromName(command.priority),
            campaignId: command.campaignId ? new UniqueIdentifier({ value: command.campaignId }) : undefined,
            notes: command.notes?.map(note => new Note({ content: note, tags: [ "Description" ]})),
            leadId: command.leadId ? new UniqueIdentifier({ value: command.leadId }) : undefined,
            status: ActivityStatus.Open
        });

        activity.rules.pending = command.rules.pending ?? 0;
        activity.rules.due = command.rules.due ?? 0;
        activity.rules.overdue = command.rules.overdue ?? 0;

        await this.activities.insert(activity);
        return activity;
    }

    async updateActivity(command: Contracts.IUpdateActivityCommand): Promise<Activity> {
            const activity = await this.getActivityDetails(new Contracts.GetActivityDetailsQuery(command.activityId));

            if (!activity)
                return;

            if (!activity.id.value || activity.id.value == "") {
                activity.id.value = command.activityId;
            }
            
            try {
                activity.priority = PriorityType.fromName(command.priority);
            } catch {}
            try {
                activity.status = ActivityStatus.fromName(command.status)
            } catch {}
            try {
                if (command.type)
                    activity.type = Activity.getType(command.type)
            } catch {}

            if (command.outcome) {
                activity.outcome = command.outcome;
                activity.status = ActivityStatus.Complete;
                activity.completionDate = new Date();
            } else {
                activity.status = ActivityStatus.Open;
            }

            activity.flagged = command.flagged ?? activity.flagged;
            activity.notes = command.notes ?? [];
            activity.leadId = command.leadId ? new UniqueIdentifier({ value: command.leadId}) : undefined;
            activity.rules.pending = command.rules?.pending ?? activity.rules.pending;
            activity.rules.due = command.rules?.due ?? activity.rules.due;
            activity.rules.overdue = command.rules?.overdue ?? activity.rules.overdue;

            if (!activity.id.value)
                return activity;

            await this.activities.update(activity);

            return activity;
    }

    async completeActivity(command: Contracts.ICompleteActivityCommand): Promise<Activity> {
        const activity = await this.getActivityDetails(new Contracts.GetActivityDetailsQuery(command.activityId));
        activity.complete(new ActivityOutcome({ description: command.outcome }));
        await this.activities.update(activity);
        return activity;
    }

    async cancelActivity(command: Contracts.ICancelActivityCommand): Promise<Activity> {
        const activity = await this.getActivityDetails(new Contracts.GetActivityDetailsQuery(command.activityId));
        activity.cancel();
        
        await this.activities.delete(activity);

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

    async getActivitiesForCampaign(
        query: Contracts.IListAcivitiesByCampaignQuery
    ): Promise<Activity[]> {
        return this.activities.findByCampaign(new UniqueIdentifier({ value: query.campaignId }));
    }

    async getActivityTemplates(query: Contracts.IListActivityTemplatesQuery): Promise<Activity[]> {
        return Activity.generateTemplates();
    }
}
