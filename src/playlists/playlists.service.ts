import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlaylistDto } from 'src/songs/dto/create-playlists.dto';
import {Playlist} from '@prisma/client';


@Injectable()
export class PlaylistsService {

    constructor(private prisma: PrismaService){}

    async create(playlistToCreate: CreatePlaylistDto):Promise<Playlist>{

        const {name,userId,songId} = playlistToCreate;

        const newPlaylist = await this.prisma.playlist.create({
            data:{
                name,
                songs:{
                    connect: songId.map((songId) => ({id: songId}))
                },
                user:{
                    connect: {id: userId}
                }
            },
            include: {user:true, songs:true}
        })
        return newPlaylist;
    }







}
