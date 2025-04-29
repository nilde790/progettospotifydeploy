import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Successfully connected to the database');
    } catch (error) {
      console.error('Error connecting to the database:', error);
      process.exit(1); // blocca l'app se non c'è connessione
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
    
  
