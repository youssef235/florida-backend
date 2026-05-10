import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminSummaryService } from './admin-summary.service';

@ApiTags('Admin Summary')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/summary')
export class AdminSummaryController {
  constructor(private readonly adminSummaryService: AdminSummaryService) {}

  @Get()
  @ApiOperation({ summary: 'جلب ملخص لوحة التحكم' })
  @ApiResponse({ status: 200, description: 'تم جلب الملخص بنجاح' })
  async getSummary() {
    return this.adminSummaryService.getSummary();
  }
}