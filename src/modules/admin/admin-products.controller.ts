import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminProductsService } from './admin-products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('admin/products')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  // 1️⃣ إنشاء المنتج بجميع الفيتشرات (بدون صور في هذه المرحلة)
  @Post()
  async create(@Body() payload: CreateProductDto) {
    // payload سيحتوي على: name, description, categories, priceTags, isFeatured, hasDiscount, season
    return this.adminProductsService.create(payload);
  }

  // 2️⃣ رفع الصور وربطها بالمنتج عن طريق الـ ID
  @Post(':id/upload-images')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `product-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('يجب رفع صورة واحدة على الأقل');
    }

    const imageUrls = files.map(file => `/uploads/products/${file.filename}`);

    // تحديث مصفوفة الصور في المنتج الموجود مسبقاً
    return this.adminProductsService.update(id, { images: imageUrls });
  }

  // 3️⃣ تحديث أي فيتشر في المنتج لاحقاً (بما في ذلك الفيتشرات الجديدة)
  @Put(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateProductDto) {
    return this.adminProductsService.update(id, payload);
  }

  // 4️⃣ باقي العمليات (عرض وحذف)
  @Get()
  async list(@Query() query: Record<string, string>) {
    return this.adminProductsService.list(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const product = await this.adminProductsService.findOne(id);
    if (!product) throw new NotFoundException('المنتج غير موجود');
    return product;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminProductsService.remove(id);
  }
}