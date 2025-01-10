import { EnumUtils } from "@domain/common/EnumUtils";
import { ArrayUtils, Schema } from "@vannatta-software/ts-core";
import { AggregateRoot, UniqueIdentifier } from "@vannatta-software/ts-domain";
import { ContactInfo } from "../common/ContactInfo";
import { Name } from "../common/Name";
import { Note } from "../common/Note";
import { LeadCreated, LeadDeleted, LeadStatusUpdated, LeadUpdated } from "./contracts";
import { LeadStatus, LeadStatusMoment } from "./LeadStatus";

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

    @Schema({ type: Array, items: String, embedded: true })
    public tags?: string[];

    @Schema({ type: Array, items: String, embedded: true })
    public groups: string[];

    @Schema({ type: Array, items: LeadStatusMoment, embedded: true })
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
