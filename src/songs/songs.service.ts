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

//insert 
async create(createSongDto: CreateSongDto): Promise<Song & { artists: Artist[] }>{

        const {artists, ...songData} = createSongDto;

        const newSong = await this.prisma.song.create({

            data: {

                title: createSongDto.title,
                releasedDate: new Date(createSongDto.releasedDate),
                duration: createSongDto.duration,
                lyrics: createSongDto.lyrics,
                artists: {

                    connect: artists.map((id) => ({id})),

                },
            },
            include: { artists: true},      
        });  
        return newSong;       
    }  
  
//get
    // async findAll(): Promise<Song[]>{

    //     return this.prisma.song.findMany();
    // }

//getById
    async findOne(id:number):Promise<Song>{

        const song = await this.prisma.song.findUnique({
            
            where: {id},

            include: {artists: true},
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

    const { artists, ...songData } = recordToUpdate;

    try{
    return await this.prisma.song.update({
        where: {id},
        data: {
            ...songData,

            artists: {

                set: artists?.map(id => ({ id })),

                disconnect: [],
            },
        },
        include: {artists: true},
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

//paginated, il get
async paginateSongs(page: number, limit: number, order: string):Promise<PaginatedResult<Prisma.Song & { artists: Artist[] }>>{
    const orderByClause: { releasedDate: 'asc' | 'desc' } = order === 'asc' ? { releasedDate: 'asc' } : { releasedDate: 'desc' };

    const [song, total] = await Promise.all([
        this.prisma.song.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: orderByClause,
            include: {artists:true},
        }),
        
        this.prisma.song.count(),   
    ]);

    // const totalPages = Math.ceil(total/limit);

     return{

        song,total,page,limit

        //  data: songs,
    //     meta: {
    //         totalItems: total,
    //         itemCount: songs.length,
    //         itemsPerPage: limit,
    //         totalPages: totalPages,
    //         currentPage: page,
    //     },

     };
}
}              

