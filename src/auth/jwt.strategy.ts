import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { authConstants } from "./auth.constants";
import { Injectable } from "@nestjs/common";
import { PayloadType } from "src/songs/types/Payload";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private configService: ConfigService) {
        const secret = configService.get<string>('SECRET');
        console.log('JWT Secret from config:', secret); 
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: authConstants.secret,
        });
    }

    async validate(payload: PayloadType){
        console.log('JwtStrategy validate - Payload:', payload);
        return {userId: payload.userId, 
            email: payload.email,
            artistId: payload.artistId,  
        };
    }
}