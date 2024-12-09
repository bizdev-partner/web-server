import { SalesPackage } from "./SalesPackage";
import { GlobalIdentifier, UniqueIdentifier } from "@vannatta-software/ts-domain";

export interface ISalesPackageRepository {
    /**
     * Stores a new or updated sales package.
     * @param salesPackage The sales package to save.
     */
    save(salesPackage: SalesPackage): Promise<void>;

    /**
     * Retrieves a sales package by its unique identifier.
     * @param packageId The unique identifier of the sales package.
     * @returns The sales package or undefined if not found.
     */
    findById(packageId: GlobalIdentifier): Promise<SalesPackage | undefined>;

    /**
     * Retrieves all sales packages associated with a specific workflow.
     * @param workflowId The unique identifier of the workflow.
     * @returns An array of sales packages linked to the workflow.
     */
    findByWorkflowId(workflowId: UniqueIdentifier): Promise<SalesPackage[]>;

    /**
     * Retrieves all sales packages, optionally filtered by criteria.
     * @param filter Optional filter criteria to narrow the results.
     * @returns An array of sales packages matching the filter criteria.
     */
    getAll(filter?: Record<string, any>): Promise<SalesPackage[]>;

    /**
     * Deletes a sales package from the repository.
     * @param packageId The unique identifier of the sales package to delete.
     */
    delete(packageId: GlobalIdentifier): Promise<void>;
}
