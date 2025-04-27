import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { faker,  } from '@faker-js/faker';

const prisma = new PrismaClient();

export const seedData = async () =>{
    await seedUser();
    await seedArtist();
    await seedPlaylist(); 
};

async function seedUser(){
    const salt = await bcrypt.genSalt();        
    const hashedPassword = await bcrypt.hash('123456', salt)

    await prisma.user.create({

        data:{
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: hashedPassword,
            apiKey: uuidv4(),
        }

    })

}

    async function seedArtist() {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash('123456', salt);
      
        const user = await prisma.user.create({
          data: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: hashedPassword,
            apiKey: uuidv4(),
          },
        });

await prisma.artist.create({
    data: {
      userId: user.id,
    },
  });
    }


    async function seedPlaylist() {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash('123456', salt);
      
        const user = await prisma.user.create({
          data: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: hashedPassword,
            apiKey: uuidv4(),
          },
        });
        await prisma.playlist.create({
            data: {
              name: faker.music.genre(),
              userId: user.id,
            },
          });
        }
        
