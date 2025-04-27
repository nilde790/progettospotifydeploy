import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/songs/dto/create-user.dto';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

type userWithoutPassword = Omit<User, 'password'>

@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService){}

    async create(user: CreateUserDto):Promise<userWithoutPassword>{
        
        const apiKey = uuidv4();
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, salt);

        const {firstName, lastName, email} = user;

        const newUser= await this.prisma.user.create({
            data:{
                firstName,
                lastName,
                email,
                password: hashedPassword,
                apiKey: apiKey,

            },
    });
    const {password,...userWithoutPassword} = newUser;
    
    return userWithoutPassword;

    }

    async findByEmail(email: string){

        const user= this.prisma.user.findUnique({
            where: {email},

    });
    if(!user){
        throw new UnauthorizedException('could not find user');    
    }
    return user;
    }

    async findById(id: number): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
    
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
    
        return user;  // Restituisci sempre un oggetto User
    }

    async updateSecretKey(userId: number, secret: string): Promise<User>{
        return this.prisma.user.update({
            where: {id: userId},
            data:{
                twoFASecret: secret,
                enable2FA: true,
            },
        });
    }

    async disable2FA(userId: number): Promise<void>{
        await this.prisma.user.update({
            where: { id: userId},
            data:{
                enable2FA: false,
                twoFASecret: null,
            },
        });
    }

    async findByApiKey(apiKey: string): Promise<User | null> {
        return this.prisma.user.findUnique({where: {apiKey}});
    }
}
