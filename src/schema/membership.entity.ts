import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cinema } from './cinema.entity';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

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
  @JoinColumn({ name: 'id' })
  cinema: Cinema;

  constructor(membership: Partial<Membership>) {
    Object.assign(this, membership);
  }
}
