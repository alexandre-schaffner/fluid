/*
| Developed by Starton
| Filename : setPlaylist.dto.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { IsString, IsNotEmpty } from 'class-validator';

/*
|--------------------------------------------------------------------------
| setPlaylist DTO
|--------------------------------------------------------------------------
*/

export class SetPlaylistDto {
  @IsNotEmpty()
  @IsString()
  playlistId: string;
}
