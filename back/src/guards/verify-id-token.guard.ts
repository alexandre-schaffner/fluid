import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { LoginTicket, TokenPayload } from 'google-auth-library';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class verifyIdTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const googleAuthClient = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI,
      );

      const request = context.switchToHttp().getRequest();
      const { body } = request;

      const ticket: LoginTicket = await googleAuthClient.verifyIdToken({
        idToken: body.credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload: TokenPayload | undefined = ticket.getPayload();

      request.googleJwt = payload;

      return true;
    } catch (err: unknown) {
      console.error(err);
      return false;
    }
  }
}
