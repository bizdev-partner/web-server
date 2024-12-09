import { Example, IExampleService, ExampleMetadata, ExampleType, Contracts } from '@domain/example/index';
import { UniqueIdentifier } from '@vannatta-software/ts-domain';
import { Injectable } from '@nestjs/common';
import { ExampleRepository } from 'src/repositories/example.repository';

@Injectable()
export class ExampleService implements IExampleService {
    constructor(
        private readonly exampleRepository: ExampleRepository
    ) {}

    async getAll(query: Contracts.GetAllExamplesQuery): Promise<Example[]> {
        return this.exampleRepository.findAll();
    }

    async getById(query: Contracts.GetExampleByIdQuery): Promise<Example> {
        const example = this.exampleRepository.findById(query.id);

        if (example == null) 
            throw new Error('Example not found');

        return example;
    }

    async create(command: Contracts.CreateExampleCommand): Promise<boolean> {
        const example = new Example({
            name: new UniqueIdentifier({ value: command.name }),
            type: new ExampleType().fromName(command.type),
            metadata: new ExampleMetadata({
                description: command.description, 
                version: command.version
            })
        });

        try {
            await this.exampleRepository.insert(example);
            
            return true;
        } catch {
            return false
        }
    }

    async update(command: Contracts.UpdateExampleCommand): Promise<boolean> {
        const example = await this.getById(new Contracts.GetExampleByIdQuery(command.id));

        example.name = new UniqueIdentifier(command.name);
        example.changeMetadata(command.metadata);
        example.changeType(example.type);

        await this.exampleRepository.update(example);

        return true;
    }

    async delete(command: Contracts.DeleteExampleCommand): Promise<boolean> {
        var instance = await this.getById(new Contracts.GetExampleByIdQuery(command.id));

        await this.exampleRepository.delete(instance);

        return true;
    }

    async updateVersion(command: Contracts.UpdateVersionCommand): Promise<boolean> {
        const example = await this.exampleRepository.findById(command.id);

        example.changeMetadata({ version: command.newVersion })

        await this.exampleRepository.update(example);

        return true;
    }
}
