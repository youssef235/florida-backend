import { IsNotEmpty } from 'class-validator';

export class AddWishlistDto {
  @IsNotEmpty()
  productId!: string;
}