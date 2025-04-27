import { Injectable } from '@nestjs/common';
import { seedData } from '../../prisma/seed-data';
import { PrismaService } from 'src/prisma/prisma.service';
import { faker,  } from '@faker-js/faker/.';

@Injectable()
export class SeedService {

    constructor(private readonly prisma: PrismaService){}

    async seed(): Promise<void>{
        try{
            await seedData();
            console.log('seeding completato');
        }
        catch(err){
            console.error('errore durente il seeding', err);

        }
    }
}
