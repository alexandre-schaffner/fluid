/*
| Developed by Fluid
| Filename : setPlaylist.dto.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
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
