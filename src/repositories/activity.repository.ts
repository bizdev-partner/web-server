import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity } from '@domain/activity/Activity';
import { EventPublisherService } from '../services/eventPublisher.service';
import { BaseRepository } from './base.repository';
import { GlobalIdentifier, UniqueIdentifier } from '@vannatta-software/ts-domain';
import { ActivityType, ActivityStatus, PriorityType } from '@domain/activity/ActivityTypes';
import { ActivityOutcome } from '@domain/activity/ActivityOutcome';
import { Note } from '@domain/common/Note';
import { PriorityRules } from '@domain/activity';

@Injectable()
export class ActivityRepository extends BaseRepository<Activity> {
    constructor(
        @InjectModel(Activity.name) activityModel: Model<Activity>,
        eventPublisherService: EventPublisherService
    ) {
        super(activityModel, eventPublisherService);
    }

    protected get entityClass(): new (...args: any[]) => Activity {
        return Activity;
    }

    async findByCampaign(campaignId: UniqueIdentifier): Promise<Activity[]> {
        const documents = await this.model.find({ campaignId })

        return documents.map((doc) => this.toDomain(doc));
    }

    /**
     * Finds all activities associated with a specific lead ID.
     * @param leadId The lead ID to search for.
     * @returns An array of activities related to the lead ID.
     */
    async findByLeadId(leadId: UniqueIdentifier): Promise<Activity[]> {
        const documents = await this.model.find({ leadId }).exec();

        return documents.map((doc) => this.toDomain(doc));
    }

    /**
     * Converts a MongoDB document to an `Activity` domain entity.
     * @param doc The MongoDB document.
     * @returns The mapped `Activity` domain entity.
     */
    private toDomain(doc: any): Activity {
        return new Activity({
            id: new GlobalIdentifier(doc._id),
            type: Activity.getType(doc.type),
            priority: PriorityType.fromName(doc.priority),
            rules: new PriorityRules(doc.rules),
            outcome: doc.outcome ? new ActivityOutcome(doc.outcome) : undefined,
            status: ActivityStatus.fromName(doc.status),
            scheduledDate: doc.scheduledDate ? new Date(doc.scheduledDate) : undefined,
            completionDate: doc.completionDate ? new Date(doc.completionDate) : undefined,
            notes: doc.notes?.map((note: any) => new Note(note)) ?? [],
            leadId: doc.leadId ? new UniqueIdentifier(doc.leadId) : undefined,
            createdAt: new Date(doc.createdAt),
            updatedAt: new Date(doc.updatedAt),
        });
    }
}
