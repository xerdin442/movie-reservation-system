import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organization } from './organization.entity';

@Entity()
export class EnterpriseTier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  staffPerCinema: number;

  @Column()
  screensPerCinema: number;

  @Column()
  cinemasPerOrganization: number;

  @OneToOne(() => Organization, (organization) => organization.enterpriseTier, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  organization: Organization;

  constructor(enterpriseTier: Partial<EnterpriseTier>) {
    Object.assign(this, enterpriseTier);
  }
}
