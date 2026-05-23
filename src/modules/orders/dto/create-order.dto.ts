import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

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

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

export class DeliveryInfoDto {
  @IsNotEmpty({ message: 'First name is required' })
  firstName!: string;

  @IsNotEmpty()
  lastName!: string;

  @IsNotEmpty()
  addressLineOne!: string;

  @IsOptional()
  addressLineTwo?: string;

  @IsNotEmpty()
  city!: string;

  @IsOptional()
  zipCode?: string;

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
  deliveryInfo!: DeliveryInfoDto;

  @IsString()
  @IsNotEmpty()
  paymentMethod!: string;

  @IsNumber()
  @Type(() => Number)
  totalAmount!: number;

  @IsNumber()
  @IsOptional()
  discount?: number = 0;

  @IsBoolean()
  @IsOptional()
  isGuest?: boolean = true;
}