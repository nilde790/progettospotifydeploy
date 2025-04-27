import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistsService {

    constructor(private prisma: PrismaService){}


    async findArtist(userId: number){

        return this.prisma.artist.findUnique({
            where: {userId: userId}
        
    })
    }
}
