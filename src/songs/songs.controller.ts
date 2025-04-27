import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards, Request } from '@nestjs/common';
import { SongsService } from './songs.service';
import { get } from 'http';
import { CreateSongDto } from './dto/create-song.dto';
import { promises } from 'dns';
import { UpdateSongDto } from './dto/update-song.dto';
import { Artist,Song } from '@prisma/client';
import { addAbortListener } from 'events';
import { JwtArtistsGuard } from 'src/artists/jwt-artists.guard';


@Controller('songs')
    export class SongsController 
    {

        constructor(private songService: SongsService){}
        

    @Post()
    @UseGuards(JwtArtistsGuard)
    async create(@Body() createSongDto: CreateSongDto, @Request() req):Promise<Song>{

        console.log(req.user);

        return this.songService.create(createSongDto);
        
        };

    

    @Get()
    async findAll(@Query('page',  new DefaultValuePipe(1), ParseIntPipe) page: number = 1, 
                  @Query('limit', new DefaultValuePipe(10),ParseIntPipe) limit: number = 10,
                  @Query('order', new DefaultValuePipe('desc'))order: string = 'desc'
                ): Promise<PaginatedResult<Song>>{
           
    try {

        limit= limit > 100 ? 100 : limit;

        return this.songService.getWithPagine(page, limit, order);   
          
        
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

            //temp


     @Get(':id')
     async findOne(@Param('id', new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number)
     :Promise<Song>{
    
         return this.songService.findOne(id);

     }

    @Put(':id')
async update(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
  @Body() updateSongDto: UpdateSongDto,) {

  return this.songService.update(id, updateSongDto);
  
}
    @Delete(':id')
     async remove(@Param('id',new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id:number): Promise<void>{
    
        return this.songService.remove(id);
    }

    }
    
