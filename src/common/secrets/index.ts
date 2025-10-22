import { ConfigService } from '@nestjs/config';

// Initialize Config Service
const config = new ConfigService();

export const Secrets = {
  PORT: config.getOrThrow<number>('PORT'),
  NODE_ENV: config.getOrThrow<string>('NODE_ENV'),
  MYSQL_HOST: config.getOrThrow<string>('MYSQL_HOST'),
  MYSQL_PORT: config.getOrThrow<number>('MYSQL_PORT'),
  MYSQL_USERNAME: config.getOrThrow<string>('MYSQL_USERNAME'),
  MYSQL_ROOT_PASSWORD: config.getOrThrow<string>('MYSQL_ROOT_PASSWORD'),
  MYSQL_DATABASE: config.getOrThrow<string>('MYSQL_DATABASE'),
  JWT_SECRET: config.getOrThrow<string>('JWT_SECRET'),
  REDIS_PORT: config.getOrThrow<number>('REDIS_PORT'),
  REDIS_HOST: config.getOrThrow<string>('REDIS_HOST'),
  REDIS_PASSWORD: config.getOrThrow<string>('REDIS_PASSWORD'),
  REDIS_URL: config.getOrThrow<string>('REDIS_URL'),
  QUEUE_STORE_INDEX: config.getOrThrow<number>('QUEUE_STORE_INDEX'),
  SESSION_STORE_INDEX: config.getOrThrow<number>('SESSION_STORE_INDEX'),
  IDEMPOTENCY_KEYS_STORE_INDEX: config.getOrThrow<number>(
    'IDEMPOTENCY_KEYS_STORE_INDEX',
  ),
  SOCIAL_AUTH_STORE_INDEX: config.getOrThrow<number>('SOCIAL_AUTH_STORE_INDEX'),
  DEFAULT_IMAGE: config.getOrThrow<string>('DEFAULT_IMAGE'),
  RESEND_EMAIL_API_KEY: config.getOrThrow<string>('RESEND_EMAIL_API_KEY'),
  APP_NAME: config.getOrThrow<string>('APP_NAME'),
  APP_EMAIL: config.getOrThrow<string>('APP_EMAIL'),
  RATE_LIMIT_PER_SECOND: config.getOrThrow<number>('RATE_LIMIT_PER_SECOND'),
  RATE_LIMIT_PER_MINUTE: config.getOrThrow<number>('RATE_LIMIT_PER_MINUTE'),
  GOOGLE_CLIENT_ID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
  GOOGLE_CALLBACK_URL: config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
  SOCIAL_AUTH_PASSWORD: config.getOrThrow<string>('SOCIAL_AUTH_PASSWORD'),
};
