import { Field, FieldType } from "@vannatta-software/ts-core";
import { Model, Validation } from "@vannatta-software/ts-domain";

export class GetPackageDetailsQuery extends Model {
    @Field("Package ID", FieldType.Text)
    @Validation({ required: true })
    public packageId: string;

    constructor(packageId: string) {
        super();
        this.packageId = packageId;
    }
}

export class ListPackagesQuery extends Model {
    @Field("Filter", FieldType.Text)
    public filter?: Record<string, any>;

    constructor(filter?: Record<string, any>) {
        super();
        this.filter = filter;
    }
}

export type IGetPackageDetailsQuery = Pick<GetPackageDetailsQuery, "packageId">;

export type IListPackagesQuery = Pick<ListPackagesQuery, "filter">;