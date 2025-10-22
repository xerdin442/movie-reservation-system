import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cinema } from './cinema.entity';
import { StaffRole } from '@src/common/enums';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  mfASecret: string;

  @Column({ type: 'enum', enum: StaffRole })
  role: StaffRole;

  @ManyToOne(() => Cinema, (cinema) => cinema.staff, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  cinema: Cinema;

  constructor(staff: Partial<Staff>) {
    Object.assign(this, staff);
  }
}
