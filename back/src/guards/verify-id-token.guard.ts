import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { LoginTicket, TokenPayload } from 'google-auth-library';
import { OAuth2Client } from 'google-auth-library';
import constants from '../../constants.json';

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
      const { body, cookies } = request;
      const cookieCSRFToken = cookies['g_csrf_token'];

      if (!cookieCSRFToken) {
        console.error('No CSRF token in cookie');
        return false;
      }

      if (cookieCSRFToken !== body.g_csrf_token) {
        console.error('CSRF token mismatch');
        return false;
      }

      const ticket: LoginTicket = await googleAuthClient.verifyIdToken({
        idToken: body.credential,
        audience: constants.googleClientId,
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
