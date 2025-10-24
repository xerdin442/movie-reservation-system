import { Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Injectable()
@Processor('payments-queue')
export class PaymentsProcessor {
  private readonly context: string = PaymentsProcessor.name;

  constructor(private readonly paymentsService: PaymentsService) {}
}
