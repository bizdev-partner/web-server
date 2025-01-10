import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LeadRepository } from '../repositories/lead.repository';
import { Lead, LeadStatus, Name, ContactInfo } from '@domain/lead';
import * as Contracts from '@domain/lead/contracts';
import { Note } from '@domain/common';
import { ApiException } from 'src/modules/app.module';

@Injectable()
export class LeadService {
    constructor(private readonly leads: LeadRepository) {}

    async createLead(command: Contracts.ICreateLeadCommand): Promise<Lead> {
        const lead = new Lead({
            name: new Name({ firstName: command.firstName, lastName: command.lastName }),
            contactInfo: new ContactInfo({ email: command.email, phone: command.phone, company: command.company, address: command.address }),
            status: LeadStatus.Known,
            notes: command.notes ?? [],
            tags: command.tags ?? [],
        });

        await this.leads.insert(lead);
        return lead;
    }

    async updateLead(command: Contracts.IUpdateLeadCommand): Promise<Lead> {
        const lead = await this.leads.findById(command.leadId);
        if (!lead) throw new Error(`Lead with ID ${command.leadId} not found.`);

        lead.updateDetails({
            name: new Name({ firstName: command.firstName, lastName: command.lastName }),
            contactInfo: new ContactInfo({ email: command.email, phone: command.phone, company: command.company, address: command.address }),
            notes: command.notes?.map(n => new Note(n)),
            tags: command.tags,
            status: command.status ? LeadStatus.fromName(command.status) : lead.status, 
        });

        // const conflicts = await this.leads.findByEmail(lead.contactInfo.email);

        // if (conflicts.length > 0 && conflicts[0].id.value != lead.id.value) {
        //     throw new ApiException(`Lead alread exists with email ${command.email}`, {
        //         email: [ "error" ]
        //     });
        // }

        await this.leads.update(lead);
        return lead;
    }

    async setGroups(command: Contracts.IUpdateLeadGroupsCommand): Promise<Lead> {
        const lead = await this.leads.findById(command.leadId);
        if (!lead) throw new Error(`Lead with ID ${command.leadId} not found.`);

        command.groups.forEach(group => lead.addGroup(group))

        await this.leads.update(lead);
        return lead;
    }

    async updateLeadStatus(command: Contracts.IUpdateLeadStatusCommand): Promise<Lead> {
        const lead = await this.leads.findById(command.leadId);
        if (!lead) throw new Error(`Lead with ID ${command.leadId} not found.`);

        const status = LeadStatus.fromName(command.newStatus);

        lead.updateStatus(status);

        await this.leads.update(lead);
        return lead;
    }

    async getLeadDetails(query: Contracts.IGetLeadDetailsQuery): Promise<Lead> {
        const lead = await this.leads.findById(query.leadId);
        if (!lead) throw new Error(`Lead with ID ${query.leadId} not found.`);
        return lead;
    }

    async listLeads(query: Contracts.IListLeadsQuery): Promise<Lead[]> {
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
