import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Secrets } from '@src/common/secrets';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthProcessor } from './auth.processor';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@src/schema/user.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: Secrets.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    BullModule.registerQueue({
      name: 'auth-queue',
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [JwtStrategy, AuthService, AuthProcessor],
  controllers: [AuthController],
})
export class AuthModule {}
