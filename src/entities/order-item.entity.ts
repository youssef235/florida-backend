import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from './order.entity';
import { PriceTag } from './price-tag.entity';
import { Product } from './product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order!: Order;

  @ManyToOne(() => Product, { eager: false })
  product!: Product;

  @ManyToOne(() => PriceTag, { eager: false, nullable: true, onDelete: 'SET NULL' })
  priceTag!: PriceTag | null;

  @Column({ type: 'double precision' })
  price!: number;

  @Column({ type: 'int' })
  quantity!: number;

  // ← إضافات جديدة
  @Column({ nullable: true })
  size?: string;

  @Column({ nullable: true })
  color?: string;
}