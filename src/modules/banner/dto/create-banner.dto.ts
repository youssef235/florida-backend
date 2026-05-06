import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBannerDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  subTitle?: string;

  @IsNotEmpty()
  @IsString()
  imageUrl!: string;
}