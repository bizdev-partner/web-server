import { GlobalIdentifier } from "@vannatta-software/ts-domain";
import { Campaign } from "./Campaign";
import * as Contracts from "./contracts";
import { Activity } from "@domain/activity";

export interface ICampaignService {
    /**
     * Validates and launches a new campaign.
     * @param command The command containing details to launch a campaign.
     * @returns The launched campaign.
     */
    updateCampaign(command: Contracts.IUpdateCampaignCommand): Promise<Campaign>;
    /**
     * Validates and launches a new campaign.
     * @param command The command containing details to launch a campaign.
     * @returns The launched campaign.
     */
    launchCampaign(command: Contracts.ILaunchCampaignCommand): Promise<Campaign>;

    /**
     * Pauses an active campaign.
     * @param command The command containing details to pause a campaign.
     * @returns The paused campaign.
     */
    pauseCampaign(command: Contracts.IPauseCampaignCommand): Promise<Campaign>;

    /**
     * Resumes a paused campaign.
     * @param command The command containing details to resume a campaign.
     * @returns The resumed campaign.
     */
    resumeCampaign(command: Contracts.IResumeCampaignCommand): Promise<Campaign>;

    /**
     * Completes a campaign and calculates metrics.
     * @param command The command containing details to complete a campaign.
     * @returns The completed campaign.
     */
    completeCampaign(command: Contracts.ICompleteCampaignCommand): Promise<Campaign>;

    /**
     * Tracks the completion of campaign activities and updates metrics.
     * @param activityId The unique identifier of the completed campaign activity.
     * @returns The updated campaign activity.
     */
    trackActivityCompletion(activityId: GlobalIdentifier): Promise<Activity>;

    /**
     * Retrieves detailed information about a campaign.
     * @param query The query containing the campaign ID to retrieve details for.
     * @returns The detailed campaign.
     */
    getCampaignDetails(query: Contracts.IGetCampaignDetailsQuery): Promise<Campaign>;

    /**
     * Retrieves a list of campaigns, optionally filtered by status.
     * @param query The query containing the optional status filter.
     * @returns A list of campaigns matching the filter.
     */
    listCampaigns(query: Contracts.IListCampaignsQuery): Promise<Campaign[]>;
}
