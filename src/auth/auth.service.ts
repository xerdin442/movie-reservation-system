import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/schema/user.entity';
import { Queue } from 'bull';
import { EntityManager, Repository } from 'typeorm';
import { InitiateAuthDto, VerifyLoginDto, VerifySignupDto } from './dto';
import { connectToRedis } from '@src/common/config/redis';
import { Secrets } from '@src/common/secrets';
import { RedisClientType } from 'redis';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';
import { UserRole } from '@src/db/enums';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly entityManager: EntityManager,
    @InjectQueue('auth-queue') private readonly authQueue: Queue,
    private readonly jwtService: JwtService,
  ) {}

  async initiateSignup(dto: InitiateAuthDto): Promise<void> {
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

      // Retrieve email using valid verification code
      const email = JSON.parse(verificationCode) as string;

      // Generate MFA secret
      const secret = speakeasy.generateSecret({
        name: `${Secrets.APP_NAME}:${email}`,
      });

      // Create new Executive
      const user = new User({
        email,
        mfaSecret: secret.base32,
        role: UserRole.EXECUTIVE,
      });
      await this.entityManager.save(user);

      // Create a QRcode image with the generated MFA secret
      const qrcode = await qrCode.toDataURL(secret.otpauth_url as string, {
        errorCorrectionLevel: 'high',
      });

      return { qrcode, email };
    } catch (error) {
      throw error;
    } finally {
      redis.destroy();
    }
  }

  async initiateLogin(
    dto: InitiateAuthDto,
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
        // Check if MFA token is valid
        const isValidToken = speakeasy.totp.verify({
          secret: user.mfaSecret!,
          token: dto.token,
          encoding: 'base32',
        });

        if (!isValidToken) {
          throw new BadRequestException('Invalid MFA token. Please try again');
        }
      } else {
        // Verify staff password
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
