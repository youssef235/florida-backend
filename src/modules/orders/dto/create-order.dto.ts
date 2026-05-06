import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  product!: string;

  @IsNotEmpty()
  priceTag!: string;

  @IsNumber()
  @Type(() => Number)
  price!: number;

  @IsNumber()
  @Type(() => Number)
  quantity!: number;
}

// ✅ بيانات الشحن مباشرة بدون ID
export class DeliveryInfoDto {
  @IsNotEmpty()
  firstName!: string;

  @IsNotEmpty()
  lastName!: string;

  @IsNotEmpty()
  addressLineOne!: string;

  @IsOptional()
  @IsString()
  addressLineTwo?: string;

  @IsNotEmpty()
  city!: string;

  @IsNotEmpty()
  zipCode!: string;

  @IsNotEmpty()
  contactNumber!: string;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems!: CreateOrderItemDto[];

  @ValidateNested()
  @Type(() => DeliveryInfoDto)
  deliveryInfo!: DeliveryInfoDto;   // ✅ object مباشرة مش ID

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  discount?: number;
}