import { IDomainEvent } from "@vannatta-software/ts-domain";
import { ExampleMetadata } from "../Metadata";
import { ExampleType } from "../Type";

export class ExampleCreatedEvent implements IDomainEvent {
    dateTimeOccurred: Date = new Date();
    exampleId: string;

    constructor(exampleId: string) {
        this.exampleId = exampleId;
    }
}

export class ExampleDeletedEvent implements IDomainEvent {
    dateTimeOccurred: Date = new Date();
    exampleId: string;

    constructor(exampleId: string) {
        this.exampleId = exampleId;
    }
}

export class ExampleMetadataUpdatedEvent implements IDomainEvent {
    dateTimeOccurred: Date = new Date();
    exampleId: string;
    metadata: ExampleMetadata;

    constructor(exampleId: string, metadata: ExampleMetadata) {
        this.exampleId = exampleId;
        this.metadata = metadata;
    }
}

export class ExampleTypeChangedEvent implements IDomainEvent {
    dateTimeOccurred: Date = new Date();
    exampleId: string;
    newType: ExampleType;

    constructor(exampleId: string, newType: ExampleType) {
        this.exampleId = exampleId;
        this.newType = newType;
    }
}