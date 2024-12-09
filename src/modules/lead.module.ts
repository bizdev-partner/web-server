import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lead } from '@domain/lead/Lead';
import { MongoSchema } from 'src/schemas/mongo.schema';
import { LeadController } from '../controllers/lead.controller';
import { LeadService } from '../services/lead.service';
import { LeadRepository } from '../repositories/lead.repository';
import { EventPublisherService } from 'src/services/eventPublisher.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Lead.name, schema: MongoSchema(Lead) }]),
    ],
    controllers: [LeadController],
    providers: [LeadService, LeadRepository, EventPublisherService],
    exports: [LeadService],
})
export class LeadModule {}
