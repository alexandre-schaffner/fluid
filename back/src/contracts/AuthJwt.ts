export interface AuthJwt {
  jti: string; // jwt id
  sub: string; // user id
  expiresIn: string; // 15min
  tokenType: string; // access_token | refresh_token
}
