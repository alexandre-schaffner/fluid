/*
| Developed by Fluid
| Filename : auth.service.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GoogleJwt } from 'src/contracts/GoogleJwt';
import { MissingDataError } from 'src/Errors/MissingData.error';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';

/*
|--------------------------------------------------------------------------
| AUTHENTICATION AND AUTHORIZATION SERVICE
|--------------------------------------------------------------------------
*/

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async issueJwt(userId: string) {
    const jwt = {
      jti: uuid(),
      sub: userId,
      expiresIn: '15min',
      tokenType: 'access_token',
    };

    const signedJwt = await this.jwtService.signAsync(jwt);

    return signedJwt;
  }

  // Sign-up / sign-in with Google
  //--------------------------------------------------------------------------
  async googleSignIn(credential: GoogleJwt) {
    if (!credential.email || !credential.given_name)
      throw new MissingDataError();

    return await this.prismaService.user.upsert({
      create: {
        email: credential.email,
        name: credential.given_name,
      },
      update: {},
      where: {
        email: credential.email,
      },
    });
  }
}
