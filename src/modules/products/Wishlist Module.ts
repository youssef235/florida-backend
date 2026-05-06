import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../../entities/user.entity';
import { Product } from '../../entities/product.entity';
import { WishlistController } from './Wishlist Controller';
import { WishlistService } from './Wishlist Service';


@Module({
  imports: [TypeOrmModule.forFeature([User, Product])],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}