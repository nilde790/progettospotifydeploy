import { ApiProperty } from "@nestjs/swagger";
import { Artist } from "@prisma/client";
import {IsArray, IsDate, IsDateString, IsInt, IsMilitaryTime, IsNotEmpty,IsNumber,IsOptional,IsString,} from "class-validator";

export class CreateSongDto{

    @ApiProperty()    
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @ApiProperty()    
    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, { each: true })
    readonly artistId: number[];

    @ApiProperty()    
    @IsDateString()
    @IsNotEmpty()
    readonly releasedDate: string;

    @ApiProperty()    
    @IsString()
    @IsNotEmpty()
    readonly duration: string;

    @ApiProperty()    
    @IsString()
    @IsOptional()
    readonly lyrics: string;
}

