import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cinema } from './cinema.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  mfASecret: string;

  @OneToMany(() => Cinema, (cinema) => cinema.organization)
  cinemas: Cinema[];

  constructor(organization: Partial<Organization>) {
    Object.assign(this, organization);
  }
}
