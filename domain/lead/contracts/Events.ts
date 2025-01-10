import { GlobalIdentifier, IDomainEvent } from "@vannatta-software/ts-domain";
import { Name } from "../../common/Name";
import { LeadStatus } from "../LeadStatus";
import { UniqueIdentifier } from "@vannatta-software/ts-domain";

/**
 * Event triggered when a lead is created.
 */
export class LeadCreated implements IDomainEvent {
    public dateTimeOccurred: Date = new Date();

    constructor(
        public readonly leadId: GlobalIdentifier,
        public readonly name: Name,
        public readonly status: LeadStatus
    ) {}
}

/**
 * Event triggered when a lead is updated.
 */
export class LeadUpdated implements IDomainEvent {
    public dateTimeOccurred: Date = new Date();

    constructor(
        public readonly leadId: GlobalIdentifier,
        public readonly updatedFields: Partial<any>
    ) {}
}

/**
 * Event triggered when a lead's status is updated.
 */
export class LeadStatusUpdated implements IDomainEvent {
    public dateTimeOccurred: Date = new Date();

    constructor(
        public readonly leadId: GlobalIdentifier,
        public readonly oldStatus: LeadStatus,
        public readonly newStatus: LeadStatus
    ) {}
}

/**
 * Event triggered when a lead is deleted.
 */
export class LeadDeleted implements IDomainEvent {
    public dateTimeOccurred: Date = new Date();

    constructor(
        public readonly leadId: GlobalIdentifier,
        public readonly name: Name
    ) {}
}
