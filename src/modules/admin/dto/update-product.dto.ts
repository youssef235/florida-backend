import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
  IsBoolean,
} from 'class-validator';

import { AdminPriceTagDto } from './admin-price-tag.dto';

export class UpdateProductDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminPriceTagDto)
  priceTags?: AdminPriceTagDto[];

  // 🔥 NEW
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  hasDiscount?: boolean;

  @IsOptional()
  @IsString()
  season?: 'summer' | 'winter';
}