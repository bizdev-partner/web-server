import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../repositories/client.repository';
import { IClientService } from '@domain/client/IClientService';
import * as Contracts from '@domain/client/contracts';
import { Client } from '@domain/client/Client';
import { GlobalIdentifier, UniqueIdentifier } from '@vannatta-software/ts-domain';
import { Note } from '@domain/common/Note';
import { CampaignService } from './campaign.service';
import { SalesPackageService } from './sales_package.service';

@Injectable()
export class ClientService implements IClientService {
    constructor(
        private readonly clients: ClientRepository,
        private readonly campaigns: CampaignService,
        private readonly salesPackages: SalesPackageService
    ) {}

    async getClientDetails(query: Contracts.IGetClientDetailsQuery): Promise<Client> {
        const client = await this.clients.findById(query.clientId);
        if (!client) throw new Error(`Client with ID ${query.clientId} not found.`);
        return client;
    }

    async listClients(query: Contracts.IListClientsQuery): Promise<Client[]> {
        let clients = await this.clients.findAll();

        if (query.status) {
            clients = clients.filter((client) => client.status.name === query.status);
        }

        if (query.filter) {
            clients = clients.filter((client) =>
                Object.entries(query.filter || {}).every(([key, value]) => {
                    const clientValue = (client as any)[key];
                    if (Array.isArray(clientValue)) {
                        return Array.isArray(value) && value.every((v) => clientValue.includes(v));
                    }
                    return clientValue === value;
                })
            );
        }

        return clients;
    }

    async createClient(command: Contracts.ICreateClientCommand): Promise<Client> {
        const client = new Client({
            name: command.name,
            contactInfo: command.contactInfo,
            notes: command.notes?.map((note) => new Note(note)),
            tags: command.tags || [],
        });

        await this.clients.insert(client);
        return client;
    }

    async updateClient(command: Contracts.IUpdateClientCommand): Promise<Client> {
        const client = await this.getClientDetails(command);
        if (client) {
            client.update(command.updatedFields);
            client.updatedAt = new Date();
        }
        await this.clients.update(client);
        return client;
    }

    async deleteClient(command: Contracts.IDeleteClientCommand): Promise<void> {
        const client = await this.getClientDetails(command);

        for (var packageId of client.salesPackages) {
            try {
                await this.salesPackages.deletePackage({ packageId: packageId.value })
            } catch {}
        }

        for (var campaignId of client.activeCampaigns) {
            try {
                await this.campaigns.cancelCampaign({ campaignId: campaignId.value })
            } catch {}
        }

        client.delete();
        await this.clients.delete(client);
    }

    async associateSalesPackage(command: Contracts.IAssociateSalesPackageCommand): Promise<Client> {
        const client = await this.getClientDetails(command);
        if (!client.salesPackages.some((pkg) => pkg.value === command.salesPackageId)) {
            client.salesPackages.push(new UniqueIdentifier({ value: command.salesPackageId }));
        }
        await this.clients.update(client);
        return client;
    }

    async associateCampaign(command: Contracts.IAssociateCampaignCommand): Promise<Client> {
        const client = await this.getClientDetails(command);
        if (!client.activeCampaigns.some((campaign) => campaign.value === command.campaignId)) {
            client.activeCampaigns.push(new UniqueIdentifier({ value: command.campaignId }));
        }
        await this.clients.update(client);
        return client;
    }

    async getClientSalesPackages(query: Contracts.IGetClientSalesPackagesQuery): Promise<UniqueIdentifier[]> {
        const client = await this.getClientDetails(query);
        return client.salesPackages;
    }

    async getClientCampaigns(query: Contracts.IGetClientCampaignsQuery): Promise<UniqueIdentifier[]> {
        const client = await this.getClientDetails(query);
        return client.activeCampaigns;
    }

    async addNoteToClient(clientId: GlobalIdentifier, note: Note): Promise<Client> {
        const client = await this.clients.findById(clientId.value);
        if (!client) throw new Error(`Client with ID ${clientId.value} not found.`);
        client.notes.push(note);
        await this.clients.update(client);
        return client;
    }
}

