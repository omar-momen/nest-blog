/**
 * JWT access token claims issued at sign-in (see AuthService.signin).
 */
export interface AccessTokenPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
