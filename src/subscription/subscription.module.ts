import { Global, Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '@src/schema/organization.entity';
import { Cinema } from '@src/schema/cinema.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Organization, Cinema])],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
