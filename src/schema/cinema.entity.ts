import { SubscriptionStatus, SubscriptionTier } from '@src/common/enums';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './movie.entity';
import { Screen } from './screen.entity';
import { Staff } from './staff.entity';
import { Membership } from './membership.entity';

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

  @Column({ default: 0 })
  balance: number;

  @Column({ type: 'simple-array' })
  membershipPlans: string[];

  @Column({ type: 'enum', enum: SubscriptionStatus })
  subscriptionStatus: SubscriptionStatus;

  @Column({ type: 'enum', enum: SubscriptionTier })
  subscriptionTier: SubscriptionTier;

  @Column({ default: false })
  allowMembership: boolean;

  @Column({ default: false })
  allowUsdcPayments: boolean;

  @OneToMany(() => Movie, (movie) => movie.cinema)
  movies: Movie[];

  @OneToMany(() => Screen, (screen) => screen.cinema)
  screens: Screen[];

  @OneToMany(() => Staff, (staff) => staff.cinema)
  staff: Staff[];

  @OneToMany(() => Membership, (membership) => membership.cinema)
  memberships: Membership[];

  constructor(cinema: Partial<Cinema>) {
    Object.assign(this, cinema);
  }
}
