import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Screen } from './screen.entity';
import { Movie } from './movie.entity';
import { Reservation } from './reservation.entity';
import { AbstractEntity } from '@src/db/abstract.entity';

@Entity()
export class Showtime extends AbstractEntity<Showtime> {
  @Column({ type: 'datetime' })
  time: Date;

  @Column({ type: 'simple-array' })
  reservedSeats: string[];

  @Column({ default: false })
  soldOut: boolean;

  @ManyToOne(() => Screen, (screen) => screen.showtimes, {
    onDelete: 'CASCADE',
    eager: true,
  })
  screen: Screen;

  @ManyToOne(() => Movie, (movie) => movie.showtimes, {
    onDelete: 'CASCADE',
    eager: true,
  })
  movie: Movie;

  @OneToMany(() => Reservation, (reservation) => reservation.showtime)
  reservations: Reservation[];
}
