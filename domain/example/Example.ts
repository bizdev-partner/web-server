import { AggregateRoot, UniqueIdentifier } from "@vannatta-software/ts-domain";
import { Schema, View, ViewType } from "@vannatta-software/ts-core";
import { ExampleMetadata } from "./Metadata";
import { ExampleType } from "./Type";
import { ExampleCreatedEvent, ExampleDeletedEvent, ExampleMetadataUpdatedEvent, ExampleTypeChangedEvent } from "./contracts";
import { EnumUtils } from "@domain/common/EnumUtils";

export class Example extends AggregateRoot {
    @Schema({ type: UniqueIdentifier, embedded: true  })
    @View("Name", ViewType.Text)
    public name: UniqueIdentifier;

    @Schema({ type: ExampleMetadata, embedded: true  })
    @View("Metadata", ViewType.Embedded)
    public metadata: ExampleMetadata;

    @Schema({ type: ExampleType, enum: EnumUtils.names(ExampleType) })
    @View("Type", ViewType.Enumeration)
    public type: ExampleType;

    constructor(example?: Partial<Example>) {
        super(example);
        this.name = new UniqueIdentifier(example?.name);
        this.type = new ExampleType(example?.type);
        this.metadata = new ExampleMetadata(example?.metadata);
    }

    create() {
        this.addDomainEvent(new ExampleCreatedEvent(this.id.value));
    }

    delete(): void {
        this.addDomainEvent(new ExampleDeletedEvent(this.id.value));
    }

    changeType(newType: ExampleType): void {
        this.type = newType;
        this.addDomainEvent(new ExampleTypeChangedEvent(this.id.value, newType));
    }

    changeMetadata(newMetadata: Partial<ExampleMetadata>): void {
        this.metadata.update(newMetadata);
        this.addDomainEvent(new ExampleMetadataUpdatedEvent(this.id.value, this.metadata));
    }

    toString() {
        return this.name.toString();
    }
}