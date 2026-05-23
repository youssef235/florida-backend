import { Body, Controller, Get, HttpCode, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('guest')
  async getGuestOrders(@Query('contactNumber') contactNumber: string) {
    if (!contactNumber) return [];
    return this.ordersService.getGuestOrders(contactNumber);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrders(@Req() req: any) {
    return this.ordersService.getOrders(req.user);
  }

  @Post()
  @HttpCode(200)
  @UseGuards(OptionalJwtAuthGuard)  // ← يقبل token لو موجود بس مش إجباري
  async createOrder(@Req() req: any, @Body() payload: CreateOrderDto) {
    return this.ordersService.createOrder(req.user || null, payload);
  }
}