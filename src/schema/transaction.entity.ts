import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  TransactionMethod,
  TransactionSource,
  TransactionStatus,
} from '@src/common/enums';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ nullable: true })
  txIdentifier: string;

  @Column()
  sourceId: number;

  @Column({ type: 'enum', enum: TransactionMethod })
  method: TransactionMethod;

  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus;

  @Column({ type: 'enum', enum: TransactionSource })
  source: TransactionSource;

  constructor(transaction: Partial<Transaction>) {
    Object.assign(this, transaction);
  }
}
