import { SubscriptionStatus, SubscriptionTier } from '@src/common/types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cinema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  apiKey: string;

  @Column()
  acctNumber: string;

  @Column()
  acctName: string;

  @Column()
  bankName: string;

  @Column()
  balance: number;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
  })
  subscriptionStatus: SubscriptionStatus;

  @Column({
    type: 'enum',
    enum: SubscriptionTier,
  })
  subscriptionTier: SubscriptionTier;

  @Column({ default: false })
  allowSubscriptions: boolean;

  @Column({ default: false })
  allowUsdcPayments: boolean;

  constructor(cinema: Partial<Cinema>) {
    Object.assign(this, cinema);
  }
}
