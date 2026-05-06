import {
  Controller,
  Post,
 Get,
  Put,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BannerService } from './banner.service';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  // ✅ Get All
  @Get()
  async getAllBanners() {
    return this.bannerService.findAll();
  }

  // ✅ Create
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/banners',
        filename: (req, file, callback) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadBanner(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('subTitle') subTitle: string,
  ) {
    const imageUrl = `/uploads/banners/${file.filename}`;

    return this.bannerService.create({
      title,
      subTitle,
      imageUrl,
    });
  }

  // 🔥 Update بدون صورة (حل مشكلة any هنا 👇)
  @Put(':id')
  async updateBanner(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBannerDto,
  ) {
    return this.bannerService.update(id, body);
  }

  // 🔥 Update مع صورة
  @Put('with-image/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/banners',
        filename: (req, file, callback) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async updateBannerWithImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('subTitle') subTitle: string,
  ) {
    const imageUrl = file
      ? `/uploads/banners/${file.filename}`
      : undefined;

    return this.bannerService.update(id, {
      title,
      subTitle,
      imageUrl,
    });
  }

  // ❌ Delete
  @Delete(':id')
  async deleteBanner(@Param('id', ParseIntPipe) id: number) {
    await this.bannerService.remove(id);
    return { message: 'Deleted successfully' };
  }
}