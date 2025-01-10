import { Lead } from "./Lead";
import { LeadStatus } from "./LeadStatus";
import { GlobalIdentifier } from "@vannatta-software/ts-domain";

export interface ILeadRepository {
    /**
     * Stores a new or updated lead.
     * @param lead The lead to save.
     */
    save(lead: Lead): Promise<void>;

    /**
     * Retrieves a lead by its unique identifier.
     * @param leadId The unique identifier of the lead.
     * @returns The lead or undefined if not found.
     */
    findById(leadId: GlobalIdentifier): Promise<Lead | undefined>;

    /**
     * Retrieves all leads with a specific status.
     * @param status The status of the leads to retrieve.
     * @returns An array of leads with the given status.
     */
    findByStatus(status: LeadStatus): Promise<Lead[]>;

    /**
     * Deletes a lead from the repository.
     * @param leadId The unique identifier of the lead to delete.
     */
    delete(leadId: GlobalIdentifier): Promise<void>;
}
