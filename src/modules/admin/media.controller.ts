import { AdminGuard } from "@/common/guards/admin.guard";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { BadRequestException, Controller, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { AdminProductsService } from "./admin-products.service";

@Controller('admin/products') // دمجناها هنا للسهولة
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

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
  async uploadProductImages(
    @Param('id') id: string, // نأخذ id المنتج من الرابط
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('لم يتم اختيار صور');
    }

    const imageUrls = files.map(file => `/uploads/products/${file.filename}`);

    // نقوم بتحديث المنتج في قاعدة البيانات بإضافة الروابط الجديدة
    return this.adminProductsService.update(id, { images: imageUrls });
  }
}