import { Global, Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { BullModule } from '@nestjs/bull';
import { PaymentsProcessor } from './payments.processor';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'payments-queue',
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsProcessor],
  exports: [PaymentsService],
})
export class PaymentsModule {}
