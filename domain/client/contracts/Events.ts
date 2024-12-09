import { IDomainEvent } from "@vannatta-software/ts-domain";

export class ClientCreated implements IDomainEvent {
    dateTimeOccurred: Date = new Date();

    constructor(
        public readonly clientId: string,
        public readonly name: string,
        public readonly status: string
    ) {}
}

export class ClientUpdated implements IDomainEvent {
    dateTimeOccurred: Date = new Date();

    constructor(
        public readonly clientId: string,
        public readonly updatedFields: Partial<any>
    ) {}
}

export class SalesPackageAssociated implements IDomainEvent {
    dateTimeOccurred: Date = new Date();

    constructor(
        public readonly clientId: string,
        public readonly salesPackageId: string
    ) {}
}

export class CampaignAssociated implements IDomainEvent {
    dateTimeOccurred: Date = new Date();

    constructor(
        public readonly clientId: string,
        public readonly campaignId: string
    ) {}
}

export class ClientDeleted implements IDomainEvent {
    dateTimeOccurred: Date = new Date();

    constructor(public readonly clientId: string) {}
}
