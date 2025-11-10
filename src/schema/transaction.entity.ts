import { Column, Entity } from 'typeorm';
import {
  TransactionMethod,
  TransactionSource,
  TransactionStatus,
} from '@src/common/enums';
import { AbstractEntity } from '@src/db/abstract.entity';

@Entity()
export class Transaction extends AbstractEntity<Transaction> {
  @Column()
  amount: number;

  @Column({ nullable: true, unique: true })
  txIdentifier: string;

  @Column()
  sourceId: number;

  @Column()
  date: number;

  @Column({ type: 'enum', enum: TransactionMethod })
  method: TransactionMethod;

  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus;

  @Column({ type: 'enum', enum: TransactionSource })
  source: TransactionSource;
}
