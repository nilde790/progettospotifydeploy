import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
      console.log('Inside JwtAuthGuard canActivate');
      return super.canActivate(context); // Chiama il metodo di base per la logica predefinita di Passport
    }
  
    handleRequest(err, user, info) {
      console.log('JwtAuthGuard handleRequest - user:', user);
      console.log('JwtAuthGuard handleRequest - error:', err);
      console.log('JwtAuthGuard handleRequest - info:', info);
      if (err || !user) {
        throw err || new UnauthorizedException('Unauthorized access');
      }
      return user;
    }
}