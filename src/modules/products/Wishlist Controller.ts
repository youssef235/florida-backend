import { Controller, Post, Delete, Get, Body, Param } from '@nestjs/common';
import { AddWishlistDto } from './dto/add-wishlist.dto';
import { WishlistService } from './Wishlist Service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // userId هتجيبه من JWT (Auth Guard لاحقاً)
  @Post(':userId')
  add(
    @Param('userId') userId: string,
    @Body() dto: AddWishlistDto,
  ) {
    return this.wishlistService.add(userId, dto.productId);
  }

  @Delete(':userId/:productId')
  remove(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.remove(userId, productId);
  }

  @Get(':userId')
  get(@Param('userId') userId: string) {
    return this.wishlistService.get(userId);
  }
}