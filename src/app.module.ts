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

    // OLD HTML/CSS/JS DASHBOARD
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public', 'admin'),
      serveRoot: '/old-admin',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        host: config.get<string>('DB_HOST', 'localhost'),

        port: Number(
          config.get<string>('DB_PORT', '5432'),
        ),

        username: config.get<string>(
          'DB_USER',
          'postgres',
        ),

        password: config.get<string>(
          'DB_PASSWORD',
          'postgres',
        ),

        database: config.get<string>(
          'DB_NAME',
          'eshop',
        ),

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

        synchronize:
          config.get<string>(
            'DB_SYNC',
            'true',
          ) === 'true',
      }),
    }),

    AuthModule,

    CategoriesModule,

    ProductsModule,

    CartsModule,

    DeliveryInfoModule,

    OrdersModule,

    AdminModule,

    WishlistModule,

    BannerModule

  ],
})
export class AppModule {}