import { Model, Validation } from "@vannatta-software/ts-domain";
import { FieldType, Field } from "@vannatta-software/ts-core";
import { ExampleType } from "../Type";

export class CreateExampleCommand extends Model {
    @Field("Name", FieldType.Text)
    @Validation({ required: true })
    public name: string;

    @Field("Description", FieldType.TextArea)
    @Validation({ required: true })
    public description: string;
    
    @Field("Version", FieldType.Number)
    @Validation({ required: true })
    public version: number;
    
    @Field("Type", FieldType.Select, [ ExampleType.Default, ExampleType.Other ])
    public type: string;
}

export class DeleteExampleCommand extends Model {
    public id: string
}

export class UpdateExampleCommand extends Model {
    public id: string;
    public name: string;
    public metadata: {
        description: string,
        version: number,
    };
    public type: number;
}

export class UpdateVersionCommand extends Model {
    public id: string;
    public newVersion: number;
}