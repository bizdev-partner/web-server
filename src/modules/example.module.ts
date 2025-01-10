import { Module } from '@nestjs/common';
import { ExampleRepository } from '../repositories/example.repository';
import { EventPublisherService } from '../services/eventPublisher.service';
import { ExampleService } from '../services/example.service';
import { ExampleController } from 'src/controllers/example.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Example } from '@domain/example/index';
import { MongoSchema } from 'src/schemas/mongo.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Example.name, schema: MongoSchema(Example) }]),
    ],
    controllers: [ ExampleController ],
    providers: [ ExampleRepository, ExampleService, EventPublisherService ]
})
export class ExampleModule {}
