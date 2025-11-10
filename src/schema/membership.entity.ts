import { Column, Entity, ManyToOne } from 'typeorm';
import { Cinema } from './cinema.entity';
import { AbstractEntity } from '@src/db/abstract.entity';

@Entity()
export class Membership extends AbstractEntity<Membership> {
  @Column({ unique: true })
  email: string;

  @Column()
  amount: number;

  @Column({ type: 'datetime' })
  expirationDate: Date;

  @Column()
  subscriptionId: string;

  @ManyToOne(() => Cinema, (cinema) => cinema.memberships, {
    onDelete: 'CASCADE',
  })
  cinema: Cinema;
}
