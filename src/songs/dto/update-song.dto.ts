import { ApiProperty } from "@nestjs/swagger";
import {IsArray, IsDate, IsDateString, IsInt, IsMilitaryTime, IsNotEmpty,IsNumber,IsOptional,IsString,} from "class-validator";

export class UpdateSongDto{



    @ApiProperty()    
    @IsString()
    @IsOptional()
    readonly title: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsNumber({},{each:true})
    readonly artistId: number[];

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    readonly releasedDate: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly duration: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly lyrics: string;
}
