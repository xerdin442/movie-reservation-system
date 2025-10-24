import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { connectToRedis } from '@src/common/config/redis';
import { Secrets } from '@src/common/secrets';
import { Organization } from '@src/schema/organization.entity';
import { Queue } from 'bull';
import { RedisClientType } from 'redis';
import { Repository } from 'typeorm';
import { LoginDto, SignupDto, VerifyLoginDto, VerifySignupDto } from './dto';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';
import { SubscriptionStatus, SubscriptionTier } from '@src/common/enums';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectQueue('organization-queue')
    private readonly organizationQueue: Queue,
    private readonly jwtService: JwtService,
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
      Secrets.AUTH_VERIFICATION_STORE_INDEX,
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
        subscriptionTier: SubscriptionTier.FREE,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
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

  async login(dto: LoginDto): Promise<string> {
    // Initialize Redis connection
    const redis: RedisClientType = await connectToRedis(
      Secrets.REDIS_URL,
      'Login Verification',
      Secrets.AUTH_VERIFICATION_STORE_INDEX,
    );

    try {
      const organization = await this.organizationRepository.findOne({
        where: { email: dto.email },
      });

      if (!organization) {
        throw new BadRequestException(
          'No Organization profile exists with that email address',
        );
      }

      // Generate and store request ID to verify login request
      const requestId = randomUUID().split('-').slice(1, 4).join('-');
      await redis.setEx(requestId, 600, dto.email);

      return requestId;
    } catch (error) {
      throw error;
    } finally {
      redis.destroy();
    }
  }

  async verifyLogin(
    dto: VerifyLoginDto,
  ): Promise<{ token: string; email: string }> {
    // Initialize Redis connection
    const redis: RedisClientType = await connectToRedis(
      Secrets.REDIS_URL,
      'Login Verification',
      Secrets.AUTH_VERIFICATION_STORE_INDEX,
    );

    try {
      // Check if request ID is valid
      const data = await redis.get(dto.requestId);
      if (!data) {
        throw new BadRequestException('Invalid request ID');
      }

      // Retrieve Organization email from cache using valid request ID
      const email = JSON.parse(data) as string;
      const organization = await this.organizationRepository.findOneOrFail({
        where: { email },
      });

      // Check if MFA token is valid
      const isValidToken = speakeasy.totp.verify({
        secret: organization.mfASecret,
        token: dto.token,
        encoding: 'base32',
      });

      if (!isValidToken) {
        throw new BadRequestException('Invalid MFA token. Please try again');
      }

      // Create and sign JWT payload
      const payload = { sub: organization.id, role: 'organization' };

      return {
        email,
        token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw error;
    } finally {
      redis.destroy();
    }
  }
}
