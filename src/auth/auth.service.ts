import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/schema/user.entity';
import { Queue } from 'bull';
import { EntityManager, Repository } from 'typeorm';
import { SignupDto, LoginDto, VerifyLoginDto, VerifySignupDto } from './dto';
import { connectToRedis } from '@src/common/config/redis';
import { Secrets } from '@src/common/secrets';
import { RedisClientType } from 'redis';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';
import { SubscriptionStatus, SubscriptionTier, UserRole } from '@src/db/enums';
import { randomUUID } from 'crypto';
import { Organization } from '@src/schema/organization.entity';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly entityManager: EntityManager,
    @InjectQueue('auth-queue') private readonly authQueue: Queue,
    private readonly jwtService: JwtService,
  ) {}

  async initiateSignup(dto: SignupDto): Promise<void> {
    try {
      // Send verification email to new user
      await this.authQueue.add('signup', dto);

      return;
    } catch (error) {
      throw error;
    }
  }

  async verifySignup(
    dto: VerifySignupDto,
  ): Promise<{ qrcode: string; email: string; token: string }> {
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

      // Retrieve email using valid verification code
      const { name, email } = JSON.parse(verificationCode) as {
        name: string;
        email: string;
      };

      // Generate MFA secret
      const secret = speakeasy.generateSecret({
        name: `${Secrets.APP_NAME}:${email}`,
      });

      // Create new executive user and organization profile
      const organization = new Organization({
        name,
        apiKey: 'key_' + randomUUID().split('-').slice(1).join(''),
        subscriptionTier: SubscriptionTier.FREE,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      });

      const user = new User({
        email,
        mfaSecret: secret.base32,
        role: UserRole.EXECUTIVE,
        organization,
      });

      await this.entityManager.save(user);

      // Create a QRcode image with the generated MFA secret
      const qrcode = await qrCode.toDataURL(secret.otpauth_url as string, {
        errorCorrectionLevel: 'high',
      });

      // Create and sign JWT payload
      const payload = { sub: user.id, role: user.role };
      const token = await this.jwtService.signAsync(payload);

      return { qrcode, email, token };
    } catch (error) {
      throw error;
    } finally {
      redis.destroy();
    }
  }

  async initiateLogin(
    dto: LoginDto,
  ): Promise<{ requestId: string; role: UserRole }> {
    // Initialize Redis connection
    const redis: RedisClientType = await connectToRedis(
      Secrets.REDIS_URL,
      'Login Verification',
      Secrets.AUTH_VERIFICATION_STORE_INDEX,
    );

    try {
      const user = await this.userRepo.findOne({
        where: { email: dto.email },
      });

      if (!user) {
        throw new BadRequestException('No user found with that email address');
      }

      // Generate and store request ID to verify login request
      const requestId = 'REQ-' + randomUUID().split('-').slice(1, 4).join('-');
      await redis.setEx(requestId, 600, dto.email);

      return { requestId, role: user.role };
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

      // Retrieve email using valid request ID
      const email = JSON.parse(data) as string;
      const user = await this.userRepo.findOneOrFail({
        where: { email },
      });

      if (user.role === UserRole.EXECUTIVE) {
        if (!dto.mfaToken) {
          throw new BadRequestException(
            'MFA token required to login user with Executive role.',
          );
        }

        // Check if MFA token is valid
        const isValidToken = speakeasy.totp.verify({
          secret: user.mfaSecret!,
          token: dto.mfaToken,
          encoding: 'base32',
        });

        if (!isValidToken) {
          throw new BadRequestException('Invalid MFA token. Please try again');
        }
      } else {
        if (!dto.password) {
          throw new BadRequestException(
            'Password required to login user with Admin or Staff role.',
          );
        }

        // Check if password is valid
        const checkPassword = await argon.verify(user.password!, dto.password);
        if (!checkPassword) {
          throw new BadRequestException('Invalid password. Please try again');
        }
      }

      // Create and sign JWT payload
      const payload = { sub: user.id, role: user.role };
      const token = await this.jwtService.signAsync(payload);

      return { email, token };
    } catch (error) {
      throw error;
    } finally {
      redis.destroy();
    }
  }
}
