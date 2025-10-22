import { MovieGenre, MovieStatus } from '@src/common/enums';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cinema } from './cinema.entity';
import { Showtime } from './showtime.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

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
  @JoinColumn({ name: 'id' })
  cinema: Cinema;

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];

  constructor(movie: Partial<Movie>) {
    Object.assign(this, movie);
  }
}
