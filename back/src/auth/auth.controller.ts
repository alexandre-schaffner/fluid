import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { googleJwt } from '../contracts/googleJwt';
import { AuthService } from './auth.service';
import { verifyIdTokenGuard } from '../guards/verify-id-token.guard';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { VerifyJwtGuard } from 'src/guards/verify-jwt.guard';

declare module 'fastify' {
  interface FastifyRequest {
    googleJwt?: googleJwt;
  }
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(verifyIdTokenGuard)
  @Post('webhook/google-sign-in')
  async googleSignIn(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const { googleJwt } = req;
    if (!googleJwt) return res.status(400).send('Bad Request');

    const user = await this.authService.googleSignIn(googleJwt);
    res.setCookie(
      'jwt',
      await this.jwtService.signAsync({
        jti: uuid(),
        sub: user.id,
        expiresIn: '15min',
        tokenType: 'access_token',
      }),
    );
    return res.status(302).redirect('http://localhost:3000');
  }

  @UseGuards(VerifyJwtGuard)
  @Post('webhook/authorize-youtube')
  async authorizeYoutube() {
    return;
  }
}
