import { Body, Controller, Get, Post, Request,Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/songs/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/songs/dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Enable2FAType } from './types/auth-types';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from 'src/songs/dto/user-response.dto';




type userWithoutPassword = Omit<User, 'password'>

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(
        private userService: UsersService, 
        private authService: AuthService, 
        private configService: ConfigService
    ){}
    

    @Post('signup')
    @ApiOperation({summary: 'register new user'})
    @ApiResponse({
        status: 201,
        description: 'it will return the user',
        type: UserResponseDto
    })
    async signup(@Body() user:CreateUserDto):Promise<userWithoutPassword>{

        return this.userService.create(user);
    }   

    @Post('login')
    @ApiOperation({summary: 'give you the access token' })
    @ApiResponse({
        status: 200,
        description: 'give you access token in response',

    })
    async login(@Body() login: LoginDto){

        return this.authService.login(login);

    }

    @Post('enable-2fa')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    enable2FA(@Request()req,):Promise<Enable2FAType>{
        console.log('Request received in enable2FA');
        console.log('Request Headers:', req.headers);
        console.log(req.user);
        return this.authService.enable2FA(req.user.userId)
    }

    @Get('disable-2fa')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    disable2FA(@Request()req,):Promise<void>{
        console.log(req.user);
        return this.authService.disable2FA(req.user.userId)
    }
    
    @Post('validate-2fa')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    validate2FA(@Request() req, @Body() ValidateTokenDTO:ValidateTokenDTO,):Promise<{ verified: boolean}> {

        return this.authService.validate2FAToken(
            req.user.userId, ValidateTokenDTO.token
        );

    }

    @Get('profile')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)  // Applichiamo la protezione con l'API Key
    getProfile(@Req() req: Request & { user: User }) {
      const { password, ...userWithoutPassword } = req.user     
      return        req.user,    
      {
        msg: 'authenticated with API key',
        user: userWithoutPassword,
        
      }
    }

    @Get('test')
    testEnv() {
        return this.authService.getEnvVariables();  
    }
    @Get('test-config')
    testConfig() {

        return{
            port: this.configService.get<number>('port'),
            secret: this.configService.get<string>('secret'),
        };
    }
  }




