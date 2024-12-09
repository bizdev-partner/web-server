import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CampaignService } from '../services/campaign.service';
import * as Contracts from '@domain/campaign/contracts';

@Controller('campaigns')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) {}

    @Get(':id')
    async getCampaignDetails(@Param('id') id: string) {
        const query = new Contracts.GetCampaignDetailsQuery(id);
        return this.campaignService.getCampaignDetails(query);
    }

    @Post()
    async launchCampaign(@Body() command: Contracts.LaunchCampaignCommand) {
        return this.campaignService.launchCampaign(command);
    }

    @Patch(':id/pause')
    async pauseCampaign(@Param('id') id: string) {
        const command = new Contracts.PauseCampaignCommand(id);
        return this.campaignService.pauseCampaign(command);
    }

    @Patch(':id/resume')
    async resumeCampaign(@Param('id') id: string) {
        const command = new Contracts.ResumeCampaignCommand(id);
        return this.campaignService.resumeCampaign(command);
    }

    @Delete(':id')
    async completeCampaign(@Param('id') id: string, @Body() command: Contracts.CompleteCampaignCommand) {
        command.campaignId = id;
        return this.campaignService.completeCampaign(command);
    }

    @Get()
    async listCampaigns(@Body() query: Contracts.ListCampaignsQuery) {
        return this.campaignService.listCampaigns(query);
    }
}
