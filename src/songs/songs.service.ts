import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSongDto } from './dto/create-song.dto';
import { Song } from 'generated/prisma/client';
import { UpdateSongDto } from './dto/update-song.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class SongsService 
{

    constructor(private prisma: PrismaService){}

//insert 
    async create(createSongDto: CreateSongDto): Promise<Song>{

        const song = await this.prisma.song.create({

            data: {

                title: createSongDto.title,
                artists: createSongDto.artists,
                releasedDate: new Date(createSongDto.releasedDate),
                duration: createSongDto.duration,
                lyrics: createSongDto.lyrics

            }           
        })
        return song;       
    }  
  
//get
    async findAll(): Promise<Song[]>{

        return this.prisma.song.findMany();
    }

//getById
    async findOne(id:number):Promise<Song>{

        const song = await this.prisma.song.findUnique({
            
            where: {id}
        });

        if (!song){

            throw new NotFoundException(`song with id ${id} not found`)
        }

        return song;

    }

//delete
async remove(id:number):Promise<void>{

    try{

    await this.prisma.song.delete({
        where: { id: id },   
    })
}

    catch(error){

        throw new HttpException('song not found', HttpStatus.NOT_FOUND);
    }
}

//update
async update(id: number, recordToUpdate: UpdateSongDto):Promise<Song>{

    try{
    return await this.prisma.song.update({
        where: {id},
        data: recordToUpdate
    });
}
catch(error){
    if(
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'){
        
        throw new NotFoundException(`song with ID ${id} not found`);
    }

    throw error;

}
}

}              

