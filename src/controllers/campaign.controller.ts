import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CampaignService } from '../services/campaign.service';
import * as Contracts from '@domain/campaign/contracts';

@Controller('campaigns')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) {}

    @Get(':id')
    async getCampaignDetails(@Param('id') id: string) {
        return this.campaignService.getCampaignDetails({ campaignId: id });
    }

    @Post()
    async launchCampaign(@Body() command: Contracts.ILaunchCampaignCommand) {
        return this.campaignService.launchCampaign(command);
    }

    @Patch(':id')
    async updateCampaign(@Param('id') id: string, @Body() command: Contracts.IUpdateCampaignCommand) {
        return this.campaignService.updateCampaign(command);
    }

    @Patch(':id/pause')
    async pauseCampaign(@Param('id') id: string) {
        return this.campaignService.pauseCampaign({ campaignId: id });
    }

    @Patch(':id/resume')
    async resumeCampaign(@Param('id') id: string) {
        return this.campaignService.resumeCampaign({ campaignId: id });
    }

    @Delete(':id')
    async cancelCampaign(@Param('id') id: string) {
        return this.campaignService.cancelCampaign({ campaignId: id });
    }

    @Delete(':id')
    async completeCampaign(@Param('id') id: string, @Body() command: Omit<Contracts.ICompleteCampaignCommand, 'campaignId'>) {
        return this.campaignService.completeCampaign({ ...command, campaignId: id });
    }

    @Get()
    async listCampaigns(@Body() query: Contracts.IListCampaignsQuery) {
        return this.campaignService.listCampaigns(query);
    }
}
