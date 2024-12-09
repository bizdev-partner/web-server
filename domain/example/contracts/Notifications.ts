import { ExampleMetadata } from "../Metadata";

export class ExampleCreatedNotification {
    constructor(public id: string) {}
}

export class ExampleDeletedNotification {
    constructor(public id: string) {}
}

export class ExampleMetadataNotification {
    constructor(public id: string, public metadata: ExampleMetadata) {}
}