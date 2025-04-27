import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
//comando consigliato per criptare con versioni di node sopra il 20
import * as bcrypt from 'bcryptjs';
import { ArtistsService } from 'src/artists/artists.service';
import { LoginDto } from 'src/songs/dto/login-user.dto';
import { PayloadType } from 'src/songs/types/Payload';
import { UsersService } from 'src/users/users.service';
import { Enable2FAType } from './types/auth-types';
import * as speakeasy from 'speakeasy'
import { ConfigService } from '@nestjs/config';


//serve per restituire un user che non ha la password, che leviamo per motivi di sicurezza
type userWithoutPassword = Omit<User, 'password'>

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService, 
        private jwtService: JwtService,
        private artistsService: ArtistsService, 
        private configService: ConfigService ){ console.log('Secret:', this.configService.get<string>('SECRET')); }


       

    async login(login:LoginDto):Promise<{ accessToken: string } | { validate2FA: string, message:string}>{

        const user = await this.usersService.findByEmail(login.email);

        
        if(!user){  
            throw new UnauthorizedException('User not found');
        }

        const passwordMatched = await bcrypt.compare(login.password,user.password);

        if(!passwordMatched){

            throw new UnauthorizedException('password does not match');
        }

        const { password, ...userWithoutPassword} = user;

        //creo il payload composto da email e id con l'accesstoken
        const payload: PayloadType = {email: user.email, userId: user.id };

        const artist = await this.artistsService.findArtist(user.id)
        if(artist){

            payload.artistId = artist.id

        }

        if(user.enable2FA && user.twoFASecret){

            return {
                validate2FA: 'http://localhost:3000/auth/validate-2fa',
                message: 'please send the one-time password/token from your Google Authenticator App',
            };
        }

        return {accessToken: this.jwtService.sign(payload)};        

    }

    async enable2FA(userId: number): Promise<Enable2FAType>{

        const user = await this.usersService.findById(userId);

        if(user.enable2FA){
            if(!user.twoFASecret){
                throw new Error('2FA is enabled but secret is missing')
            }
            return {secret: user.twoFASecret};
        }

        const secret = speakeasy.generateSecret();
        console.log(secret);
        user.twoFASecret = secret.base32;

        await this.usersService.updateSecretKey(user.id, user.twoFASecret);

        return {secret: user.twoFASecret}


    }

    async disable2FA(userId: number): Promise<void> {

        return this.usersService.disable2FA(userId);
    }

    async validate2FAToken(
        userId: number,
        token: string,
    ): Promise<{verified: boolean}>{

        try{
            const user = await this.usersService.findById(userId);

            if (!user.twoFASecret) {
                throw new UnauthorizedException('2FA is not enabled for this user');
            }

            const verified = speakeasy.totp.verify({
                secret: user.twoFASecret,
                token,
                encoding: 'base32',
            })
            return { verified };
        }
        catch(err){
            throw new UnauthorizedException('error verifying token')
        }

    }

    async validateUserByApiKey(apiKey: string ): Promise<User | null>{
        const user = this.usersService.findByApiKey(apiKey);

        if(!user){
            throw new UnauthorizedException('invalid API Key')
        }
        return user;
            
    }

    getEnvVariables(){
        return{
            port: this.configService.get<number>('port'),
        }
    }
}
