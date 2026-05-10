// dto/color.dto.ts
import { IsHexColor, IsString } from 'class-validator';

export class ColorDto {
  @IsString()
  name!: string;

  @IsHexColor()
  hex!: string;
}