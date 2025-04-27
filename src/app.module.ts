import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ArtistsModule } from './artists/artists.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './users/config/configuration';
import { validate } from './users/config/env.validation';


@Module({
  imports: [SongsModule,PrismaModule, PlaylistsModule, UsersModule, AuthModule, ArtistsModule, SeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
      load: [configuration],
      validate,
    }),
  
  ],
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
