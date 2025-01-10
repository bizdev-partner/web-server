import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Client } from '@domain/client/Client';
import { MongoSchema } from 'src/schemas/mongo.schema';
import { ClientController } from '../controllers/client.controller';
import { ClientService } from '../services/client.service';
import { ClientRepository } from '../repositories/client.repository';
import { EventPublisherService } from 'src/services/eventPublisher.service';
import { CampaignModule } from './campaign.module';
import { SalesPackageModule } from './sales_package.module';
import { ActivityModule } from './activity.module';

@Module({
    imports: [
        CampaignModule,
        SalesPackageModule,
        ActivityModule,
        MongooseModule.forFeature([{ name: Client.name, schema: MongoSchema(Client) }]),
    ],
    controllers: [ClientController],
    providers: [ClientService, ClientRepository, EventPublisherService],
    exports: [ClientService],
})
export class ClientModule {}
