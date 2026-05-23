import { registerAs } from '@nestjs/config';

/**
 * Registered configuration namespace for application-wide settings (e.g. NODE_ENV)
 */
export default registerAs('app', () => ({
  environment: process.env.NODE_ENV ?? 'production',
  apiVersion: process.env.API_VERSION ?? '0.1.1',

  aws: {
    publicBucketName: process.env.AWS_PUBLIC_BUCKET_NAME,
    region: process.env.AWS_REGION,
    cloudFrontUrl: process.env.AWS_CLOUD_FRONT_URL,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  },
}));
