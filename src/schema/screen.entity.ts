import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Cinema } from './cinema.entity';
import { Showtime } from './showtime.entity';
import { AbstractEntity } from '@src/db/abstract.entity';

@Entity()
export class Screen extends AbstractEntity<Screen> {
  @Column({ unique: true })
  identifier: string;

  @Column()
  numberOfSeats: number;

  @ManyToOne(() => Cinema, (cinema) => cinema.screens, { onDelete: 'CASCADE' })
  cinema: Cinema;

  @OneToMany(() => Showtime, (showtime) => showtime.screen)
  showtimes: Showtime[];
}
