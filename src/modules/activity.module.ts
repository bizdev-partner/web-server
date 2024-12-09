import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Activity } from '@domain/activity/Activity';
import { MongoSchema } from 'src/schemas/mongo.schema';
import { ActivityController } from '../controllers/activity.controller';
import { ActivityService } from '../services/activity.service';
import { ActivityRepository } from '../repositories/activity.repository';
import { EventPublisherService } from '../services/eventPublisher.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Activity.name, schema: MongoSchema(Activity) }]),
    ],
    controllers: [ActivityController],
    providers: [ActivityService, ActivityRepository, EventPublisherService],
    exports: [ActivityService],
})
export class ActivityModule {}
