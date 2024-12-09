import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../repositories/client.repository';
import { IClientService } from '@domain/client/IClientService';
import * as Contracts from '@domain/client/contracts';
import { Client } from '@domain/client/Client';
import { GlobalIdentifier, UniqueIdentifier } from '@vannatta-software/ts-domain';
import { Note } from '@domain/common/Note';

@Injectable()
export class ClientService implements IClientService {
    constructor(private readonly clients: ClientRepository) {}

    async getClientDetails(query: Contracts.GetClientDetailsQuery): Promise<Client> {
        const client = await this.clients.findById(query.clientId);
        if (!client) throw new Error(`Client with ID ${query.clientId} not found.`);
        return client;
    }

    async listClients(query: Contracts.ListClientsQuery): Promise<Client[]> {
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

    async createClient(command: Contracts.CreateClientCommand): Promise<Client> {
        const client = new Client({
            name: command.name,
            contactInfo: command.contactInfo,
            notes: command.notes?.map((note) => new Note(note)),
            tags: command.tags || [],
        });

        await this.clients.insert(client);
        return client;
    }

    async updateClient(command: Contracts.UpdateClientCommand): Promise<Client> {
        const query = new Contracts.GetClientDetailsQuery()
        query.clientId = command.clientId;
        const client = await this.getClientDetails(query);
        Object.assign(client, command.updatedFields);
        client.updatedAt = new Date();
        await this.clients.update(client);
        return client;
    }

    async deleteClient(command: Contracts.DeleteClientCommand): Promise<void> {
        const query = new Contracts.GetClientDetailsQuery()
        query.clientId = command.clientId;
        const client = await this.getClientDetails(query);
        await this.clients.delete(client);
    }

    async associateSalesPackage(command: Contracts.AssociateSalesPackageCommand): Promise<Client> {
        const query = new Contracts.GetClientDetailsQuery()
        query.clientId = command.clientId;
        const client = await this.getClientDetails(query);
        if (!client.salesPackages.some((pkg) => pkg.value === command.salesPackageId)) {
            client.salesPackages.push(new UniqueIdentifier({ value: command.salesPackageId }));
        }
        await this.clients.update(client);
        return client;
    }

    async associateCampaign(command: Contracts.AssociateCampaignCommand): Promise<Client> {
        const query = new Contracts.GetClientDetailsQuery()
        query.clientId = command.clientId;
        const client = await this.getClientDetails(query);
        if (!client.activeCampaigns.some((campaign) => campaign.value === command.campaignId)) {
            client.activeCampaigns.push(new UniqueIdentifier({ value: command.campaignId }));
        }
        await this.clients.update(client);
        return client;
    }

    async getClientSalesPackages(query: Contracts.GetClientSalesPackagesQuery): Promise<UniqueIdentifier[]> {
        const detailsQuery = new Contracts.GetClientDetailsQuery()
        detailsQuery.clientId = query.clientId;
        const client = await this.getClientDetails(detailsQuery);
        return client.salesPackages;
    }

    async getClientCampaigns(query: Contracts.GetClientCampaignsQuery): Promise<UniqueIdentifier[]> {
        const detailsQuery = new Contracts.GetClientDetailsQuery()
        detailsQuery.clientId = query.clientId;
        const client = await this.getClientDetails(detailsQuery);
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

