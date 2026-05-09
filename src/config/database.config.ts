import { registerAs } from '@nestjs/config';

/**
 * Registered configuration namespace for PostgreSQL connection and TypeORM sync flags
 */
export default registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === 'true' ? true : false,
  autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === 'true' ? true : false,
}));
