import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { mapOrder } from '../../common/mappers';
import { DeliveryInfo } from '../../entities/delivery-info.entity';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { PriceTag } from '../../entities/price-tag.entity';
import { Product } from '../../entities/product.entity';
import { User } from '../../entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(PriceTag)
    private readonly priceTagsRepository: Repository<PriceTag>,
    @InjectRepository(DeliveryInfo)
    private readonly deliveryInfoRepository: Repository<DeliveryInfo>,
  ) {}

  // ✅ للمستخدم المسجل
  async getOrders(user: User) {
    const orders = await this.ordersRepository.find({
      where: { user: { id: user.id } },
      relations: {
        deliveryInfo: true,
        orderItems: {
          product: { priceTags: true, categories: true },
          priceTag: { product: true },
        },
      },
      order: { createdAt: 'DESC' },
    });

    return orders.map(mapOrder);
  }

  // ✅ جديد: للـ Guest - البحث برقم الهاتف
  async getGuestOrders(contactNumber: string) {
    const orders = await this.ordersRepository.find({
      where: {
        isGuest: true,
        deliveryInfo: { contactNumber },
      },
      relations: {
        deliveryInfo: true,
        orderItems: {
          product: { priceTags: true, categories: true },
          priceTag: { product: true },
        },
      },
      order: { createdAt: 'DESC' },
    });

    return orders.map(mapOrder);
  }

  async createOrder(user: User | null, payload: CreateOrderDto) {
    const deliveryInfo = this.deliveryInfoRepository.create({
      ...payload.deliveryInfo,
      user,
    });
    await this.deliveryInfoRepository.save(deliveryInfo);

    const orderItems: OrderItem[] = [];

    for (const item of payload.orderItems) {
      const product = await this.productsRepository.findOne({
        where: { id: item.product },
        relations: { priceTags: true, categories: true },
      });
      const priceTag = await this.priceTagsRepository.findOne({
        where: { id: item.priceTag },
        relations: { product: true },
      });

      if (!product || !priceTag) {
        throw new BadRequestException('Invalid order item');
      }

      const orderItem = this.orderItemsRepository.create({
        product,
        priceTag,
        price: item.price,
        quantity: item.quantity,
        size: item.size,    // ✅ أضفنا الحقول الجديدة
        color: item.color,
      });

      orderItems.push(orderItem);
    }

    const order = this.ordersRepository.create({
      user,
      deliveryInfo,
      discount: payload.discount ?? 0,
      orderStatus: 0,
      isGuest: payload.isGuest ?? true,
      paymentMethod: payload.paymentMethod,  // ✅ أضفنا paymentMethod
      totalAmount: payload.totalAmount,      // ✅ أضفنا totalAmount
      orderItems,
    });

    orderItems.forEach((item) => { item.order = order; });

    const saved = await this.ordersRepository.save(order);

    const hydrated = await this.ordersRepository.findOne({
      where: { id: saved.id },
      relations: {
        deliveryInfo: true,
        orderItems: {
          product: { priceTags: true, categories: true },
          priceTag: { product: true },
        },
      },
    });

    return mapOrder(hydrated ?? saved as Order);
  }
}