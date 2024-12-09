import { Injectable } from '@nestjs/common';
import { Campaign } from '@domain/campaign/Campaign';
import { ICampaignService } from '@domain/campaign/ICampaignService';
import * as Contracts from '@domain/campaign/contracts';
import { CampaignRepository } from '../repositories/campaign.repository';
import { CampaignStatus } from '@domain/campaign/CampaignStatus';
import { GlobalIdentifier } from '@vannatta-software/ts-domain';
import { CampaignActivity } from '@domain/campaign/CampaignActivity';
import { ActivityStatus } from '@domain/activity';

@Injectable()
export class CampaignService implements ICampaignService {
    constructor(private readonly campaigns: CampaignRepository) {}

    async getCampaignDetails(query: Contracts.GetCampaignDetailsQuery): Promise<Campaign> {
        const campaign = await this.campaigns.findById(query.campaignId);
        if (!campaign) throw new Error('Campaign not found');
        return campaign;
    }

    async launchCampaign(command: Contracts.LaunchCampaignCommand): Promise<Campaign> {
        const campaign = await this.campaigns.findById(command.campaignId);
        if (!campaign) throw new Error('Campaign not found');

        campaign.status = CampaignStatus.Active;
        await this.campaigns.update(campaign);
        return campaign;
    }

    async pauseCampaign(command: Contracts.PauseCampaignCommand): Promise<Campaign> {
        const campaign = await this.getCampaignDetails(new Contracts.GetCampaignDetailsQuery(command.campaignId));
        campaign.status = CampaignStatus.Paused;
        await this.campaigns.update(campaign);
        return campaign;
    }

    async resumeCampaign(command: Contracts.ResumeCampaignCommand): Promise<Campaign> {
        const campaign = await this.getCampaignDetails(new Contracts.GetCampaignDetailsQuery(command.campaignId));
        campaign.status = CampaignStatus.Active;
        await this.campaigns.update(campaign);
        return campaign;
    }

    async completeCampaign(command: Contracts.CompleteCampaignCommand): Promise<Campaign> {
        const campaign = await this.getCampaignDetails(new Contracts.GetCampaignDetailsQuery(command.campaignId));
        campaign.status = CampaignStatus.Completed;
        await this.campaigns.update(campaign);
        return campaign;
    }

    async listCampaigns(query: Contracts.ListCampaignsQuery): Promise<Campaign[]> {
        return this.campaigns.findByStatus(query.status ?? CampaignStatus.Active.name);
    }

    async trackActivityCompletion(activityId: GlobalIdentifier): Promise<CampaignActivity> {
        const campaigns = await this.campaigns.findByStatus(CampaignStatus.Active.name);
        const campaignActivity = campaigns
            .flatMap((campaign) => campaign.campaignActivities)
            .find((activity) => activity.id.equals(activityId));
    
        if (!campaignActivity) {
            throw new Error(`CampaignActivity with ID ${activityId.value} not found.`);
        }
    
        campaignActivity.status = ActivityStatus.Complete;
    
        // Save the updated campaign containing the modified activity
        const parentCampaign = campaigns.find((campaign) =>
            campaign.campaignActivities.some((activity) => activity.id.equals(activityId))
        );
        if (parentCampaign) {
            await this.campaigns.update(parentCampaign);
        }
    
        return campaignActivity;
    }    
}
