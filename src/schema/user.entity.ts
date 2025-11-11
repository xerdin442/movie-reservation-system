import { AbstractEntity } from '@src/db/abstract.entity';
import { UserRole } from '@src/db/enums';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Cinema } from './cinema.entity';
import { Organization } from './organization.entity';

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

  @OneToOne(() => Cinema, { nullable: true })
  @JoinColumn()
  cinema?: Cinema;

  @OneToOne(() => Organization, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;
}
