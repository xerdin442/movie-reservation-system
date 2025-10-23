import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { sendEmail } from '@src/common/config/mail';
import { connectToRedis } from '@src/common/config/redis';
import logger from '@src/common/logger';
import { Secrets } from '@src/common/secrets';
import { Job } from 'bull';
import { RedisClientType } from 'redis';

@Injectable()
@Processor('organization-queue')
export class OrganizationProcessor {
  private readonly context: string = OrganizationProcessor.name;

  @Process('signup')
  async signup(job: Job<Record<string, string>>): Promise<void> {
    // Initialize Redis connection
    const redis: RedisClientType = await connectToRedis(
      Secrets.REDIS_URL,
      'Signup Verification',
      Secrets.VERIFICATION_CODE_STORE_INDEX,
    );

    try {
      const verificationCode = `${Math.random() * 10 ** 16}`.slice(3, 9);
      const content = `Here's the verification code to complete your registration process: ${verificationCode}
        This code is only valid for the next 10 minutes.`;

      // Store the verification code in Redis cache for the next 10mins
      await redis.setEx(verificationCode, 600, JSON.stringify(job.data));
      // Send verification mail to new user
      await sendEmail(job.data.email, 'Verification Email', content);

      return;
    } catch (error) {
      logger.error(
        `[${this.context}] An error occured while processing signup verification email. Error: ${error.message}\n`,
      );

      throw error;
    } finally {
      redis.destroy();
    }
  }
}
