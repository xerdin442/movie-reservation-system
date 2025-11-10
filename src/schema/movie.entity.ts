import { MovieGenre, MovieStatus } from '@src/common/enums';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Cinema } from './cinema.entity';
import { Showtime } from './showtime.entity';
import { AbstractEntity } from '@src/db/abstract.entity';

@Entity()
export class Movie extends AbstractEntity<Movie> {
  @Column()
  title: string;

  @Column({ type: 'longtext' })
  synopsis: string;

  @Column({ type: 'simple-array', enum: MovieGenre })
  genre: MovieGenre[];

  @Column({ nullable: true })
  trailer: string;

  @Column({ default: 0 })
  rating: number;

  @Column({ type: 'simple-array' })
  cast: string[];

  @Column()
  poster: string;

  @Column()
  ticketPrice: number;

  @Column({ nullable: true })
  discountPrice: number;

  @Column({ type: 'enum', enum: MovieStatus })
  status: MovieStatus;

  @ManyToOne(() => Cinema, (cinema) => cinema.movies, { onDelete: 'CASCADE' })
  cinema: Cinema;

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];
}
