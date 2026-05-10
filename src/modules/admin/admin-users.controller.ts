import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminUsersService } from './admin-users.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('Admin Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'جلب كل المستخدمين' })
  async list() {
    return this.adminUsersService.list();
  }

  @Put(':id/role')
  @ApiOperation({ summary: 'تحديث دور مستخدم' })
  @ApiParam({ name: 'id', type: 'string' })
  async updateRole(
    @Param('id') id: string,
    @Body() payload: UpdateUserRoleDto,
  ) {
    return this.adminUsersService.updateRole(id, payload);
  }
}