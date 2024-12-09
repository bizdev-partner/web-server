import { SalesPackage } from "./SalesPackage";
import * as Contracts from "./contracts";
import { Note } from "@domain/common/Note";

export interface ISalesPackageService {
    /**
     * Validates and creates a new sales package.
     * @param command The command containing the details to create a sales package.
     * @returns The created sales package.
     */
    createPackage(command: Contracts.ICreatePackageCommand): Promise<SalesPackage>;

    /**
     * Updates an existing sales package's details and propagates changes as needed.
     * @param command The command containing the package ID and updated fields.
     * @returns The updated sales package.
     */
    updatePackage(command: Contracts.IUpdatePackageCommand): Promise<SalesPackage>;

    /**
     * Adds feedback to a specific sales package.
     * @param command The command containing the package ID and feedback note.
     * @returns The updated feedback list.
     */
    addFeedback(command: Contracts.IAddFeedbackCommand): Promise<Note[]>;

    /**
     * Deletes a sales package.
     * @param command The command containing the package ID to delete.
     */
    deletePackage(command: Contracts.IDeletePackageCommand): Promise<void>;

    /**
     * Retrieves detailed information about a specific sales package.
     * @param query The query containing the package ID.
     * @returns The detailed sales package.
     */
    getPackageDetails(query: Contracts.IGetPackageDetailsQuery): Promise<SalesPackage>;

    /**
     * Lists sales packages based on the provided filter.
     * @param query The query containing the filter criteria.
     * @returns An array of sales packages matching the filter.
     */
    listPackages(query: Contracts.IListPackagesQuery): Promise<SalesPackage[]>;
}
