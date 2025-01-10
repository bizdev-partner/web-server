import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportController } from 'src/controllers/report.controller';
import { ReportRepository } from 'src/repositories/report.repository';
import { MongoSchema } from 'src/schemas/mongo.schema';
import { ReportService } from 'src/services/report.service';
import { Report } from '@domain/report';
import { EventPublisherService } from '../services/eventPublisher.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Report.name, schema: MongoSchema(Report) }]),
    ],
    controllers: [ReportController],
    providers: [ReportService, ReportRepository, EventPublisherService],
    exports: [ReportService],
})
export class ReportModule {}
