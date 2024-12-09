import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from '@domain/report/Report';
import { ReportType, ReportStatus, ReportFormat } from '@domain/report/ReportType';
import { GlobalIdentifier, UniqueIdentifier } from '@vannatta-software/ts-domain';
import { BaseRepository } from './base.repository';
import { EventPublisherService } from 'src/services/eventPublisher.service';
import { EnumUtils } from '@domain/common/EnumUtils';

@Injectable()
export class ReportRepository extends BaseRepository<Report> {
    constructor(
        @InjectModel(Report.name) private readonly reportModel: Model<Report>,
        eventPublisherService: EventPublisherService
        ) {
        super(reportModel, eventPublisherService);
    }


    protected get entityClass(): new (...args: any[]) => Report {
        return Report;
    }

    async findByType(type: ReportType, filter?: Record<string, any>): Promise<Report[]> {
        const query = { type: type.name, ...filter };
        const documents = await this.reportModel.find(query).exec();
        return documents.map((doc) => this.toDomain(doc));
    }

    async findByStatus(status: ReportStatus, filter?: Record<string, any>): Promise<Report[]> {
        const query = { status: status.name, ...filter };
        const documents = await this.reportModel.find(query).exec();
        return documents.map((doc) => this.toDomain(doc));
    }

    async findByTypeAndStatus(
        type: ReportType,
        status: ReportStatus,
        filter?: Record<string, any>
    ): Promise<Report[]> {
        const query = { type: type.name, status: status.name, ...filter };
        const documents = await this.reportModel.find(query).exec();
        return documents.map((doc) => this.toDomain(doc));
    }

    async findAll(filter?: Record<string, any>): Promise<Report[]> {
        const documents = await this.reportModel.find(filter).exec();
        return documents.map((doc) => this.toDomain(doc));
    }

    private toDomain(doc: any): Report {
        return new Report({
            id: new GlobalIdentifier(doc._id),
            title: doc.title,
            description: doc.description,
            type: EnumUtils.fromName(ReportType, doc.type),
            format: doc.format ? EnumUtils.fromName(ReportFormat, doc.format) : undefined,
            status: EnumUtils.fromName(ReportStatus, doc.status),
            requestedBy: new UniqueIdentifier(doc.requestedBy),
            parameters: doc.parameters,
            data: doc.data,
            createdAt: new Date(doc.createdAt),
            updatedAt: new Date(doc.updatedAt),
        });
    }
}
