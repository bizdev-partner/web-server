import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SalesPackageService } from '../services/sales_package.service';
import * as Contracts from '@domain/sales_package/contracts';

@Controller('sales-packages')
export class SalesPackageController {
    constructor(private readonly salesPackageService: SalesPackageService) {}

    @Get(':id')
    async getPackageDetails(@Param('id') id: string) {
        return this.salesPackageService.getPackageDetails({ packageId: id });
    }

    @Get()
    async listPackages(@Body() query: Contracts.IListPackagesQuery) {
        return this.salesPackageService.listPackages(query);
    }

    @Post()
    async createPackage(@Body() command: Contracts.ICreatePackageCommand) {
        return this.salesPackageService.createPackage(command);
    }

    @Patch(':id')
    async updatePackage(
        @Param('id') id: string,
        @Body() command: Contracts.IUpdatePackageCommand
    ) {
        return this.salesPackageService.updatePackage({ ...command, packageId: id });
    }

    @Patch(':id/feedback')
    async addFeedback(@Param('id') id: string, @Body() command: Contracts.IAddFeedbackCommand) {
        return this.salesPackageService.addFeedback({ ...command, packageId: id });
    }

    @Delete(':id')
    async deletePackage(@Param('id') id: string) {
        return this.salesPackageService.deletePackage({ packageId: id });
    }
}
