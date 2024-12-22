import { AggregateRoot, GlobalIdentifier, UniqueIdentifier } from "@vannatta-software/ts-domain";
import { Schema } from "@vannatta-software/ts-core";
import { Pricing } from "./Pricing";
import { Validity } from "./Validity";
import * as Contracts from "./contracts";
import { Note } from "@domain/common/Note";

export class SalesPackage extends AggregateRoot {
    @Schema({ type: String })
    public name: string;

    @Schema({ type: UniqueIdentifier, embedded: true  })
    public workflowId: UniqueIdentifier;

    @Schema({ type: Array, items: UniqueIdentifier, embedded: true })
    public leads: UniqueIdentifier[];

    @Schema({ type: Pricing, embedded: true })
    public pricing: Pricing;

    @Schema({ type: Validity, embedded: true })
    public validity: Validity;

    @Schema({ type: Array, items: Note, embedded: true, optional: true })
    public feedback: Note[];

    @Schema({ type: UniqueIdentifier, embedded: true  })
    public childPackages: UniqueIdentifier[]

    constructor(salesPackage?: Partial<SalesPackage>) {
        super(salesPackage);
        this.name = salesPackage?.name ?? "";
        this.workflowId = salesPackage?.workflowId ?? new UniqueIdentifier();
        this.leads = salesPackage?.leads ?? [];
        this.pricing = salesPackage?.pricing ?? new Pricing();
        this.validity = salesPackage?.validity ?? new Validity();
        this.feedback = salesPackage?.feedback ?? [];
    }

    public create(): void {
        this.addDomainEvent(new Contracts.PackageCreated(this.id.value, this.name, this.workflowId, this.leads.length));
    }

    public update(fields: Partial<SalesPackage>): void {
        Object.assign(this, fields);
        this.addDomainEvent(new Contracts.PackageUpdated(this.id.value, fields));
    }

    public addFeedback(note: Note): void {
        this.feedback.push(note);
        this.addDomainEvent(new Contracts.FeedbackAdded(this.id.value, note));
    }

    public delete(): void {
        this.addDomainEvent(new Contracts.PackageDeleted(this.id.value, this.name));
    }
}
