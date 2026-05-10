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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminProductsService } from './admin-products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Admin Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء منتج جديد' })
  @ApiResponse({ status: 201, description: 'تم إنشاء المنتج بنجاح' })
  async create(@Body() payload: CreateProductDto) {
    return this.adminProductsService.create(payload);
  }

  @Post('upload-images')
@ApiConsumes('multipart/form-data')
@UseInterceptors(
  FilesInterceptor('files', 10, {
    storage: diskStorage({
      destination: './uploads/products',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
@ApiOperation({ summary: 'رفع صور مؤقتة قبل إنشاء المنتج' })
async uploadImagesTemp(@UploadedFiles() files: Express.Multer.File[]) {
  if (!files?.length) throw new BadRequestException('يجب رفع صورة واحدة على الأقل');
  const imageUrls = files.map(file => `/uploads/products/${file.filename}`);
  return { images: imageUrls };
}

  @Post(':id/upload-images')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(/* FilesInterceptor config */)
  @ApiOperation({ summary: 'رفع صور لمنتج موجود' })
  @ApiParam({ name: 'id', type: 'string' })
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files?.length) throw new BadRequestException('يجب رفع صورة واحدة على الأقل');
    const imageUrls = files.map(file => `/uploads/products/${file.filename}`);
    return this.adminProductsService.update(id, { images: imageUrls });
  }

  @Put(':id')
  @ApiOperation({ summary: 'تحديث منتج' })
  @ApiParam({ name: 'id', type: 'string' })
  async update(@Param('id') id: string, @Body() payload: UpdateProductDto) {
    return this.adminProductsService.update(id, payload);
  }

  @Get()
  @ApiOperation({ summary: 'جلب قائمة المنتجات' })
  async list(@Query() query: Record<string, string>) {
    return this.adminProductsService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب منتج واحد' })
  @ApiParam({ name: 'id', type: 'string' })
  async getOne(@Param('id') id: string) {
    const product = await this.adminProductsService.findOne(id);
    if (!product) throw new NotFoundException('المنتج غير موجود');
    return product;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف منتج' })
  @ApiParam({ name: 'id', type: 'string' })
  async remove(@Param('id') id: string) {
    return this.adminProductsService.remove(id);
  }
}