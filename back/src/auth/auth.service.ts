/*
| Developed by Starton
| Filename : auth.service.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
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
  private readonly encodedCredentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
  ).toString('base64');

  private readonly googleAuthClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

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

  // Exchange YouTube authorization code for tokens and store them in the DB
  //--------------------------------------------------------------------------
  async exchangeYoutubeCodeForTokens(code: string, userId: string) {
    try {
      const { tokens } = await this.googleAuthClient.getToken(code);

      if (!tokens.refresh_token) throw new MissingDataError('refresh_token');
      await this.prismaService.youTubeToken.create({
        data: {
          refreshToken: tokens.refresh_token,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return tokens;
    } catch (err: unknown) {
      console.error(err);
      throw err;
    }
  }

  async exchangeSpotifyCodeForTokens(code: string, userId: string) {
    try {
      let response = await axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=authorization_code&code=' +
          code +
          '&redirect_uri=http://localhost:8000/auth/webhook/spotify/code',
        {
          headers: {
            Authorization: 'Basic ' + this.encodedCredentials,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const refreshToken = response.data.refresh_token;

      response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: 'Bearer ' + response.data.access_token,
        },
      });

      const userUniqueRef = response.data.id;

      await this.prismaService.platform.upsert({
        create: {
          refreshToken,
          type: 'SPOTIFY',
          user: {
            connect: {
              id: userId,
            },
          },
          userUniqueRef,
        },
        update: {},
        where: {
          userId,
        },
      });
      return;
    } catch (err: unknown) {
      console.error(err);
      throw err;
    }
  }
}
