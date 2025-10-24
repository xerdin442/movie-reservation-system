import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { BullModule } from '@nestjs/bull';
import { OrganizationProcessor } from './organization.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '@src/schema/organization.entity';
import { AuthModule } from '@src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    BullModule.registerQueue({
      name: 'orgnaization-queue',
    }),
    TypeOrmModule.forFeature([Organization]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationProcessor],
})
export class OrganizationModule {}
