import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.development.env'});

declare const module: any; //abilita HMR


async function bootstrap() {

  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  
  const app = await NestFactory.create(AppModule);

  //setta l'utilizzo di pipes
  app.useGlobalPipes(new ValidationPipe());

  //setta l'utilizzo dei seed
  const seedService = app.get(SeedService);
   await seedService.seed();

  //setta l'utilizzo delle configurazioni
  const configService = app.get(ConfigService); 

  //setta lo swagger in developmnet
  if(configService.get<string>('NODE_ENV')==='development'){
    const config = new DocumentBuilder()
    .setTitle('Spotify')
    .setDescription('API documentation for Spotify app')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth' //nome autenticazione nei controller

  )
    .build();

      const document= SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api',app, document);
    
  }

  await app.listen(configService.get<number>("port") || 3000);
} 
bootstrap();
