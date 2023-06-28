import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VerifyJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const jwt = request.cookies['jwt'];
      if (!jwt) throw new UnauthorizedException();

      const payload = await this.jwtService.verifyAsync(jwt);

      if (
        await this.prismaService.revokedToken.findUnique({
          where: { jti: payload.jti },
        })
      )
        throw new UnauthorizedException();

      request.user = payload;

      return true;
    } catch (err: unknown) {
      console.error(err);
      throw new UnauthorizedException();
    }
  }
}
