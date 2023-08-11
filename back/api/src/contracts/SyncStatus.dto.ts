/*
| Developed by Fluid
| Filename : SyncStatus.dto.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { IsBoolean } from 'class-validator';

export class SyncStatusDto {
  @IsBoolean()
  sync: string;
}
