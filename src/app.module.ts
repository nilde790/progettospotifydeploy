import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [SongsModule,PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})

//                         l'implement serve per accedere al middleware
export class AppModule implements NestModule
{
    
  //configuro il middleware
  configure(consumer: MiddlewareConsumer) {

    consumer.apply(LoggerMiddleware).forRoutes('songs');
    
  }

}
