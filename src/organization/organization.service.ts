import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { connectToRedis } from '@src/common/config/redis';
import { Secrets } from '@src/common/secrets';
import { Organization } from '@src/schema/organization.entity';
import { Queue } from 'bull';
import { RedisClientType } from 'redis';
import { Repository } from 'typeorm';
import { SignupDto, VerifySignupDto } from './dto';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectQueue('organization-queue')
    private readonly organizationQueue: Queue,
  ) {}

  async signup(dto: SignupDto): Promise<void> {
    try {
      // Send verification email to new user
      await this.organizationQueue.add('signup', dto);

      return;
    } catch (error) {
      throw error;
    }
  }

  async verifySignup(
    dto: VerifySignupDto,
  ): Promise<{ qrcode: string; email: string }> {
    // Initialize Redis connection
    const redis: RedisClientType = await connectToRedis(
      Secrets.REDIS_URL,
      'Signup Verification',
      Secrets.VERIFICATION_CODE_STORE_INDEX,
    );

    try {
      const verificationCode = await redis.get(dto.code);
      if (!verificationCode) {
        throw new BadRequestException('Invalid code. Please try again.');
      }

      // Retrieve organization details using valid verification code
      const details = JSON.parse(verificationCode) as {
        email: string;
        name: string;
      };

      // Generate MFA secret
      const secret = speakeasy.generateSecret({
        name: `${Secrets.APP_NAME}:${details.email}`,
      });

      // Create new organization
      const organization = this.organizationRepository.create({
        ...details,
        mfASecret: secret.base32,
      });
      await this.organizationRepository.save(organization);

      // Create a QRcode image with the generated MFA secret
      const qrcode = await qrCode.toDataURL(secret.otpauth_url as string, {
        errorCorrectionLevel: 'high',
      });

      return { qrcode, email: details.email };
    } catch (error) {
      throw error;
    } finally {
      redis.destroy();
    }
  }
}
