import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Cinema } from './cinema.entity';
import { SubscriptionStatus, SubscriptionTier } from '@src/common/enums';
import { EnterpriseTier } from './enterprise-tier.entity';
import { AbstractEntity } from '@src/db/abstract.entity';

@Entity()
export class Organization extends AbstractEntity<Organization> {
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

  @OneToOne(() => EnterpriseTier, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  enterpriseTier: EnterpriseTier;
}
