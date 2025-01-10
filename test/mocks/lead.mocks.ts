import { ContactInfo, ILeadRepository, ILeadService, Lead, LeadStatus, Name } from "@domain/lead";
import { GlobalIdentifier } from "@vannatta-software/ts-domain";
import * as Contracts from "@domain/lead/contracts";

export class MockLeadRepository implements ILeadRepository {
    private leads: Map<string, Lead> = new Map();

    async save(lead: Lead): Promise<void> {
        this.leads.set(lead.id.value, lead);
    }

    async findById(leadId: GlobalIdentifier): Promise<Lead | undefined> {
        return this.leads.get(leadId.value);
    }

    async findByStatus(status: LeadStatus): Promise<Lead[]> {
        return Array.from(this.leads.values()).filter((lead) => lead.status.equals(status));
    }

    async delete(leadId: GlobalIdentifier): Promise<void> {
        this.leads.delete(leadId.value);
    }
}

export class MockLeadService implements ILeadService {
    private repository: ILeadRepository;

    constructor(repository: ILeadRepository = new MockLeadRepository()) {
        this.repository = repository;
    }

    async createLead(command: Contracts.ICreateLeadCommand): Promise<Lead> {
        const lead = new Lead({
            name: new Name({ firstName: command.firstName, lastName: command.lastName }),
            contactInfo: new ContactInfo({ email: command.email, phone: command.phone }),
            status: LeadStatus.Known,
            notes: command.notes ?? [],
            tags: command.tags ?? [],
        });

        await this.repository.save(lead);
        return lead;
    }

    async updateLead(command: Contracts.IUpdateLeadCommand): Promise<Lead> {
        const lead = await this.repository.findById(new GlobalIdentifier(command.leadId));
        if (!lead) {
            throw new Error(`Lead with ID ${command.leadId} not found.`);
        }

        if (command.firstName || command.lastName) {
            lead.name = new Name({
                firstName: command.firstName ?? lead.name.firstName,
                lastName: command.lastName ?? lead.name.lastName,
            });
        }

        if (command.email || command.phone) {
            lead.contactInfo = new ContactInfo({
                email: command.email ?? lead.contactInfo.email,
                phone: command.phone ?? lead.contactInfo.phone,
            });
        }

        if (command.notes) {
            lead.notes = command.notes;
        }

        if (command.tags) {
            lead.tags = command.tags;
        }

        if (command.status) {
            lead.status = LeadStatus.fromName(command.status);
        }

        await this.repository.save(lead);
        return lead;
    }

    async updateLeadStatus(command: Contracts.IUpdateLeadStatusCommand): Promise<Lead> {
        const lead = await this.repository.findById(new GlobalIdentifier(command.leadId));
        if (!lead) {
            throw new Error(`Lead with ID ${command.leadId} not found.`);
        }

        const newStatus = LeadStatus.fromName(command.newStatus);
        lead.status = newStatus;

        await this.repository.save(lead);
        return lead;
    }
    async getLeadsByStatus(status: string): Promise<Lead[]> {
        const leadStatus = LeadStatus.fromName(status);
        return this.repository.findByStatus(leadStatus);
    }

    async getLeadDetails(query: Contracts.IGetLeadDetailsQuery): Promise<Lead> {
        const lead = await this.repository.findById(new GlobalIdentifier(query.leadId));
        if (!lead) {
            throw new Error(`Lead with ID ${query.leadId} not found.`);
        }

        return lead;
    }

    async listLeads(query: Contracts.IListLeadsQuery): Promise<Lead[]> {
        const allLeads = await this.repository.findByStatus(LeadStatus.Known);
        let filteredLeads = allLeads;

        if (query.status) {
            const status = LeadStatus.fromName(query.status);
            filteredLeads = filteredLeads.filter((lead) => lead.status.equals(status));
        }

        if (query.tags) {
            filteredLeads = filteredLeads.filter((lead) =>
                query.tags.some((tag) => lead.tags.includes(tag))
            );
        }

        return filteredLeads;
    }
}
