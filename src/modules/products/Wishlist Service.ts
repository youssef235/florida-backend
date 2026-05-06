import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../entities/user.entity';
import { Product } from '../../entities/product.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  // =====================
  // ADD TO WISHLIST
  // =====================
  async add(userId: string, productId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['wishlist'],
    });

    if (!user) throw new NotFoundException('User not found');

    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Product not found');

    const exists = user.wishlist?.some((p) => p.id === productId);

    if (!exists) {
      user.wishlist = [...(user.wishlist || []), product];
      await this.userRepo.save(user);
    }

    return { message: 'Added to wishlist' };
  }

  // =====================
  // REMOVE FROM WISHLIST
  // =====================
  async remove(userId: string, productId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['wishlist'],
    });

    if (!user) throw new NotFoundException('User not found');

    user.wishlist = user.wishlist.filter((p) => p.id !== productId);

    await this.userRepo.save(user);

    return { message: 'Removed from wishlist' };
  }

  // =====================
  // GET WISHLIST
  // =====================
  async get(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: [
        'wishlist',
        'wishlist.categories',
        'wishlist.priceTags',
      ],
    });

    if (!user) throw new NotFoundException('User not found');

    return user.wishlist;
  }
}