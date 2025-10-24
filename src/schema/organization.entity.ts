import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cinema } from './cinema.entity';
import { SubscriptionStatus, SubscriptionTier } from '@src/common/enums';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  mfASecret: string;

  @Column({ type: 'enum', enum: SubscriptionStatus })
  subscriptionStatus: SubscriptionStatus;

  @Column({ type: 'enum', enum: SubscriptionTier })
  subscriptionTier: SubscriptionTier;

  @OneToMany(() => Cinema, (cinema) => cinema.organization)
  cinemas: Cinema[];

  constructor(organization: Partial<Organization>) {
    Object.assign(this, organization);
  }
}
