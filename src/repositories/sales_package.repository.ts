import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventPublisherService } from '../services/eventPublisher.service';
import { BaseRepository } from './base.repository';
import { GlobalIdentifier, UniqueIdentifier } from '@vannatta-software/ts-domain';
import { Note } from '@domain/common/Note';
import { SalesPackage } from '@domain/sales_package/SalesPackage';
import { Pricing } from '@domain/sales_package/Pricing';
import { Validity } from '@domain/sales_package/Validity';

@Injectable()
export class SalesPackageRepository extends BaseRepository<SalesPackage> {
    constructor(
        @InjectModel(SalesPackage.name) salesPackageModel: Model<SalesPackage>,
        eventPublisherService: EventPublisherService
    ) {
        super(salesPackageModel, eventPublisherService);
    }

    protected get entityClass(): new (...args: any[]) => SalesPackage {
        return SalesPackage;
    }

    /**
     * Finds all sales packages associated with a specific workflow ID.
     * @param workflowId The workflow ID to search for.
     * @returns An array of sales packages related to the workflow ID.
     */
    async findByWorkflowId(workflowId: UniqueIdentifier): Promise<SalesPackage[]> {
        const documents = await this.model.find({ workflowId: workflowId.value }).exec();

        return documents.map((doc) => this.toDomain(doc));
    }

    /**
     * Retrieves all sales packages.
     * @returns An array of all sales packages.
     */
    async findAll(): Promise<SalesPackage[]> {
        const documents = await this.model.find().exec();
        return documents.map((doc) => this.toDomain(doc));
    }

    /**
     * Converts a MongoDB document to a `SalesPackage` domain entity.
     * @param doc The MongoDB document.
     * @returns The mapped `SalesPackage` domain entity.
     */
    private toDomain(doc: any): SalesPackage {
        return new SalesPackage({
            id: new GlobalIdentifier(doc._id),
            name: doc.name,
            workflowId: new UniqueIdentifier({ value: doc.workflowId.value }),
            leads: doc.leads.map(leadId => new UniqueIdentifier(leadId)),
            pricing: new Pricing({
                basePrice: doc.pricing.basePrice,
                discount: doc.pricing.discount,
            }),
            validity: new Validity({
                startDate: new Date(doc.validity.startDate),
                endDate: new Date(doc.validity.endDate),
            }),
            feedback: doc.feedback?.map((note: any) => new Note(note)) ?? [],
            createdAt: new Date(doc.createdAt),
            updatedAt: new Date(doc.updatedAt),
        });
    }
}
