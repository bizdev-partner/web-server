import { Model, Validation } from "@vannatta-software/ts-domain";
import { FieldType, Field } from "@vannatta-software/ts-core";
import { Note } from "@domain/common/Note";

export class CreateLeadCommand extends Model {
    @Field("First Name", FieldType.Text)
    @Validation({ required: true })
    public firstName: string;

    @Field("Last Name", FieldType.Text)
    @Validation({ required: true })
    public lastName: string;

    @Field("Email", FieldType.Text)
    public email?: string;

    @Field("Phone", FieldType.Text)
    public phone?: string;

    @Field("Company", FieldType.Text)
    public company?: string;

    @Field("Address", FieldType.Text)
    public address?: string;

    @Field("Notes", FieldType.TextArea)
    public notes?: Note[];

    @Field("Tags", FieldType.Text)
    public tags?: string[];

    @Field("Groups", FieldType.Text)
    public groups?: string[];
}

export class UpdateLeadCommand extends Model {
    @Field("Lead ID", FieldType.Text)
    @Validation({ required: true })
    public leadId: string;

    @Field("Updated First Name", FieldType.Text)
    public firstName?: string;

    @Field("Updated Last Name", FieldType.Text)
    public lastName?: string;

    @Field("Updated Email", FieldType.Text)
    public email?: string;

    @Field("Updated Phone", FieldType.Text)
    public phone?: string;

    @Field("Company", FieldType.Text)
    public company?: string;

    @Field("Address", FieldType.Text)
    public address?: string;

    @Field("Updated Notes", FieldType.TextArea)
    public notes?: Note[];

    @Field("Updated Tags", FieldType.Text)
    public tags?: string[];

    @Field("Updated Status", FieldType.Text)
    public status?: string;
}

export class UpdateLeadStatusCommand extends Model {
    @Field("Lead ID", FieldType.Text)
    @Validation({ required: true })
    public leadId: string;

    @Field("New Status", FieldType.Text)
    @Validation({ required: true })
    public newStatus: string;
}

export class UpdateLeadGroupsCommand extends Model {
    @Field("Lead ID", FieldType.Text)
    @Validation({ required: true })
    public leadId: string;

    @Field("New Groups", FieldType.Text)
    @Validation({ required: true })
    public groups: string[];
}

export class AddLeadGroupCommand extends Model {
    @Field("Lead ID", FieldType.Text)
    @Validation({ required: true })
    public leadId: string;

    @Field("Group", FieldType.Text)
    @Validation({ required: true })
    public group: string;

}

export type ICreateLeadCommand = Pick<
    CreateLeadCommand,
    "firstName" | "lastName" | "email" | "phone" | "notes" | "tags"| "company" | "address"
>;

export type IUpdateLeadCommand = Pick<
    UpdateLeadCommand,
    "leadId" | "firstName" | "lastName" | "email" | "phone" | "notes" | "tags" | "status"| "company" | "address"
>;

export type IUpdateLeadStatusCommand = Pick<
    UpdateLeadStatusCommand,
    "leadId" | "newStatus"
>;

export type IUpdateLeadGroupsCommand = Pick<
    UpdateLeadGroupsCommand,
    "leadId" | "groups"
>;
