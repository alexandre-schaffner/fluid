import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { MissingDataError } from 'src/Errors/MissingData.error';
import { PrismaService } from 'src/prisma/prisma.service';
import { Video } from 'src/contracts/Video';
import { youtube_v3 } from 'googleapis';

@Injectable()
export class YoutubeService {
  private readonly googleAuthClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  constructor(private readonly prismaService: PrismaService) {}

  // Exchange YouTube authorization code for tokens and store them in the DB
  //--------------------------------------------------------------------------
  async exchangeCodeForTokens(code: string, userId: string) {
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

  // Retrieve the list of the last 5 videos liked by the user)
  //--------------------------------------------------------------------------
  async getLastLikedVideos(youtube: youtube_v3.Youtube, lastETag = '') {
    const list = await youtube.videos.list(
      {
        part: ['snippet'],
        fields:
          'items(snippet/title,snippet/categoryId,snippet/channelTitle,id),etag',
        myRating: 'like',
      },
      {
        headers: { 'If-None-Match': lastETag },
      },
    );

    // Return an empty array if the list hasn't changed since the last request
    //--------------------------------------------------------------------------
    if (list.status === 304) return { lastLikedVideos: [], etag: lastETag };

    // Transform the list into a list of Video objects and return it
    //--------------------------------------------------------------------------
    const lastLikedVideos: Video[] = list.data.items!.map((item) => {
      return {
        id: item.id!,
        channelTitle: item.snippet!.channelTitle!,
        title: item.snippet!.title!,
        categoryId: item.snippet!.categoryId!,
      };
    });

    return { lastLikedVideos, etag: list.data.etag! };
  }
}
