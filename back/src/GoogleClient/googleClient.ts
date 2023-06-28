import { OAuth2Client } from 'google-auth-library';

import constants from '../../constants.json';

export const googleClient: OAuth2Client = new OAuth2Client(
  constants.googleClientId,
);
