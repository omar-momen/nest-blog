import { registerAs } from '@nestjs/config';

/**
 * Registered configuration namespace for JWT settings
 */
export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
  accessTokenTTL: Number(process.env.JWT_ACCESS_TOKEN_TTL) || 3600,
  refreshTokenTTL: Number(process.env.JWT_REFRESH_TOKEN_TTL) || 86400,

  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
}));
