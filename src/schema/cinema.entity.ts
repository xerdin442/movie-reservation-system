import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Movie } from './movie.entity';
import { Screen } from './screen.entity';
import { Membership } from './membership.entity';
import { Organization } from './organization.entity';
import { AbstractEntity } from '@src/db/abstract.entity';

@Entity()
export class Cinema extends AbstractEntity<Cinema> {
  @Column()
  name: string;

  @Column()
  accountNumber: string;

  @Column()
  accountName: string;

  @Column()
  bankName: string;

  @Column()
  recipientCode: string;

  @Column({ default: 0 })
  balance: number;

  @Column({ type: 'simple-array' })
  membershipPlans: string[];

  @Column()
  enableMembership: boolean;

  @Column()
  enableUsdcPayments: boolean;

  @OneToMany(() => Movie, (movie) => movie.cinema)
  movies: Movie[];

  @OneToMany(() => Screen, (screen) => screen.cinema)
  screens: Screen[];

  @OneToMany(() => Membership, (membership) => membership.cinema)
  memberships: Membership[];

  @ManyToOne(() => Organization, (organization) => organization.cinemas, {
    onDelete: 'CASCADE',
  })
  organization: Organization;
}
