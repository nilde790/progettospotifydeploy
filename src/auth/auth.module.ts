import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { authConstants } from './auth.constants';
import { JwtStrategy } from './jwt.strategy';
import { ArtistsService } from 'src/artists/artists.service';
import { ApiKeyStrategy } from './apikeystrategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.registerAsync({
    imports: [ConfigModule],
     useFactory: async(configService: ConfigService) => ({
      secret: configService.get<string>('secret') || 'HAD_12X#@',
      signOptions:{expiresIn: '1d'},
     }),
     inject: [ConfigService],

})],
  providers: [AuthService,UsersService,PrismaService, JwtStrategy, ArtistsService, ApiKeyStrategy],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
