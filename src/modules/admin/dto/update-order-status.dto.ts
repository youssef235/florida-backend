import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({
    example: 2,
    description: 'حالة الطلب (0=Pending, 1=Processing, 2=Shipped, 3=Delivered, 4=Cancelled)',
    enum: [0, 1, 2, 3, 4],
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(4)
  orderStatus!: number;
}