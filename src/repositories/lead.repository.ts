import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadStatus, Name, ContactInfo } from '@domain/lead';
import { BaseRepository } from './base.repository';
import { GlobalIdentifier } from '@vannatta-software/ts-domain';
import { extractRelevantSchema } from 'src/schemas/mongo.schema';
import { EventPublisherService } from 'src/services/eventPublisher.service';

@Injectable()
export class LeadRepository extends BaseRepository<Lead> {
    constructor(
        @InjectModel(Lead.name) leadModel: Model<Lead>,
        eventPublisherService: EventPublisherService
    ) {
        super(leadModel, eventPublisherService);
    }

    protected get entityClass(): new (...args: any[]) => Lead {
        return Lead;
    }

    async findByEmail(email: string): Promise<Lead[]> {
        const documents = await this.model.find({ "contactInfo.email": email }).exec();

        return documents.map(this.toDomain);
    }

    async findByStatus(status: LeadStatus): Promise<Lead[]> {
        const documents = await this.model.find({ status: status.name }).exec();
        return documents.map((doc) => this.toDomain(doc));
    }

    private toDomain(doc: any): Lead {
        return new Lead({
            id: new GlobalIdentifier(doc._id),
            name: new Name(doc.name),
            contactInfo: new ContactInfo(doc.contactInfo),
            status: LeadStatus.fromName(doc.status),
            notes: doc.notes ?? [],
            tags: doc.tags ?? [],
            createdAt: new Date(doc.createdAt),
            updatedAt: new Date(doc.updatedAt),
        });
    }
}
