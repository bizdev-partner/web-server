import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix("");
  app.enableCors({
    origin: '*', // Allow all origins
  });
  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
