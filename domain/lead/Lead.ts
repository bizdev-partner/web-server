import { AggregateRoot, UniqueIdentifier } from "@vannatta-software/ts-domain";
import { LeadStatusMoment, LeadStatus } from "./LeadStatus";
import { ContactInfo } from "../common/ContactInfo";
import { Name } from "../common/Name";
import { Note } from "../common/Note";
import { ArrayUtils, Schema } from "@vannatta-software/ts-core";
import { LeadCreated, LeadUpdated, LeadStatusUpdated, LeadDeleted } from "./contracts";
import { EnumUtils } from "@domain/common/EnumUtils";

export class Lead extends AggregateRoot {
    @Schema({ type: Name, embedded: true })
    public name: Name;

    @Schema({ type: UniqueIdentifier, embedded: true })
    public clientId: UniqueIdentifier;

    @Schema({ type: ContactInfo, embedded: true })
    public contactInfo: ContactInfo;

    @Schema({ type: LeadStatus, enum: EnumUtils.names(LeadStatus) })
    public status: LeadStatus;

    @Schema({ type: Array, items: Note, embedded: true })
    public notes: Note[];

    @Schema({ type: Array, items: String, optional: true })
    public tags?: string[];

    @Schema({ type: Array, items: String, optional: true })
    public groups: string[];

    @Schema({ type: Array, items: String, embedded: true })
    public statusHistory: LeadStatusMoment[];

    constructor(props: Partial<Lead>) {
        super(props);
        this.name = props.name!;
        this.contactInfo = props.contactInfo!;
        this.status = props.status || LeadStatus.Known;
        this.notes = props.notes || [];
        this.tags = props.tags || [];
        this.groups = props.groups || [];
        this.statusHistory = props.statusHistory || [];
        this.addDomainEvent(new LeadCreated(this.id, this.name, this.status));
    }

    public create(): void {
        this.addDomainEvent(new LeadCreated(this.id, this.name, this.status));
    }

    public delete(): void {
        this.addDomainEvent(new LeadDeleted(this.id, this.name));
    }

    public addGroup(group: string): void {
        this.groups.push(group);
        this.groups = ArrayUtils.unique(this.groups);
        
    }

    public updateStatus(newStatus: LeadStatus): void {
        const oldStatus = this.status;
        this.status = newStatus;
        this.statusHistory.push(new LeadStatusMoment(newStatus));
        this.addDomainEvent(new LeadStatusUpdated(this.id, oldStatus, newStatus));
    }

    public updateDetails(updatedFields: Partial<Lead>): void {
        Object.assign(this, updatedFields);
        this.addDomainEvent(new LeadUpdated(this.id, updatedFields));
    }
}
