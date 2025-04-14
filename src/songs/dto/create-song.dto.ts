import {IsArray, IsDate, IsDateString, IsInt, IsMilitaryTime, IsNotEmpty,IsOptional,IsString,} from "class-validator";

export class CreateSongDto{

    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({each: true})
    readonly artists: string[];

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

