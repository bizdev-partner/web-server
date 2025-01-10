import { Campaign } from "./Campaign";
import { GlobalIdentifier, Repository, UniqueIdentifier } from "@vannatta-software/ts-domain";

export interface ICampaignRepository extends Repository<Campaign> {
    /**
     * Stores a new or updated campaign.
     * @param campaign The campaign to save.
     * @returns A promise resolving when the campaign is saved.
     */
    save(campaign: Campaign): Promise<void>;

    /**
     * Retrieves a campaign by its unique identifier.
     * @param campaignId The unique identifier of the campaign.
     * @returns A promise resolving with the found campaign or undefined if not found.
     */
    findById(campaignId: GlobalIdentifier): Promise<Campaign | undefined>;

    /**
     * Retrieves all campaigns with the specified status.
     * @param status The status of the campaigns to retrieve.
     * @returns A promise resolving with an array of campaigns with the specified status.
     */
    findByStatus(status: string): Promise<Campaign[]>;

    /**
     * Retrieves all campaigns associated with a specific workflow.
     * @param workflowId The unique identifier of the workflow.
     * @returns A promise resolving with an array of campaigns associated with the workflow.
     */
    findByWorkflowId(workflowId: UniqueIdentifier): Promise<Campaign[]>;

    /**
     * Removes a campaign from the repository.
     * @param campaignId The unique identifier of the campaign to remove.
     * @returns A promise resolving when the campaign is deleted.
     */
    delete(campaignId: GlobalIdentifier): Promise<void>;
}
