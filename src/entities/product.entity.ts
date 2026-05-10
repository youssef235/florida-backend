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
import { User } from './user.entity';

export interface ProductColor {
  name: string;
  hex: string;
}

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

  @Column({ type: 'text', array: true, default: '{}' })
  sizes!: string[];

  @Column({ type: 'jsonb', default: '[]' })
  colors!: ProductColor[];

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({
    name: 'product_categories',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories!: Category[];

  @OneToMany(() => PriceTag, (priceTag) => priceTag.product, { cascade: true })
  priceTags!: PriceTag[];

  @Column({ type: 'boolean', default: false })
  isFeatured!: boolean;

  @Column({ type: 'boolean', default: false })
  hasDiscount!: boolean;

  @Column({ type: 'varchar', nullable: true })
  season!: 'summer' | 'winter' | null;

  @ManyToMany(() => User, (user) => user.wishlist)
  wishlistUsers!: User[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}