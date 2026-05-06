import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, IsNull } from 'typeorm';

import { CartItem } from '../../entities/cart-item.entity';
import { Product } from '../../entities/product.entity';
import { PriceTag } from '../../entities/price-tag.entity';
import { User } from '../../entities/user.entity';

import { AddToCartDto } from './dto/add-to-cart.dto';
import { SyncCartDto } from './dto/sync-cart.dto';

import { mapCartItem } from '../../common/mappers';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(PriceTag)
    private readonly priceTagsRepository: Repository<PriceTag>,
  ) {}

 async addToCart(user: User, payload: AddToCartDto) {
    // 1. التأكد من وجود المنتج والـ priceTag
    const product = await this.productsRepository.findOne({ where: { id: payload.product } });
    const priceTag = await this.priceTagsRepository.findOne({ where: { id: payload.priceTag } });

    if (!product || !priceTag) {
      throw new BadRequestException('Product or Price Tag not found');
    }

    // 2. البحث: هل هذا المستخدم لديه نفس المنتج بنفس السعر في السلة؟
let cartItem = await this.cartRepository.findOne({
  where: {
    user: { id: user.id },
    product: { id: payload.product },
    priceTag: { id: payload.priceTag },
    size: payload.size ?? IsNull(),    // ✅
    color: payload.color ?? IsNull(),  // ✅
  },
});

    if (cartItem) {
      // ✅ تحديث الكمية فقط إذا كان موجوداً
      cartItem.quantity += payload.quantity ?? 1;
    } else {
      // ✅ إنشاء سطر جديد إذا لم يكن موجوداً
      // وعند الإنشاء كمان
cartItem = this.cartRepository.create({
  user,
  product,
  priceTag,
  quantity: payload.quantity ?? 1,
  size: payload.size,    // ✅
  color: payload.color,  // ✅
});
    }

    await this.cartRepository.save(cartItem);
    
    // إرجاع السلة كاملة محدثة لضمان مزامنة الفرونت إند
    return this.getUserCart(user);
  }

  async getUserCart(user: User) {
    const cartItems = await this.cartRepository.find({
      where: { user: { id: user.id } },
      relations: {
        product: { priceTags: true, categories: true },
        priceTag: true,
        
      },
      
    });
    return cartItems.map(mapCartItem);
  }
  // =========================
  // 🟡 SYNC CART (MOBILE / FRONTEND CACHE)
  // =========================
async syncCart(user: User, payload: SyncCartDto) {
  return await this.cartRepository.manager.transaction(async (manager) => {
    // امسح داخل الـ transaction
    await manager.delete(CartItem, { user: { id: user.id } });

    for (const item of payload.data) {
      const product = await this.productsRepository.findOne({
        where: { id: item.product },
      });
      const priceTag = await this.priceTagsRepository.findOne({
        where: { id: item.priceTag },
      });

      if (!product || !priceTag) continue;

      await manager.save(CartItem, {
        user,
        product,
        priceTag,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      });
    }

    const refreshed = await manager.find(CartItem, {
      where: { user: { id: user.id } },
      relations: {
        product: { priceTags: true, categories: true },
        priceTag: true,
      },
    });

    return refreshed.map(mapCartItem);
  });
}
  // =========================
  // 🔵 GET USER CART (optional but useful)
  // =========================
  
  // =========================
  // 🔴 REMOVE ITEM
  // =========================
  async removeFromCart(user: User, cartItemId: string) {
    const item = await this.cartRepository.findOne({
      where: { id: cartItemId, user: { id: user.id } },
    });

    if (!item) {
      throw new BadRequestException('Cart item not found');
    }

    await this.cartRepository.delete({ id: cartItemId });

    return { success: true };
  }

  // =========================
  // 🟣 CLEAR CART
  // =========================
  async clearCart(user: User) {
    await this.cartRepository.delete({ user: { id: user.id } });

    return { success: true };
  }
}