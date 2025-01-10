import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('BizDev Partner API')
    .setDescription('API documentation for the BizDev Partner')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

  // app.setGlobalPrefix("");
  app.enableCors({
    origin: '*', // Allow all origins
  });
  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

