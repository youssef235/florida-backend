import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { AdminPriceTagDto } from './admin-price-tag.dto';
import { ColorDto } from '@/common/color.dto';

export class CreateProductDto {
  @ApiProperty({ example: 'تيشيرت أسود' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'تيشيرت قطني عالي الجودة' })
  @IsNotEmpty()
  @IsString()
  description!: string;

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

  @ApiPropertyOptional({ enum: ['summer', 'winter'] })
  @IsOptional()
  @IsEnum(['summer', 'winter'])
  season?: 'summer' | 'winter';
}