import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports:[],
  providers: [ArtistsService, PrismaService],
  controllers: []
})
export class ArtistsModule {}
