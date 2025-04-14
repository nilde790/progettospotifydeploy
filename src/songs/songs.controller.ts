import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { SongsService } from './songs.service';
import { get } from 'http';
import { CreateSongDto } from './dto/create-song.dto';
import { promises } from 'dns';
import { Song } from 'generated/prisma';
import { UpdateSongDto } from './dto/update-song.dto';

@Controller('songs')
    export class SongsController 
    {

        constructor(private songService: SongsService){}
        

    @Post()
    async create(@Body() createSongDto: CreateSongDto): Promise<Song>
    {
        
        return this.songService.create(createSongDto);

    }

    @Get()
    async findAll(): Promise<Song[]>
    {
    try {
          
         return this.songService.findAll(); 
        // return "find all song endpoint";
    }
    catch(error)
    {
        throw new HttpException("serve error", HttpStatus.INTERNAL_SERVER_ERROR,{ cause: error},);
    }
}

    @Get(':id')
    async findOne(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number): Promise<Song>{
    
        return this.songService.findOne(id);

    }

    @Put(':id')
    async update(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number,
    @Body() UpdateSongDto: UpdateSongDto
):Promise<Song>{

        return this.songService.update(id, UpdateSongDto)

        
    }

    @Delete(':id')
     async remove(@Param('id',new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id:number): Promise<void>{
    
        return this.songService.remove(id);
    }


}

