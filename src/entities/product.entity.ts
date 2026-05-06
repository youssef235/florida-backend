import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from './category.entity';
import { PriceTag } from './price-tag.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text', array: true })
  images!: string[];

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({ name: 'product_categories' })
  categories!: Category[];

  @OneToMany(() => PriceTag, (priceTag) => priceTag.product, { cascade: true })
  priceTags!: PriceTag[];

  // 🔥 NEW FIELDS (مهمة جدًا للهوم + الفلترة)

  @Column({ type: 'boolean', default: false })
  isFeatured!: boolean;

  @Column({ type: 'boolean', default: false })
  hasDiscount!: boolean;

  @Column({ type: 'varchar', nullable: true })
  season!: 'summer' | 'winter' | null;

  // 📅 تواريخ (موجودة عندك)
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}