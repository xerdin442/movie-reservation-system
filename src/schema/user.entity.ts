import { AbstractEntity } from '@src/db/abstract.entity';
import { UserRole } from '@src/db/enums';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({ unique: true })
  email: string;

  @Column({ select: false, unique: true, nullable: true })
  mfaSecret?: string;

  @Column({ select: false, nullable: true })
  password?: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;
}
