import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Screen } from './screen.entity';
import { Movie } from './movie.entity';
import { Reservation } from './reservation.entity';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  time: Date;

  @ManyToOne(() => Screen, (screen) => screen.showtimes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  screen: Screen;

  @ManyToOne(() => Movie, (movie) => movie.showtimes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  movie: Movie;

  @OneToMany(() => Reservation, (reservation) => reservation.showtime)
  reservations: Reservation[];

  constructor(showtime: Partial<Showtime>) {
    Object.assign(this, showtime);
  }
}
