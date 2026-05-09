import { registerAs } from '@nestjs/config';

/**
 * Registered configuration namespace for user module settings (e.g. scope key from env)
 */
export default registerAs('user', () => ({
  scopeKey: process.env.USER_SCOPE_KEY,
}));
