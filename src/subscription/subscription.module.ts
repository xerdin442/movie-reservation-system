import { Global, Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnterpriseTier } from '@src/schema/enterprise-tier.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([EnterpriseTier])],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
