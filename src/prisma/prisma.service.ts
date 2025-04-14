import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  // Metodo di inizializzazione chiamato all'avvio del modulo
  async onModuleInit() {
    await this.$connect();
    
  }
}