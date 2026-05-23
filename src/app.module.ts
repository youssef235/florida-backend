import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { CartItem } from './entities/cart-item.entity';
import { Category } from './entities/category.entity';
import { DeliveryInfo } from './entities/delivery-info.entity';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { PriceTag } from './entities/price-tag.entity';
import { Product } from './entities/product.entity';
import { User } from './entities/user.entity';
import { Banner } from './entities/banner.entity';

import { AuthModule } from './modules/auth/auth.module';
import { CartsModule } from './modules/carts/carts.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DeliveryInfoModule } from './modules/delivery-info/delivery-info.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { AdminModule } from './modules/admin/admin.module';
import { BannerModule } from './modules/banner/banner.module';
import { WishlistModule } from './modules/products/Wishlist Module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public', 'admin'),
      serveRoot: '/old-admin',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'aws-0-eu-west-1.pooler.supabase.com',
      port: 5432,
      username: 'postgres.ejvjcbxvdagozzgvykgj',
      password: 'FlutterDeveloper_1',
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      entities: [
        User,
        Category,
        Product,
        PriceTag,
        CartItem,
        DeliveryInfo,
        Order,
        OrderItem,
        Banner,
      ],
      synchronize: true,
    }),

    AuthModule,
    CategoriesModule,
    ProductsModule,
    CartsModule,
    DeliveryInfoModule,
    OrdersModule,
    AdminModule,
    WishlistModule,
    BannerModule,
  ],
})
export class AppModule {}