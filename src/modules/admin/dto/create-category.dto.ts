import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'اسم القسم مطلوب' })
  @IsString()
  name!: string;

  @IsOptional() // 👈 غيرها من @IsNotEmpty إلى @IsOptional
  @IsString()
  image?: string;
}