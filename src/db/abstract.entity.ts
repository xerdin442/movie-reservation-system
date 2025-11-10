import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AbstractEntity<T> {
  @PrimaryGeneratedColumn()
  id: number;

  constructor(admin: Partial<T>) {
    Object.assign(this, admin);
  }
}
