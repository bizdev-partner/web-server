import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoSchema } from 'src/schemas/mongo.schema';
import { EventPublisherService } from '../services/eventPublisher.service';
import { SalesPackageController } from 'src/controllers/sales_package.controller';
import { SalesPackage } from '@domain/sales_package/SalesPackage';
import { SalesPackageService } from 'src/services/sales_package.service';
import { SalesPackageRepository } from 'src/repositories/sales_package.repository';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: SalesPackage.name, schema: MongoSchema(SalesPackage) }]),
    ],
    controllers: [SalesPackageController],
    providers: [SalesPackageService, SalesPackageRepository, EventPublisherService],
    exports: [SalesPackageService],
})
export class SalesPackageModule {}
