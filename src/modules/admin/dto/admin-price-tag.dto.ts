import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AdminPriceTagDto {
  @ApiProperty({ example: 'السعر الأساسي', description: 'اسم السعر' })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 299.99 })
  @IsNumber()
  @Type(() => Number)
  price!: number;
}