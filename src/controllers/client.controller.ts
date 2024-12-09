import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ClientService } from '../services/client.service';
import * as Contracts from '@domain/client/contracts';
import { GlobalIdentifier } from '@vannatta-software/ts-domain';
import { Note } from '@domain/common/Note';
@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Get(':id')
    async getClientDetails(@Param('id') id: string) {
        const query = new Contracts.GetClientDetailsQuery();

        query.clientId = id;

        return this.clientService.getClientDetails(query);
    }

    @Get()
    async listClients(@Body() query: Contracts.ListClientsQuery) {
        return this.clientService.listClients(query);
    }

    @Post()
    async createClient(@Body() command: Contracts.CreateClientCommand) {
        return this.clientService.createClient(command);
    }

    @Patch(':id')
    async updateClient(
        @Param('id') id: string,
        @Body() command: Contracts.UpdateClientCommand
    ) {
        command.clientId = id;
        return this.clientService.updateClient(command);
    }

    @Delete(':id')
    async deleteClient(@Param('id') id: string) {
        const command = new Contracts.DeleteClientCommand(id);
        return this.clientService.deleteClient(command);
    }

    @Post(':id/sales-package')
    async associateSalesPackage(
        @Param('id') id: string,
        @Body() command: Contracts.AssociateSalesPackageCommand
    ) {
        command.clientId = id;
        return this.clientService.associateSalesPackage(command);
    }

    @Post(':id/campaign')
    async associateCampaign(
        @Param('id') id: string,
        @Body() command: Contracts.AssociateCampaignCommand
    ) {
        command.clientId = id;
        return this.clientService.associateCampaign(command);
    }

    @Get(':id/sales-packages')
    async getClientSalesPackages(@Param('id') id: string) {
        const query = new Contracts.GetClientSalesPackagesQuery();

        query.clientId = id;

        return this.clientService.getClientSalesPackages(query);
    }

    @Get(':id/campaigns')
    async getClientCampaigns(@Param('id') id: string) {
        const query = new Contracts.GetClientCampaignsQuery();

        query.clientId = id;

        return this.clientService.getClientCampaigns(query);
    }

    @Post(':id/notes')
    async addNoteToClient(
        @Param('id') id: string,
        @Body() note: Partial<Note>
    ) {
        return this.clientService.addNoteToClient(new GlobalIdentifier(id), new Note(note));
    }
}
