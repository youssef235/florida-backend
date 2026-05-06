import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { AdminPriceTagDto } from './admin-price-tag.dto';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;
  
@IsOptional()
  @IsArray()
  @IsString({ each: true })
  images!: string[]; // مصفوفة روابط الصور الجاهزة

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[]; // مصفوفة الـ IDs الخاصة بالكاتيجوريز

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminPriceTagDto)
  priceTags?: AdminPriceTagDto[];

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  hasDiscount?: boolean;

  @IsOptional()
  @IsEnum(['summer', 'winter'])
  season?: 'summer' | 'winter';
}