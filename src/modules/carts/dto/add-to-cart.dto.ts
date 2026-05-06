import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  product!: string;

  @IsNotEmpty()
  priceTag!: string;

  @IsOptional()
  @IsNumber()
  quantity: number = 1;

  @IsOptional()
  @IsString()
  size?: string;   // ✅

  @IsOptional()
  @IsString()
  color?: string;  // ✅
}