import { Injectable } from '@nestjs/common';
import { LeadRepository } from '../repositories/lead.repository';
import { Lead, LeadStatus, Name, ContactInfo } from '@domain/lead';
import * as Contracts from '@domain/lead/contracts';

@Injectable()
export class LeadService {
    constructor(private readonly leads: LeadRepository) {}

    async createLead(command: Contracts.CreateLeadCommand): Promise<Lead> {
        const lead = new Lead({
            name: new Name({ firstName: command.firstName, lastName: command.lastName }),
            contactInfo: new ContactInfo({ email: command.email, phone: command.phone }),
            status: LeadStatus.Known,
            notes: command.notes ?? [],
            tags: command.tags ?? [],
        });

        await this.leads.insert(lead);
        return lead;
    }

    async updateLead(command: Contracts.UpdateLeadCommand): Promise<Lead> {
        const lead = await this.leads.findById(command.leadId);
        if (!lead) throw new Error(`Lead with ID ${command.leadId} not found.`);

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

        if (command.notes) lead.notes = command.notes;
        if (command.tags) lead.tags = command.tags;
        if (command.status) lead.status = LeadStatus.fromName(command.status);

        await this.leads.update(lead);
        return lead;
    }

    async updateLeadStatus(command: Contracts.UpdateLeadStatusCommand): Promise<Lead> {
        const lead = await this.leads.findById(command.leadId);
        if (!lead) throw new Error(`Lead with ID ${command.leadId} not found.`);

        lead.status = LeadStatus.fromName(command.newStatus);
        await this.leads.update(lead);
        return lead;
    }

    async getLeadDetails(query: Contracts.GetLeadDetailsQuery): Promise<Lead> {
        const lead = await this.leads.findById(query.leadId);
        if (!lead) throw new Error(`Lead with ID ${query.leadId} not found.`);
        return lead;
    }

    async listLeads(query: Contracts.ListLeadsQuery): Promise<Lead[]> {
        let leads = await this.leads.findAll();
        if (query.status) leads = leads.filter((lead) => lead.status.equals(LeadStatus.fromName(query.status)));
        if (query.tags) leads = leads.filter((lead) => query.tags.some((tag) => lead.tags.includes(tag)));
        return leads;
    }

    async deleteLead(leadId: string): Promise<void> {
        var lead = await this.leads.findById(leadId);
        await this.leads.delete(lead);
    }
}
