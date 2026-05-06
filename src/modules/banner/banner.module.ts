import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from '../../entities/banner.entity';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Banner])],
  controllers: [BannerController],
  providers: [BannerService],
  
})
export class BannerModule {}console.log('🔥 BannerModule Loaded');