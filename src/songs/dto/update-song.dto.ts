import {IsArray, IsDate, IsDateString, IsInt, IsMilitaryTime, IsNotEmpty,IsOptional,IsString,} from "class-validator";

export class UpdateSongDto{

    @IsString()
    @IsOptional()
    title: string;

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    artists: string[];

    @IsDateString()
    @IsOptional()
    releasedDate: string;

    @IsString()
    @IsOptional()
    duration: string;

    @IsString()
    @IsOptional()
    readonly lyrics: string;
}
