import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class CreateUserDto{
    @ApiProperty({
        example: "Jane",
        description: "insert the firstname"
    })
    @IsString()
    @IsNotEmpty()
    readonly firstName: string;

    @ApiProperty({
        example: "Green",
        description: "insert the lastname"
})
    @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    @ApiProperty({ 
        example: "Jane@gmail.com",
        description: "insert the email"})
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        example: "test123#@",
        description: "Provide the password of the user",
        })
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}