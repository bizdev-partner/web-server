import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ClientService } from '../services/client.service';
import * as Contracts from '@domain/client/contracts';
import { GlobalIdentifier } from '@vannatta-software/ts-domain';

@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Get(':id')
    async getClientDetails(@Param('id') id: string) {
        return this.clientService.getClientDetails({ clientId: id });
    }

    @Get()
    async listClients(@Body() query: Contracts.IListClientsQuery) {
        return this.clientService.listClients(query);
    }

    @Post()
    async createClient(@Body() command: Contracts.ICreateClientCommand) {
        return this.clientService.createClient(command);
    }

    @Patch(':id')
    async updateClient(@Param('id') id: string, @Body() command: Contracts.IUpdateClientCommand) {
        return this.clientService.updateClient({ ...command, clientId: id });
    }

    @Delete(':id')
    async deleteClient(@Param('id') id: string) {
        return this.clientService.deleteClient({ clientId: id });
    }

    @Post(':id/sales-package')
    async associateSalesPackage(@Param('id') id: string, @Body() command: Contracts.IAssociateSalesPackageCommand) {
        return this.clientService.associateSalesPackage({ ...command, clientId: id });
    }

    @Post(':id/campaign')
    async associateCampaign(@Param('id') id: string, @Body() command: Contracts.IAssociateCampaignCommand) {
        return this.clientService.associateCampaign({ ...command, clientId: id });
    }

    @Get(':id/sales-packages')
    async getClientSalesPackages(@Param('id') id: string) {
        return this.clientService.getClientSalesPackages({ clientId: id });
    }

    @Get(':id/campaigns')
    async getClientCampaigns(@Param('id') id: string) {
        return this.clientService.getClientCampaigns({ clientId: id });
    }
}
