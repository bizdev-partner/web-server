import { Model, Validation } from "@vannatta-software/ts-domain";
import { Field, FieldType } from "@vannatta-software/ts-core";
import { Name } from "@domain/common/Name";
import { ContactInfo } from "@domain/common/ContactInfo";
import { Client } from "../Client";
import { Note } from "@domain/common/Note";

export class CreateClientCommand extends Model {
    @Field("Name", FieldType.Text)
    @Validation({ required: true })
    public name: Name;

    @Field("Contact Info", FieldType.TextArea)
    @Validation({ required: true })
    public contactInfo: ContactInfo;

    @Field("Notes", FieldType.TextArea)
    public notes?: Note[];

    @Field("Tags", FieldType.TextArea)
    public tags?: string[];
}

export class UpdateClientCommand extends Model {
    @Field("Client ID", FieldType.Text)
    @Validation({ required: true })
    public clientId: string;

    @Field("Updated Fields", FieldType.TextArea)
    @Validation({ required: true })
    public updatedFields: Partial<Client>;
}

export class AssociateSalesPackageCommand extends Model {
    @Field("Client ID", FieldType.Text)
    @Validation({ required: true })
    public clientId: string;

    @Field("Sales Package ID", FieldType.Text)
    @Validation({ required: true })
    public salesPackageId: string;
}

export class AssociateCampaignCommand extends Model {
    @Field("Client ID", FieldType.Text)
    @Validation({ required: true })
    public clientId: string;

    @Field("Campaign ID", FieldType.Text)
    @Validation({ required: true })
    public campaignId: string;
}

export class DeleteClientCommand extends Model {
    @Field("Client ID", FieldType.Text)
    @Validation({ required: true })
    public clientId: string;

    constructor(clientId: string) {
        super();
        this.clientId = clientId;
    }
}

export type ICreateClientCommand = Pick<CreateClientCommand, "name" | "contactInfo" | "notes" | "tags">;

export type IUpdateClientCommand = Pick<UpdateClientCommand, "clientId" | "updatedFields">;

export type IAssociateSalesPackageCommand = Pick<AssociateSalesPackageCommand, "clientId" | "salesPackageId">;

export type IAssociateCampaignCommand = Pick<AssociateCampaignCommand, "clientId" | "campaignId">;

export type IDeleteClientCommand = Pick<DeleteClientCommand, "clientId">;