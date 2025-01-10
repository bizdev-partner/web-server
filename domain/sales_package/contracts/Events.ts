import { Note } from "@domain/common/Note";
import { IDomainEvent } from "@vannatta-software/ts-domain";
import { UniqueIdentifier } from "@vannatta-software/ts-domain";

export class PackageCreated implements IDomainEvent {
    public readonly dateTimeOccurred: Date = new Date();

    constructor(
        public readonly packageId: string,
        public readonly name: string,
        public readonly workflowId: UniqueIdentifier,
        public readonly leadsCount: number
    ) {}
}

export class PackageUpdated implements IDomainEvent {
    public readonly dateTimeOccurred: Date = new Date();

    constructor(
        public readonly packageId: string,
        public readonly updatedFields: Partial<any>
    ) {}
}

export class FeedbackAdded implements IDomainEvent {
    public readonly dateTimeOccurred: Date = new Date();

    constructor(
        public readonly packageId: string,
        public readonly content: Note
    ) {}
}

export class PackageDeleted implements IDomainEvent {
    public readonly dateTimeOccurred: Date = new Date();

    constructor(
        public readonly packageId: string,
        public readonly name: string
    ) {}
}

