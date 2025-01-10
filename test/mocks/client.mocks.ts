import { IClientRepository } from "@domain/client/IClientRepository";
import { Client } from "@domain/client/Client";
import { GlobalIdentifier, UniqueIdentifier } from "@vannatta-software/ts-domain";
import { IClientService } from "@domain/client/IClientService";
import { Note } from "@domain/common/Note";
import * as Contracts from "@domain/client/contracts";

export class MockClientRepository implements IClientRepository {
    private clients: Map<string, Client> = new Map();

    async save(client: Client): Promise<void> {
        this.clients.set(client.id.value, client);
    }

    async findById(clientId: GlobalIdentifier): Promise<Client | undefined> {
        return this.clients.get(clientId.value);
    }

    async findByStatus(status: string): Promise<Client[]> {
        return Array.from(this.clients.values()).filter(
            (client) => client.status.name === status
        );
    }

    async findWithActiveCampaigns(): Promise<Client[]> {
        return Array.from(this.clients.values()).filter(
            (client) => client.activeCampaigns.length > 0
        );
    }

    async findWithSalesPackages(): Promise<Client[]> {
        return Array.from(this.clients.values()).filter(
            (client) => client.salesPackages.length > 0
        );
    }

    async delete(clientId: GlobalIdentifier): Promise<void> {
        this.clients.delete(clientId.value);
    }

     async getAll(): Promise<Client[]> {
         return Array.from(this.clients.values());
     }
}

export class MockClientService implements IClientService {
    private repository: IClientRepository;

    constructor(repository: IClientRepository = new MockClientRepository()) {
        this.repository = repository;
    }

    async createClient(command: Contracts.ICreateClientCommand): Promise<Client> {
        const client = new Client({
            name: command.name,
            contactInfo: command.contactInfo,
            notes: command.notes?.map((note) => new Note(note)),
            tags: command.tags || [],
        });

        await this.repository.save(client);
        return client;
    }

    async updateClient(command: Contracts.IUpdateClientCommand): Promise<Client> {
        const client = await this.repository.findById(new GlobalIdentifier(command.clientId));
        if (!client) {
            throw new Error(`Client with ID ${command.clientId} not found.`);
        }

        Object.assign(client, command.updatedFields);
        client.updatedAt = new Date();

        await this.repository.save(client);
        return client;
    }

    async deleteClient(command: Contracts.IDeleteClientCommand): Promise<void> {
        const client = await this.repository.findById(new GlobalIdentifier(command.clientId));
        if (!client) {
            throw new Error(`Client with ID ${command.clientId} not found.`);
        }

        await this.repository.delete(client.id);
    }

    async associateSalesPackage(command: Contracts.IAssociateSalesPackageCommand): Promise<Client> {
        const client = await this.repository.findById(new GlobalIdentifier(command.clientId));
        if (!client) {
            throw new Error(`Client with ID ${command.clientId} not found.`);
        }

        if (!client.salesPackages.some((pkg) => pkg.value == command.salesPackageId)) {
            client.salesPackages.push(new UniqueIdentifier({ value: command.salesPackageId }));
        }

        await this.repository.save(client);
        return client;
    }

    async associateCampaign(command: Contracts.IAssociateCampaignCommand): Promise<Client> {
        const client = await this.repository.findById(new GlobalIdentifier(command.clientId));
        if (!client) {
            throw new Error(`Client with ID ${command.clientId} not found.`);
        }

        if (!client.activeCampaigns.some((campaign) => campaign.value ==  command.campaignId)) {
            client.activeCampaigns.push(new UniqueIdentifier({ value: command.campaignId } ));
        }

        await this.repository.save(client);
        return client;
    }

    async getClientDetails(query: Contracts.IGetClientDetailsQuery): Promise<Client> {
        const client = await this.repository.findById(new GlobalIdentifier(query.clientId));
        if (!client) {
            throw new Error(`Client with ID ${query.clientId} not found.`);
        }

        return client;
    }

    async listClients(query: Contracts.IListClientsQuery): Promise<Client[]> {
        let clients = await this.repository.getAll();
    
        if (query.status) {
            clients = clients.filter(client => client.status.name === query.status);
        }
    
        if (query.filter) {
            clients = clients.filter(client =>
                Object.entries(query.filter || {}).every(([key, value]) => {
                    const clientValue = (client as any)[key];
                    if (Array.isArray(clientValue)) {
                        return Array.isArray(value) && value.every(v => clientValue.includes(v));
                    }
                    return clientValue === value;
                })
            );
        }
    
        return clients;
    }
    async getClientSalesPackages(query: Contracts.IGetClientSalesPackagesQuery): Promise<UniqueIdentifier[]> {
        const client = await this.repository.findById(new GlobalIdentifier(query.clientId));
        if (!client) {
            throw new Error(`Client with ID ${query.clientId} not found.`);
        }

        return client.salesPackages;
    }

    async getClientCampaigns(query: Contracts.IGetClientCampaignsQuery): Promise<UniqueIdentifier[]> {
        const client = await this.repository.findById(new GlobalIdentifier(query.clientId));
        if (!client) {
            throw new Error(`Client with ID ${query.clientId} not found.`);
        }

        return client.activeCampaigns;
    }

    async addNoteToClient(clientId: GlobalIdentifier, note: Note): Promise<Client> {
        const client = await this.repository.findById(clientId);
        if (!client) {
            throw new Error(`Client with ID ${clientId.value} not found.`);
        }

        client.notes.push(note);
        await this.repository.save(client);

        return client;
    }
}

