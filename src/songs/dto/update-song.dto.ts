import {IsArray, IsDate, IsDateString, IsInt, IsMilitaryTime, IsNotEmpty,IsNumber,IsOptional,IsString,} from "class-validator";

export class UpdateSongDto{

    @IsString()
    @IsOptional()
    title: string;

    @IsOptional()
    @IsArray()
    @IsNumber({},{each:true})
    artists: number[];

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
