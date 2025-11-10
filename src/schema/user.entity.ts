import { AbstractEntity } from '@src/db/abstract.entity';
import { StaffRole } from '@src/db/enums';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({ unique: true })
  email: string;

  @Column({ select: false, unique: true, nullable: true })
  mfASecret?: string;

  @Column({ select: false, nullable: true })
  password?: string;

  @Column({ type: 'enum', enum: StaffRole })
  role: StaffRole;
}
