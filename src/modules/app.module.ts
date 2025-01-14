import { HttpStatus, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from 'src/controllers/app.controller';
import { EventHandlersModule } from 'src/modules/event.module';
import { EventPublisherService } from 'src/services/eventPublisher.service';
import { ActivityModule } from './activity.module';
import { CampaignModule } from './campaign.module';
import { ClientModule } from './client.module';
import { ExampleModule } from './example.module';
import { LeadModule } from './lead.module';
import { NotificationModule } from './notification.module';
import { ReportModule } from './report.module';
import { SalesPackageModule } from './sales_package.module';
import { WorkflowModule } from './workflow.module';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { APP_FILTER } from '@nestjs/core';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: ApiException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const message = exception.message || 'Internal server error';

        response
            .status(status)
            .json({
                statusCode: status,
                errors: exception.errors ?? {},
                feedback: message,
            });
    }
}


export class ApiException extends HttpException {
  constructor(message: string, public errors?: { [error: string]: string[] }) {
      super(message, HttpStatus.BAD_REQUEST);
  }
}

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
    ActivityModule,
    LeadModule,
    ClientModule,
    ReportModule,
    WorkflowModule,
    SalesPackageModule,
    CampaignModule,
    EventHandlersModule
  ],
  controllers: [AppController],
  providers: [
    EventPublisherService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule { }

