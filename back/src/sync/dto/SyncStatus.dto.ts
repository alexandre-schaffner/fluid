import { IsBoolean } from 'class-validator';

export class SyncStatusDto {
  @IsBoolean()
  sync: string;
}
