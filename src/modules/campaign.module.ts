import { Campaign } from '@domain/campaign/Campaign';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoSchema } from 'src/schemas/mongo.schema';
import { CampaignController } from '../controllers/campaign.controller';
import { CampaignRepository } from '../repositories/campaign.repository';
import { CampaignService } from '../services/campaign.service';
import { EventPublisherService } from '../services/eventPublisher.service';
import { ActivityModule } from './activity.module';
import { WorkflowModule } from './workflow.module';

@Module({
    imports: [
        WorkflowModule,
        ActivityModule,
        MongooseModule.forFeature([{ name: Campaign.name, schema: MongoSchema(Campaign) }]),
    ],
    controllers: [CampaignController],
    providers: [
        CampaignService, 
        CampaignRepository, 
        EventPublisherService
    ],
    exports: [CampaignService],
})
export class CampaignModule {}
