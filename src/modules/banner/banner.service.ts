import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from '../../entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepo: Repository<Banner>,
  ) {}

  // ✅ بدون relations → خفيف
  async findAll(): Promise<Banner[]> {
    return this.bannerRepo.find({
      order: { id: 'DESC' },
    });
  }

  async create(dto: CreateBannerDto): Promise<Banner> {
    const banner = this.bannerRepo.create(dto);
    return this.bannerRepo.save(banner);
  }

  async update(id: number, dto: UpdateBannerDto): Promise<Banner> {
    const banner = await this.bannerRepo.findOne({ where: { id } });

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    // 🔥 تحديث ذكي (بدون overwrite null)
    if (dto.title !== undefined) banner.title = dto.title;
    if (dto.subTitle !== undefined) banner.subTitle = dto.subTitle;

    if (dto.imageUrl !== undefined) {
      // حذف الصورة القديمة
      if (banner.imageUrl) {
        const oldPath = path.join(
          process.cwd(),
          banner.imageUrl,
        );

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      banner.imageUrl = dto.imageUrl;
    }

    return this.bannerRepo.save(banner);
  }

  async remove(id: number): Promise<void> {
    const banner = await this.bannerRepo.findOne({ where: { id } });

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    // حذف الصورة
    if (banner.imageUrl) {
      const filePath = path.join(
        process.cwd(),
        banner.imageUrl,
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await this.bannerRepo.delete(id);
  }
}