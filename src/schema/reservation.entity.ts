import { ReservationStatus } from '@src/common/enums';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Showtime } from './showtime.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  accessKey: string;

  @Column()
  amount: number;

  @Column({ type: 'simple-array' })
  seatNumbers: string[];

  @Column()
  numberOfTickets: number;

  @Column({ type: 'enum', enum: ReservationStatus })
  status: ReservationStatus;

  @ManyToOne(() => Showtime, (showtime) => showtime.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  showtime: Showtime;

  constructor(reservation: Partial<Reservation>) {
    Object.assign(this, reservation);
  }
}
