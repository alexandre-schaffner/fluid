import { Injectable } from '@nestjs/common';
import { MeDto } from './contracts/Me.dto';
import { PrismaService } from './prisma/prisma.service';
import { MissingDataError } from './Errors/MissingData.error';
import { StreamingPlatformService } from './platform/platform.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly platformService: StreamingPlatformService,
  ) {}

  async getMe(id: string): Promise<MeDto> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        Platform: true,
      },
    });

    if (!user.Platform) throw new MissingDataError('Platform');

    const playlists = await this.platformService.getPlaylists(id);

    const me: MeDto = {
      id: user.id,
      name: user.name,
      isSync: user.sync,
      playlists,
      syncPlaylistId: user.Platform.playlistUniqueRef,
    };

    for (const playlist of me.playlists) {
      playlist.isSync =
        user.Platform.playlistUniqueRef === playlist.id ? true : false;
    }

    return me;
  }

  // Enable syncing between YouTube and the streaming platform
  //--------------------------------------------------------------------------
  async enableSync(userId: string) {
    const tokens = await this.prismaService.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        Platform: {
          select: { refreshToken: true, playlistUniqueRef: true, type: true },
        },
        Youtube: { select: { refreshToken: true } },
      },
    });

    const youtubeRefreshToken = tokens.Youtube?.refreshToken;
    const platformRefreshToken = tokens.Platform?.refreshToken;
    const playlistId = tokens.Platform?.playlistUniqueRef;

    if (!youtubeRefreshToken || !platformRefreshToken || !playlistId)
      throw new Error(
        'Cannot sync: the user has not connected its music streaming platform or has not set a playlist to sync.',
      );

    await this.prismaService.user.update({
      where: { id: userId },
      data: { sync: true },
    });
  }

  // Disable syncing between YouTube and the streaming platform
  //--------------------------------------------------------------------------
  async disableSync(userId: string) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { sync: false },
    });
  }
}
