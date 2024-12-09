import { Model, Validation } from "@vannatta-software/ts-domain";
import { FieldType, Field } from "@vannatta-software/ts-core";
import { Pricing } from "../Pricing";

export class CreatePackageCommand extends Model {
    @Field("Package Name", FieldType.Text)
    @Validation({ required: true })
    public name: string;

    @Field("Workflow ID", FieldType.Text)
    @Validation({ required: true })
    public workflowId: string;

    @Field("Lead IDs", FieldType.Text)
    public leads: string[];

    @Field("Base Price", FieldType.Number)
    @Validation({ required: true })
    public basePrice: number;

    @Field("Discount", FieldType.Number)
    public discount?: number;

    @Field("Start Date", FieldType.Text)
    @Validation({ required: true })
    public startDate: Date;

    @Field("End Date", FieldType.Text)
    @Validation({ required: true })
    public endDate: Date;
}

export class DeletePackageCommand extends Model {
    @Field("Package ID", FieldType.Text)
    @Validation({ required: true })
    public packageId: string;

    constructor(packageId: string) {
        super();
        this.packageId = packageId;
    }
}

export class UpdatePackageCommand extends Model {
    @Field("Package ID", FieldType.Text)
    @Validation({ required: true })
    public packageId: string;

    @Field("Updated Fields", FieldType.Text)
    @Validation({ required: true })
    public updatedFields: Partial<{
        name: string;
        workflowId: string;
        leads: string[];
        pricing: Partial<Pricing>;
        startDate: Date;
        endDate: Date;
    }>;
}

export class AddFeedbackCommand extends Model {
    @Field("Package ID", FieldType.Text)
    @Validation({ required: true })
    public packageId: string;

    @Field("Feedback Content", FieldType.TextArea)
    @Validation({ required: true })
    public content: string;

    @Field("Author ID", FieldType.Text)
    @Validation({ required: true })
    public authorId: string;

    @Field("Tags", FieldType.Text)
    public tags?: string[];
}

export type ICreatePackageCommand = Pick<
    CreatePackageCommand,
    "name" | "workflowId" | "leads" | "basePrice" | "discount" | "startDate" | "endDate"
>;

export type IDeletePackageCommand = Pick<DeletePackageCommand, "packageId">;

export type IUpdatePackageCommand = Pick<
    UpdatePackageCommand,
    "packageId" | "updatedFields"
>;

export type IAddFeedbackCommand = Pick<
    AddFeedbackCommand,
    "packageId" | "content" | "authorId" | "tags"
>;
