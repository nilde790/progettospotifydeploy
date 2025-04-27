import { Body, Controller, Post } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from 'src/songs/dto/create-playlists.dto';
import { Playlist } from '@prisma/client';

@Controller('playlists')
export class PlaylistsController {

    constructor(private playlistService: PlaylistsService){}


    @Post()
    async create(@Body() playlistTocreate: CreatePlaylistDto):Promise<Playlist>{

        return this.playlistService.create(playlistTocreate);

    }

}
