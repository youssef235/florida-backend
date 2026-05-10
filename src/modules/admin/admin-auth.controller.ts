import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { SignInDto } from '../auth/dto/sign-in.dto';
import { AdminAuthService } from './admin-auth.service';

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('sign-in')
  @HttpCode(200)
  @ApiOperation({ summary: 'تسجيل دخول الأدمن' })
  @ApiResponse({ status: 200, description: 'تم تسجيل الدخول بنجاح' })
  @ApiResponse({ status: 401, description: 'بيانات غير صحيحة' })
  async signIn(@Body() payload: SignInDto) {
    return this.adminAuthService.signIn(payload);
  }

  // ✅ endpoint جديد — الداشبورد بيستدعيه في getIdentity
  @Get('me')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'جلب بيانات الأدمن الحالي' })
  async me(@Req() req: any) {
    return this.adminAuthService.me(req.user);
  }
}