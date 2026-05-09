import { registerAs } from '@nestjs/config';

/**
 * Registered configuration namespace for application-wide settings (e.g. NODE_ENV)
 */
export default registerAs('app', () => ({
  environment: process.env.NODE_ENV ?? 'production',
}));
