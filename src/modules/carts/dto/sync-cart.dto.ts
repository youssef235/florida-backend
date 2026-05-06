import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class SyncCartItemDto {
  @IsNotEmpty()
  product!: string;

  @IsNotEmpty()
  priceTag!: string;

  @IsNumber()
  quantity!: number;

  @IsOptional()
  @IsString()
  size?: string;       // ✅ أضف

  @IsOptional()
  @IsString()
  color?: string;      // ✅ أضف
}
export class SyncCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncCartItemDto)
  data!: SyncCartItemDto[];
}