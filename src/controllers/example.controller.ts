import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ExampleService } from '../services/example.service';
import { Contracts } from '@domain/example/index';

@Controller('examples')
export class ExampleController {
    constructor(private readonly exampleService: ExampleService) {}

    @Get()
    async getAllExamples() {
        return this.exampleService.getAll(new Contracts.GetAllExamplesQuery());
    }

    @Get(':id')
    async getExampleById(@Param('id') id: string) {
        return this.exampleService.getById(new Contracts.GetExampleByIdQuery(id));
    }

    @Post()
    async createExample(@Body() command: Contracts.CreateExampleCommand) {
        console.log(command)

        await this.exampleService.create(command);
    }

    @Patch(':id')
    async updateExample(@Param('id') id: string, @Body() command: Contracts.UpdateExampleCommand) {
        command.id = id;
        await this.exampleService.update(command);
    }

    @Delete(':id')
    async deleteExample(@Param('id') id: string, @Body() command: Contracts.DeleteExampleCommand) {
        command.id = id;
        await this.exampleService.delete(command);
    }

    @Patch(':id/version')
    async updateVersion(@Param('id') id: string, @Body() command: Contracts.UpdateVersionCommand) {
        command.id = id;
        await this.exampleService.updateVersion(command);
    }
}
