import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'electronics' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Electronic devices and accessories', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'category-image.jpg', required: false })
  @IsOptional()
  @IsString()
  image?: string;
}
