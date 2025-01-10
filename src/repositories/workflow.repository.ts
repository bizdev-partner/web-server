import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workflow } from '@domain/workflow/Workflow';
import { WorkflowActivity } from '@domain/workflow/WorkflowActivity';
import { WorkflowStatus } from '@domain/workflow/WorkflowStatus';
import { GlobalIdentifier, UniqueIdentifier } from '@vannatta-software/ts-domain';
import { BaseRepository } from './base.repository';
import { EventPublisherService } from 'src/services/eventPublisher.service';

@Injectable()
export class WorkflowRepository extends BaseRepository<Workflow> {
    constructor(
        @InjectModel(Workflow.name) workflowModel: Model<Workflow>,
        eventPublisherService: EventPublisherService    
    ) {
        super(workflowModel, eventPublisherService);
    }

    protected get entityClass(): new (...args: any[]) => Workflow {
        return Workflow;
    }

    /**
     * Converts a MongoDB document to a `Workflow` domain entity.
     * @param doc The MongoDB document.
     * @returns The mapped `Workflow` domain entity.
     */
    protected toDomain(doc: any): Workflow {
        return new Workflow({
            id: new GlobalIdentifier(doc._id),
            name: doc.name,
            description: doc.description,
            status: WorkflowStatus.fromName(doc.status),
            createdAt: new Date(doc.createdAt),
            updatedAt: new Date(doc.updatedAt),
            ownerId: doc.ownerId ? new UniqueIdentifier({ value: doc.ownerId }) : undefined,
            category: doc.category,
            activities: doc.activities?.map((activity: any) => this.toDomainActivity(activity)) ?? [],
        });
    }

    /**
     * Converts a MongoDB sub-document to a `WorkflowActivity` domain entity.
     * @param doc The MongoDB sub-document.
     * @returns The mapped `WorkflowActivity` domain entity.
     */
    private toDomainActivity(doc: any): WorkflowActivity {
        return new WorkflowActivity({
            type: doc.type,
            priorityRules: doc.priorityRules,
            notes: doc.notes,
        });
    }

    /**
     * Finds workflows by status.
     * @param status The status to filter by.
     * @returns An array of workflows with the given status.
     */
    async findByStatus(status: WorkflowStatus): Promise<Workflow[]> {
        const documents = await this.model.find({ status: status.name }).exec();
        return documents.map((doc) => this.toDomain(doc));
    }
}
