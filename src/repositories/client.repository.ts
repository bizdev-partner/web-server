import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from '@domain/client/Client';
import { BaseRepository } from './base.repository';
import { GlobalIdentifier, UniqueIdentifier } from '@vannatta-software/ts-domain';
import { ContactInfo } from '@domain/common/ContactInfo';
import { Note } from '@domain/common/Note';
import { Name } from '@domain/common/Name';
import { ClientStatus } from '@domain/client/ClientStatus';
import { EventPublisherService } from 'src/services/eventPublisher.service';
import { EnumUtils } from '@domain/common/EnumUtils';

@Injectable()
export class ClientRepository extends BaseRepository<Client> {
    constructor(
        @InjectModel(Client.name) clientModel: Model<Client>,
        eventPublisher: EventPublisherService
    ) {
        super(clientModel, eventPublisher);
    }

    protected get entityClass(): new (...args: any[]) => Client {
        return Client;
    }

    async findByStatus(status: string): Promise<Client[]> {
        const documents = await this.model.find({ status }).exec();
        return documents.map((doc) => this.toDomain(doc));
    }

    async findWithActiveCampaigns(): Promise<Client[]> {
        const documents = await this.model.find({ activeCampaigns: { $exists: true, $not: { $size: 0 } } }).exec();
        return documents.map((doc) => this.toDomain(doc));
    }

    async findWithSalesPackages(): Promise<Client[]> {
        const documents = await this.model.find({ salesPackages: { $exists: true, $not: { $size: 0 } } }).exec();
        return documents.map((doc) => this.toDomain(doc));
    }

    private toDomain(doc: any): Client {
        return new Client({
            id: new GlobalIdentifier(doc._id),
            name: new Name(doc.name),
            contactInfo: new ContactInfo(doc.contactInfo),
            status: EnumUtils.fromName(ClientStatus, doc.status),
            notes: doc.notes?.map((note: any) => new Note(note)) ?? [],
            salesPackages: doc.salesPackages?.map((pkg: any) => new UniqueIdentifier(pkg)) ?? [],
            activeCampaigns: doc.activeCampaigns?.map((campaign: any) => new UniqueIdentifier(campaign)) ?? [],
            tags: doc.tags ?? [],
            createdAt: new Date(doc.createdAt),
            updatedAt: new Date(doc.updatedAt),
        });
    }
}
