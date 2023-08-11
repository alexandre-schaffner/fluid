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
}
