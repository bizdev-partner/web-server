import { EnumUtils } from "@domain/common/EnumUtils";
import { Schema } from "@vannatta-software/ts-core";
import { AggregateRoot, UniqueIdentifier } from "@vannatta-software/ts-domain";
import { ContactInfo } from "../common/ContactInfo";
import { Name } from "../common/Name";
import { Note } from "../common/Note";
import { ClientStatus } from "./ClientStatus";
import * as Contracts from "./contracts";

export class Client extends AggregateRoot {
    @Schema({ type: Name, embedded: true })
    public name: Name;

    @Schema({ type: ContactInfo, embedded: true })
    public contactInfo: ContactInfo;

    @Schema({ type: ClientStatus, enum: EnumUtils.names(ClientStatus) })
    public status: ClientStatus;

    @Schema({ type: Array, items: Note, embedded: true, optional: true })
    public notes?: Note[];

    @Schema({ type: Array, items: UniqueIdentifier, embedded: true })
    public salesPackages?: UniqueIdentifier[];

    @Schema({ type: Array, items: UniqueIdentifier, embedded: true })
    public activeCampaigns?: UniqueIdentifier[];

    @Schema({ type: Array, items: String, embedded: true })
    public tags?: string[];

    constructor(client?: Partial<Client>) {
        super(client);
        this.name = client?.name || new Name({});
        this.contactInfo = client?.contactInfo || new ContactInfo({});
        this.status = client?.status || ClientStatus.Active;
        this.notes = client?.notes || [];
        this.salesPackages = client?.salesPackages || [];
        this.activeCampaigns = client?.activeCampaigns || [];
        this.tags = client?.tags || [];
    }

    public create(): void {
        this.addDomainEvent(new Contracts.ClientCreated(this.id.value, this.name.toString(), this.status.name));
    }

    public update(updatedFields: Partial<Client>): void {
        const status = this.status;

        Object.assign(this, updatedFields);

        this.status = updatedFields.status ? EnumUtils.fromName(ClientStatus, updatedFields.status?.name): status,
        this.addDomainEvent(new Contracts.ClientUpdated(this.id.value, updatedFields));
    }

    public associateSalesPackage(salesPackageId: UniqueIdentifier): void {
        this.salesPackages?.push(salesPackageId);
        this.addDomainEvent(new Contracts.SalesPackageAssociated(this.id.value, salesPackageId.value));
    }

    public associateCampaign(campaignId: UniqueIdentifier): void {
        this.activeCampaigns?.push(campaignId);
        this.addDomainEvent(new Contracts.CampaignAssociated(this.id.value, campaignId.value));
    }

    public delete(): void {
        this.addDomainEvent(new Contracts.ClientDeleted(this.id.value));
    }
}
