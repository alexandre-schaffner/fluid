import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DeezerService {
  constructor(private readonly prisma: PrismaService) {}

  async exchangeCodeForTokens(code: string, userId: string) {
    const accessToken = (
      await axios.get(
        `https://connect.deezer.com/oauth/access_token.php?app_id=${process.env.DEEZER_APP_ID}&secret=${process.env.DEEZER_SECRET}&code=${code}&output=json`,
      )
    ).data.access_token;

    const res = await axios.get(
      `https://api.deezer.com/user/me?access_token=${accessToken}`,
    );

    await this.prisma.platform.upsert({
      create: {
        type: 'DEEZER',
        refreshToken: accessToken,
        user: {
          connect: {
            id: userId,
          },
        },
        userUniqueRef: String(res.data.id),
      },
      update: {
        type: 'DEEZER',
        refreshToken: accessToken,
        userUniqueRef: String(res.data.id),
      },
      where: {
        userId,
      },
    });

    return accessToken;
  }
}
