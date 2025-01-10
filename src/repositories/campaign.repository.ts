import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign } from '@domain/campaign/Campaign';
import { BaseRepository } from './base.repository';
import { EventPublisherService } from '../services/eventPublisher.service';
import { GlobalIdentifier, UniqueIdentifier } from '@vannatta-software/ts-domain';

@Injectable()
export class CampaignRepository extends BaseRepository<Campaign> {
    constructor(
        @InjectModel(Campaign.name) campaignModel: Model<Campaign>,
        eventPublisherService: EventPublisherService
    ) {
        super(campaignModel, eventPublisherService);
    }

    protected get entityClass(): new (...args: any[]) => Campaign {
        return Campaign;
    }

    /**
     * Retrieves campaigns by status.
     * @param status The status to filter campaigns.
     * @returns A list of campaigns with the given status.
     */
    async findByStatus(status: string): Promise<Campaign[]> {
        const documents = await this.model.find({  }).exec();
        return documents.map((doc) => this.toDomain(doc));
    }

    /**
     * Converts a MongoDB document to a `Campaign` domain entity.
     * @param doc The MongoDB document.
     * @returns The mapped `Campaign` domain entity.
     */
    private toDomain(doc: any): Campaign {
        return new Campaign({
            id: new GlobalIdentifier(doc._id),
            name: doc.name,
            salesPackageId: new UniqueIdentifier({ value: doc.salesPackageId }),
            targetLeads: doc.targetLeads.map((lead) => new UniqueIdentifier(lead)),
            workflowId: new UniqueIdentifier({ value: doc.workflowId }),
            activities: doc.campaignActivities, // Assume mapping logic for activities is in the Campaign entity
            startDate: new Date(doc.startDate),
            endDate: new Date(doc.endDate),
            status: doc.status,
            metrics: doc.metrics,
            createdAt: new Date(doc.createdAt),
            updatedAt: new Date(doc.updatedAt),
        });
    }
}
