import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movie } from './movie.entity';
import { Screen } from './screen.entity';
import { Staff } from './staff.entity';
import { Membership } from './membership.entity';
import { Organization } from './organization.entity';

@Entity()
export class Cinema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  accountNumber: string;

  @Column()
  accountName: string;

  @Column()
  bankName: string;

  @Column({ default: 0 })
  balance: number;

  @Column({ type: 'simple-array' })
  membershipPlans: string[];

  @Column({ default: false })
  enableMembership: boolean;

  @Column({ default: false })
  enableUsdcPayments: boolean;

  @OneToMany(() => Movie, (movie) => movie.cinema)
  movies: Movie[];

  @OneToMany(() => Screen, (screen) => screen.cinema)
  screens: Screen[];

  @OneToMany(() => Staff, (staff) => staff.cinema)
  staff: Staff[];

  @OneToMany(() => Membership, (membership) => membership.cinema)
  memberships: Membership[];

  @ManyToOne(() => Organization, (organization) => organization.cinemas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  organization: Organization;

  constructor(cinema: Partial<Cinema>) {
    Object.assign(this, cinema);
  }
}
