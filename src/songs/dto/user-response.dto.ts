import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
    

    @ApiProperty({
        example: "Jane@gmail.com",
        description: "insert the email"
    })
    email: string;

    @ApiProperty({
        example: "Jane",
        description: "insert the firstname"
    })
    firstName: string;

    @ApiProperty({
        example: "Green",
        description: "insert the lastname"
    })
    lastName: string;
}