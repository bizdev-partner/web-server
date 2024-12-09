import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Workflow } from '@domain/workflow/Workflow';
import { MongoSchema } from 'src/schemas/mongo.schema';
import { WorkflowController } from '../controllers/workflow.controller';
import { WorkflowService } from '../services/workflow.service';
import { WorkflowRepository } from '../repositories/workflow.repository';
import { EventPublisherService } from 'src/services/eventPublisher.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Workflow.name, schema: MongoSchema(Workflow) }]),
    ],
    controllers: [WorkflowController],
    providers: [WorkflowService, WorkflowRepository, EventPublisherService],
    exports: [WorkflowService],
})
export class WorkflowModule {}
