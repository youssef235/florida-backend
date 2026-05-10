import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'ملابس رجالي' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '/uploads/categories/new-image.jpg' })
  @IsOptional()
  @IsString()
  image?: string;
}