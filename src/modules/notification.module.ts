import { Module } from '@nestjs/common';
import { NotificationGateway } from '../gateways/notification.gateway';
import { NotificationService } from '../services/notification.service';

@Module({
    providers: [NotificationGateway, NotificationService],
    exports: [NotificationService],
})
export class NotificationModule {}