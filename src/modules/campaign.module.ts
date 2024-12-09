import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign } from '@domain/campaign/Campaign';
import { MongoSchema } from 'src/schemas/mongo.schema';
import { CampaignController } from '../controllers/campaign.controller';
import { CampaignService } from '../services/campaign.service';
import { CampaignRepository } from '../repositories/campaign.repository';
import { EventPublisherService } from '../services/eventPublisher.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Campaign.name, schema: MongoSchema(Campaign) }]),
    ],
    controllers: [CampaignController],
    providers: [CampaignService, CampaignRepository, EventPublisherService],
    exports: [CampaignService],
})
export class CampaignModule {}
