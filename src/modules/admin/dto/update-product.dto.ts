import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { AdminPriceTagDto } from './admin-price-tag.dto';
import { ColorDto } from '@/common/color.dto';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'تيشيرت أسود' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'تيشيرت قطني مريح' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String], example: ['/uploads/products/1.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @ApiPropertyOptional({ type: [ColorDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColorDto)
  colors?: ColorDto[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({ type: [AdminPriceTagDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminPriceTagDto)
  priceTags?: AdminPriceTagDto[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  hasDiscount?: boolean;

  @ApiPropertyOptional({ enum: ['summer', 'winter'], example: 'summer' })
  @IsOptional()
  @IsEnum(['summer', 'winter'])
  season?: 'summer' | 'winter';
}