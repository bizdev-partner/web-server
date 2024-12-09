import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from 'src/controllers/app.controller';
import { EventHandlersModule } from 'src/modules/event.module';
import { EventPublisherService } from 'src/services/eventPublisher.service';
import { NotificationService } from 'src/services/notification.service';
import { ExampleModule } from './example.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationGateway } from 'src/gateways/notification.gateway';
import { NotificationModule } from './notification.module';
import { ActivityModule } from './activity.module';
import { WorkflowModule } from './workflow.module';
import { LeadModule } from './lead.module';
import { SalesPackageModule } from './sales_package.module';
import { CampaignModule } from './campaign.module';
import { ClientModule } from './client.module';

const appRoot = join(__dirname, '..', '..', '..')

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({ rootPath: join(appRoot, "public") }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION, {
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
      dbName: process.env.MONGO_INITDB_DATABASE,
    }),
    EventEmitterModule.forRoot(),
    NotificationModule,
    ExampleModule,
    ActivityModule,
    LeadModule,
    ClientModule,
    WorkflowModule,
    SalesPackageModule,
    CampaignModule,
    EventHandlersModule
  ],
  controllers: [AppController],
  providers: [
    EventPublisherService
  ],
})
export class AppModule { }

