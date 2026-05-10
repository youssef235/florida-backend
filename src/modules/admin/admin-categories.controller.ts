import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminCategoriesService } from './admin-categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Admin Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private readonly adminCategoriesService: AdminCategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'جلب كل التصنيفات' })
  @ApiResponse({ status: 200, description: 'تم جلب التصنيفات بنجاح' })
  async list() {
    return this.adminCategoriesService.list();
  }
@Get(':id')
@ApiOperation({ summary: 'جلب تصنيف واحد' })
@ApiParam({ name: 'id', type: 'string' })
async getOne(@Param('id') id: string) {
  return this.adminCategoriesService.findOne(id);
}

  @Post()
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
)  @ApiOperation({ summary: 'إنشاء تصنيف جديد مع صورة' })
  @ApiResponse({ status: 201, description: 'تم إنشاء التصنيف بنجاح' })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: CreateCategoryDto,
  ) {
    if (!file) throw new BadRequestException('Category image is required');
    const imageUrl = `/uploads/categories/${file.filename}`;

    return this.adminCategoriesService.create({ ...payload, image: imageUrl });
  }

@Put(':id')
@ApiConsumes('multipart/form-data')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/categories',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'category-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
@ApiOperation({ summary: 'تحديث تصنيف' })
@ApiParam({ name: 'id', type: 'string' })
async update(
  @Param('id') id: string,
  @Body() payload: UpdateCategoryDto,
  @UploadedFile() file?: Express.Multer.File,
) {
  const updateData = { ...payload };
  if (file) updateData.image = `/uploads/categories/${file.filename}`;
  return this.adminCategoriesService.update(id, updateData);
}

  @Delete(':id')
  @ApiOperation({ summary: 'حذف تصنيف' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'تم حذف التصنيف بنجاح' })
  async remove(@Param('id') id: string) {
    return this.adminCategoriesService.remove(id);
  }
}