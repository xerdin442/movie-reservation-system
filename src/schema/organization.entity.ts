import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Cinema } from './cinema.entity';
import { SubscriptionStatus, SubscriptionTier } from '@src/common/enums';
import { EnterpriseTier } from './enterprise-tier.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  apiKey: string;

  @Column({ select: false })
  mfASecret: string;

  @Column({ type: 'enum', enum: SubscriptionStatus })
  subscriptionStatus: SubscriptionStatus;

  @Column({ type: 'enum', enum: SubscriptionTier })
  subscriptionTier: SubscriptionTier;

  @OneToMany(() => Cinema, (cinema) => cinema.organization)
  cinemas: Cinema[];

  @OneToOne(
    () => EnterpriseTier,
    (enterpriseTier) => enterpriseTier.organization,
  )
  enterpriseTier: EnterpriseTier;

  constructor(organization: Partial<Organization>) {
    Object.assign(this, organization);
  }
}
