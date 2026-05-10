import { Body, Controller, Get, NotFoundException, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminOrdersService } from './admin-orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Admin Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Get()
  @ApiOperation({ summary: 'جلب كل الطلبات' })
  async list() {
    return this.adminOrdersService.list();
  }

  // ✅ هذا الـ endpoint كان مفقوداً - بدونه useShow بيفشل
  @Get(':id')
  @ApiOperation({ summary: 'جلب طلب واحد بالتفاصيل' })
  @ApiParam({ name: 'id', type: 'string' })
  async getOne(@Param('id') id: string) {
    const order = await this.adminOrdersService.findOne(id);
    if (!order) throw new NotFoundException('الطلب غير موجود');
    return order;
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'تحديث حالة الطلب' })
  @ApiParam({ name: 'id', type: 'string' })
  async updateStatus(
    @Param('id') id: string,
    @Body() payload: UpdateOrderStatusDto,
  ) {
    return this.adminOrdersService.updateStatus(id, payload);
  }
}