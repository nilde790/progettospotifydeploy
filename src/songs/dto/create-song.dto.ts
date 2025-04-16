import { Artist } from "@prisma/client";
import {IsArray, IsDate, IsDateString, IsInt, IsMilitaryTime, IsNotEmpty,IsNumber,IsOptional,IsString,} from "class-validator";

export class CreateSongDto{

    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, { each: true })
    readonly artists: number[];

    @IsDateString()
    @IsNotEmpty()
    readonly releasedDate: string;

    @IsString()
    @IsNotEmpty()
    readonly duration: string;

    @IsString()
    @IsOptional()
    readonly lyrics: string;
}

