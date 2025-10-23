import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { BullModule } from '@nestjs/bull';
import { OrganizationProcessor } from './organization.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'orgnaization-queue',
    }),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationProcessor],
})
export class OrganizationModule {}
