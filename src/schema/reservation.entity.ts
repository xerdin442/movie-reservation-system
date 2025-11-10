import { ReservationStatus } from '@src/db/enums';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Showtime } from './showtime.entity';
import { AbstractEntity } from '@src/db/abstract.entity';

@Entity()
export class Reservation extends AbstractEntity<Reservation> {
  @Column()
  email: string;

  @Column({ unique: true })
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
  showtime: Showtime;
}
