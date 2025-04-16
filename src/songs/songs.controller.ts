import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { SongsService } from './songs.service';
import { get } from 'http';
import { CreateSongDto } from './dto/create-song.dto';
import { promises } from 'dns';
import { Song } from 'generated/prisma';
import { UpdateSongDto } from './dto/update-song.dto';
import { Artist } from '@prisma/client';
import { addAbortListener } from 'events';


@Controller('songs')
    export class SongsController 
    {

        constructor(private songService: SongsService){}
        

    @Post()
    async create(@Body() createSongDto: CreateSongDto){
        
        const song = await this.songService.create(createSongDto);

        return { ...song, artists: song.artists.map(artist => artist.id), };

    }

    @Get()
    async findAll(@Query('page',  new DefaultValuePipe(1), ParseIntPipe) page: number = 1, 
                  @Query('limit', new DefaultValuePipe(10),ParseIntPipe) limit: number = 10,
                  @Query('order', new DefaultValuePipe('desc'))order: string = 'desc'
                )/*: Promise<PaginatedResult<Song>>*/{
           
    try {

        limit= limit > 100 ? 100 : limit;

        const { song, total } = await this.songService.paginateSongs(page, limit, order);   
          
         return {
            songs: song.map(song =>({
                ...song, artists: song.artists.map(artist => artist.name),
            })),
            total,page,limit,
         };
        
    }
    catch(error)
    {
        throw new HttpException("serve error", HttpStatus.INTERNAL_SERVER_ERROR,{ cause: error},);
    }
}
// @Get(':paginated')
// paginateSong(@Query('page',ParseIntPipe) page: number, @Query('limit',ParseIntPipe) limit: number){
//     return this.songService.paginateSongs(page, limit);
// }


    @Get(':id')
    async findOne(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number): Promise<Song>{
    
        return this.songService.findOne(id);

    }

    @Put(':id')
async update(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
  @Body() updateSongDto: UpdateSongDto,
) {
  const updatedSong = await this.songService.update(id, updateSongDto);

  return {
    ...updatedSong,
    artists: updatedSong.artists?.map(artist => artist.id) ?? [],
  };
}
    @Delete(':id')
     async remove(@Param('id',new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id:number): Promise<void>{
    
        return this.songService.remove(id);
    }

    }

