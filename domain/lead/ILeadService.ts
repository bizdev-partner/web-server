import { Lead } from "./Lead";
import * as Contracts from "./contracts";

export interface ILeadService {
    /**
     * Validates and creates a new lead.
     * @param command The command containing the details to create a lead.
     * @returns The created lead.
     */
    createLead(command: Contracts.ICreateLeadCommand): Promise<Lead>;

    /**
     * Updates an existing lead's details and propagates changes as needed.
     * @param command The command containing the lead ID and updated fields.
     * @returns The updated lead.
     */
    updateLead(command: Contracts.IUpdateLeadCommand): Promise<Lead>;

    /**
     * Updates the status of a lead and triggers relevant domain events.
     * @param command The command containing the lead ID and new status.
     * @returns The updated lead.
     */
    updateLeadStatus(command: Contracts.IUpdateLeadStatusCommand): Promise<Lead>;

    /**
     * Retrieves all leads with a specific status.
     * @param status The status of the leads to retrieve.
     * @returns An array of leads with the specified status.
     */
    getLeadsByStatus(status: string): Promise<Lead[]>;

    /**
     * Retrieves detailed information about a specific lead.
     * @param query The query containing the lead ID.
     * @returns The detailed lead.
     */
    getLeadDetails(query: Contracts.IGetLeadDetailsQuery): Promise<Lead>;

    /**
     * Lists leads based on the provided filter.
     * @param query The query containing the filter criteria.
     * @returns An array of leads matching the filter.
     */
    listLeads(query: Contracts.IListLeadsQuery): Promise<Lead[]>;
}
