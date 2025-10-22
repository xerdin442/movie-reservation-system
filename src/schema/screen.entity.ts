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
export class Screen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  identifier: string;

  @Column({ type: 'simple-array' })
  reservedSeats: number[];

  @ManyToOne(() => Cinema, (cinema) => cinema.screens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  cinema: Cinema;

  @OneToMany(() => Showtime, (showtime) => showtime.screen)
  showtimes: Showtime[];

  constructor(screen: Partial<Screen>) {
    Object.assign(this, screen);
  }
}
