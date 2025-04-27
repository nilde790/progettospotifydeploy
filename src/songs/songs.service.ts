import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { connect } from 'http2';
import { Prisma, Song, Artist, User } from '@prisma/client';



@Injectable()
export class SongsService 
{

    constructor(private prisma: PrismaService){}

//insert dove posto una canzone e la collego tramite id ad un artista esistente
async create(createSongDto: CreateSongDto):Promise<Song>{

        const {artistId,title,releasedDate,duration,lyrics} = createSongDto;

        const newSong = await this.prisma.song.create({

            data: {

                title,
                releasedDate: new Date(releasedDate),
                duration,
                lyrics,
                artists: {

                    connect: artistId.map((artistId) => ({ id: artistId })),

                },
            },
            include: {artists:{include:{user:{select:{firstName:true,lastName:true}}}}},      
        });  
        return newSong;       
    }  


//getById
     async findOne(id:number):Promise<Song>{

        const song = await this.prisma.song.findUnique({
            
            where: {id},

            include: {artists:{include:{user:{select:{firstName:true,lastName:true}}}}}
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

    const { artistId,title,releasedDate,duration,lyrics } = recordToUpdate;

    try{
    return await this.prisma.song.update({
        where: {id},
        data:   {title,
                releasedDate: new Date(releasedDate),
                duration,
                lyrics,
                artists: {

                    set: artistId.map((artistId) => ({ id: artistId })),

                },
            },
            include: {artists:{include:{user:{select:{firstName:true,lastName:true}}}}},    
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

//paginated, il get avanzato
async getWithPagine(page: number, limit: number, order: string){
    const orderByClause: { releasedDate: 'asc' | 'desc' } = order === 'asc' ? { releasedDate: 'asc' } : { releasedDate: 'desc' };

    const [song, total] = await Promise.all([
        this.prisma.song.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: orderByClause,
            include: {
                artists:{
                    include:{
                        user:{
                            select:{
                                firstName:true,
                                lastName:true
                            }
                            
                         }

                    }
               }
                
            }
        },
    ),
        
        this.prisma.song.count(),   
    ]);

     return{

        song,total,page,limit

     };
}
}              

