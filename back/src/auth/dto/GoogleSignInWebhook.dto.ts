import { IsJWT, IsString } from 'class-validator';

export class GoogleSignInWebhookDto {
  @IsJWT()
  credential: string;

  @IsString()
  g_csrf_token: string;
}
