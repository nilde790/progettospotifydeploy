import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePlaylistDto{

    @ApiProperty()    
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty()    
    @IsArray()
    @IsNumber({},{each:true})
    @IsNotEmpty()
    readonly songId: number[];

    @ApiProperty()    
    @IsNotEmpty()
    @IsNumber()
    readonly userId: number;


}