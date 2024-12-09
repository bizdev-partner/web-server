import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import * as Contracts from '@domain/sales_package/contracts';
import { SalesPackageService } from 'src/services/sales_package.service';

@Controller('sales-packages')
export class SalesPackageController {
    constructor(private readonly salesPackageService: SalesPackageService) {}

    @Get(':id')
    async getPackageDetails(@Param('id') id: string) {
        const query = new Contracts.GetPackageDetailsQuery(id);
        return this.salesPackageService.getPackageDetails(query);
    }

    @Get()
    async listPackages(@Body() query: Contracts.ListPackagesQuery) {
        return this.salesPackageService.listPackages(query);
    }

    @Post()
    async createPackage(@Body() command: Contracts.CreatePackageCommand) {
        return this.salesPackageService.createPackage(command);
    }

    @Patch(':id')
    async updatePackage(
        @Param('id') id: string,
        @Body() command: Contracts.UpdatePackageCommand
    ) {
        command.packageId = id;
        return this.salesPackageService.updatePackage(command);
    }

    @Patch(':id/feedback')
    async addFeedback(
        @Param('id') id: string,
        @Body() command: Contracts.AddFeedbackCommand
    ) {
        command.packageId = id;
        return this.salesPackageService.addFeedback(command);
    }

    @Delete(':id')
    async deletePackage(@Param('id') id: string) {
        const command = new Contracts.DeletePackageCommand(id);
        return this.salesPackageService.deletePackage(command);
    }
}
