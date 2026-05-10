import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { mapAdminOrder } from '../../common/mappers';
import { Order } from '../../entities/order.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class AdminOrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  // ── helper مشترك لجلب طلب بكل relations ──
  private async fetchWithRelations(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        user: true,
        deliveryInfo: true,
        orderItems: {
          product: { priceTags: true, categories: true },
          priceTag: { product: true },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // ✅ findOne — يرجع { data: ... } عشان Refine يقراه صح
  async findOne(id: string) {
    const order = await this.fetchWithRelations(id);
    return { data: mapAdminOrder(order) };
  }

  async list() {
    const orders = await this.ordersRepository.find({
      relations: {
        user: true,
        deliveryInfo: true,
        orderItems: {
          product: { priceTags: true, categories: true },
          priceTag: { product: true },
        },
      },
      order: { createdAt: 'DESC' },
    });

    return { data: orders.map(mapAdminOrder) };
  }

  async updateStatus(id: string, payload: UpdateOrderStatusDto) {
    const order = await this.fetchWithRelations(id);
    order.orderStatus = payload.orderStatus;
    await this.ordersRepository.save(order);

    // ── نجيب الـ order تاني بعد الحفظ عشان العلاقات تكون محدثة ──
    const updated = await this.fetchWithRelations(id);
    return { data: mapAdminOrder(updated) };
  }
}