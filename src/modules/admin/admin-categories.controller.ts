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
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminCategoriesService } from './admin-categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('admin/categories')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminCategoriesController {
  constructor(private readonly adminCategoriesService: AdminCategoriesService) {}

  // --- جلب جميع التصنيفات ---
  @Get()
  async list() {
    return this.adminCategoriesService.list();
  }

  // --- إنشاء تصنيف جديد مع رفع صورة ---
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `category-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: CreateCategoryDto,
  ) {
    if (!file) {
      throw new BadRequestException('Category image is required');
    }

    // تجهيز مسار الصورة للتخزين في قاعدة البيانات
    const imageUrl = `/uploads/categories/${file.filename}`;
    
    return this.adminCategoriesService.create({
      ...payload,
      image: imageUrl,
    });
  }

  // --- تحديث تصنيف (مع صورة اختيارية) ---
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `category-update-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updateData = { ...payload };

    // إذا قام المستخدم برفع صورة جديدة، نحدث المسار
    if (file) {
      updateData.image = `/uploads/categories/${file.filename}`;
    }

    return this.adminCategoriesService.update(id, updateData);
  }

  // --- حذف تصنيف ---
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminCategoriesService.remove(id);
  }
}