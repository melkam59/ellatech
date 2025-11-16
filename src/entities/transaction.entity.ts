import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

export enum TransactionType {
  ADJUSTMENT = 'ADJUSTMENT',
  RESTOCK = 'RESTOCK',
  SALE = 'SALE',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'uuid', name: 'user_id', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.ADJUSTMENT,
  })
  type: TransactionType;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'integer', name: 'previous_quantity' })
  previousQuantity!: number;

  @Column({ type: 'integer', name: 'new_quantity' })
  newQuantity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
