import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  nameEn?: string;

  @Column({ type: 'text', nullable: true })
  image?: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products!: Product[];
}