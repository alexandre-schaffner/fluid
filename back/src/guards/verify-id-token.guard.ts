import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { LoginTicket, TokenPayload } from 'google-auth-library';
import { googleClient } from 'src/GoogleClient/googleClient';

import constants from '../../constants.json';

@Injectable()
export class verifyIdTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { body } = request;
      const cookieCSRFToken = request.cookies['g_csrf_token'];

      if (!cookieCSRFToken) return false;

      if (cookieCSRFToken !== body.g_csrf_token) return false;

      const ticket: LoginTicket = await googleClient.verifyIdToken({
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
