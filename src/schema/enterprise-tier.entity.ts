import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@src/db/abstract.entity';

@Entity()
export class EnterpriseTier extends AbstractEntity<EnterpriseTier> {
  @Column()
  screensPerCinema: number;

  @Column()
  membersPerCinema: number;

  @Column()
  cinemasPerOrganization: number;
}
