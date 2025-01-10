import { Injectable } from '@nestjs/common';
import { Campaign } from '@domain/campaign/Campaign';
import { ICampaignService } from '@domain/campaign/ICampaignService';
import * as Contracts from '@domain/campaign/contracts';
import { CampaignRepository } from '../repositories/campaign.repository';
import { CampaignStatus } from '@domain/campaign/CampaignStatus';
import { GlobalIdentifier, UniqueIdentifier } from '@vannatta-software/ts-domain';
import { Activity, ActivityStatus } from '@domain/activity';
import { WorkflowService } from './workflow.service';
import { ActivityService } from './activity.service';

@Injectable()
export class CampaignService implements ICampaignService {
    constructor(
        private readonly workflows: WorkflowService,
        private readonly activities: ActivityService,
        private readonly campaigns: CampaignRepository
    ) {}

    async updateCampaign(command: Contracts.IUpdateCampaignCommand): Promise<Campaign> {
        const campaign = await this.campaigns.findById(command.campaignId);
        if (!campaign) throw new Error('Campaign not found');
        
        campaign.name = command.name;
        campaign.startDate = command.startDate;
        campaign.endDate = command.endDate;
        campaign.targetLeads = command.leads.map(value => new UniqueIdentifier({ value }))
        
        this.campaigns.update(campaign);

        return campaign;        
    }

    async getCampaignDetails(query: Contracts.IGetCampaignDetailsQuery): Promise<Campaign> {
        const campaign = await this.campaigns.findById(query.campaignId);
        if (!campaign) throw new Error('Campaign not found');
        
        return campaign;
    }

    async launchCampaign(command: Contracts.ILaunchCampaignCommand): Promise<Campaign> {
        const workflow = await this.workflows.getWorkflowDetails({ workflowId: command.workflowId })
        const campaign = new Campaign({
            name: (workflow?.name ) + " Campaign",
            salesPackageId: new UniqueIdentifier({ value: command.salesPackageId }),
            workflowId: new UniqueIdentifier({ value: command.workflowId }),
            startDate: command.startDate,
            endDate: command.endDate,
            targetLeads: command.leads.map(leadId => new UniqueIdentifier({ value: leadId })),
            // activities: activities,
            status: CampaignStatus.Planned,
            notes: [],
            metrics: {
                totalLeads: command.leads.length,
                completedActivities: 0,
                successfulOutcomes: 0,
                failedOutcomes: 0
            }
        });

        await this.campaigns.insert(campaign);
        return campaign;
    }

    async pauseCampaign(command: Contracts.IPauseCampaignCommand): Promise<Campaign> {
        const campaign = await this.getCampaignDetails(command);
        campaign.status = CampaignStatus.Paused;
        await this.campaigns.update(campaign);
        return campaign;
    }

    async resumeCampaign(command: Contracts.IResumeCampaignCommand): Promise<Campaign> {
        const campaign = await this.getCampaignDetails(command);
        campaign.status = CampaignStatus.Active;
        await this.campaigns.update(campaign);
        return campaign;
    }

    async completeCampaign(command: Contracts.ICompleteCampaignCommand): Promise<Campaign> {
        const campaign = await this.getCampaignDetails(command);
        campaign.status = CampaignStatus.Completed;
        await this.campaigns.update(campaign);
        return campaign;
    }

    async cancelCampaign(command: Contracts.IGetCampaignDetailsQuery): Promise<Campaign> {
        const campaign = await this.getCampaignDetails(command);
        const activities = await this.activities.getActivitiesForCampaign({ campaignId: campaign.id.value });

        await this.campaigns.delete(campaign);

        for (var activity of activities) {
            try {
                await this.activities.cancelActivity({ activityId: activity.id.value });
            } catch {}
        }

        return campaign;
    }

    async listCampaigns(query: Contracts.IListCampaignsQuery): Promise<Campaign[]> {
        return this.campaigns.findByStatus(query.status ?? CampaignStatus.Active.name);
    }

    async trackActivityCompletion(activityId: GlobalIdentifier): Promise<Activity> {
        const campaigns = await this.campaigns.findByStatus(CampaignStatus.Active.name);
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
            await this.campaigns.update(parentCampaign);
        }
    
        return campaignActivity;
    }    
}
