import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('home_banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  subTitle?: string;

  @Column()
  imageUrl!: string;
}