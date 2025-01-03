import { ICampaignRepository } from "@domain/campaign/ICampaignRepository";
import { Campaign } from "@domain/campaign/Campaign";
import { GlobalIdentifier, UniqueIdentifier } from "@vannatta-software/ts-domain";
import { ICampaignService } from "@domain/campaign/ICampaignService";
import * as Contracts from "@domain/campaign/contracts";
import { CampaignStatus } from "@domain/campaign/CampaignStatus";
import { Activity, ActivityStatus } from "@domain/activity";

export class MockCampaignRepository implements ICampaignRepository {
    private campaigns: Map<string, Campaign> = new Map();

    async save(campaign: Campaign): Promise<void> {
        this.campaigns.set(campaign.id.value, campaign);
    }

    async findById(campaignId: GlobalIdentifier): Promise<Campaign | undefined> {
        return this.campaigns.get(campaignId.value);
    }

    async findByStatus(status: string): Promise<Campaign[]> {
        return Array.from(this.campaigns.values()).filter(
            (campaign) => campaign.status.name === status
        );
    }

    async findByWorkflowId(workflowId: UniqueIdentifier): Promise<Campaign[]> {
        return Array.from(this.campaigns.values()).filter(
            (campaign) => campaign.workflowId.value === workflowId.value
        );
    }

    async delete(campaignId: GlobalIdentifier): Promise<void> {
        this.campaigns.delete(campaignId.value);
    }
}

export class MockCampaignService implements ICampaignService {
    private repository: ICampaignRepository;

    constructor(repository: ICampaignRepository = new MockCampaignRepository()) {
        this.repository = repository;
    }

    async updateCampaign(command: Contracts.IUpdateCampaignCommand): Promise<Campaign> {        
        return await this.repository.findById(new GlobalIdentifier(command.campaignId));
    }

    async launchCampaign(command: Contracts.ILaunchCampaignCommand): Promise<Campaign> {
        const campaign = await this.repository.findById(new GlobalIdentifier(command.campaignId));
        if (!campaign) {
            throw new Error(`Campaign with ID ${command.campaignId} not found.`);
        }

        campaign.status = CampaignStatus.Active;
        await this.repository.save(campaign);

        return campaign;
    }

    async pauseCampaign(command: Contracts.IPauseCampaignCommand): Promise<Campaign> {
        const campaign = await this.repository.findById(new GlobalIdentifier(command.campaignId));
        if (!campaign) {
            throw new Error(`Campaign with ID ${command.campaignId} not found.`);
        }

        campaign.status = CampaignStatus.Paused;
        await this.repository.save(campaign);

        return campaign;
    }

    async resumeCampaign(command: Contracts.IResumeCampaignCommand): Promise<Campaign> {
        const campaign = await this.repository.findById(new GlobalIdentifier(command.campaignId));
        if (!campaign) {
            throw new Error(`Campaign with ID ${command.campaignId} not found.`);
        }

        campaign.status = CampaignStatus.Active;
        await this.repository.save(campaign);

        return campaign;
    }

    async completeCampaign(command: Contracts.ICompleteCampaignCommand): Promise<Campaign> {
        const campaign = await this.repository.findById(new GlobalIdentifier(command.campaignId));
        if (!campaign) {
            throw new Error(`Campaign with ID ${command.campaignId} not found.`);
        }

        campaign.status = CampaignStatus.Completed;
        campaign.metrics.successfulOutcomes = command.successfulOutcomes;
        campaign.metrics.failedOutcomes = command.failedOutcomes;

        await this.repository.save(campaign);

        return campaign;
    }

    async trackActivityCompletion(activityId: GlobalIdentifier): Promise<Activity> {
        const campaigns = await this.repository.findByStatus(CampaignStatus.Active.name);
        const campaignActivity = campaigns
            .flatMap((campaign) => campaign.activities)
            .find((activity) => activity.id.equals(activityId));
    
        if (!campaignActivity) {
            throw new Error(`CampaignActivity with ID ${activityId.value} not found.`);
        }
    
        campaignActivity.status = ActivityStatus.Complete;
    
        // Save the updated campaign containing the modified activity
        const parentCampaign = campaigns.find((campaign) =>
            campaign.activities.some((activity) => activity.id.equals(activityId))
        );
        if (parentCampaign) {
            await this.repository.save(parentCampaign);
        }
    
        return campaignActivity;
    }    

    async getCampaignDetails(query: Contracts.IGetCampaignDetailsQuery): Promise<Campaign> {
        const campaign = await this.repository.findById(new GlobalIdentifier(query.campaignId));
        if (!campaign) {
            throw new Error(`Campaign with ID ${query.campaignId} not found.`);
        }

        return campaign;
    }

    async listCampaigns(query: Contracts.IListCampaignsQuery): Promise<Campaign[]> {
        return this.repository.findByStatus(query.status || "");
    }
}