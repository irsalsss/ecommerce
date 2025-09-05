import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Awesome Product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'awesome-product' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'This is an awesome product description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiProperty({ example: 119.99, required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  comparePrice?: number;

  @ApiProperty({ example: 'SKU-001', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ example: 100, default: 0 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  stock?: number;

  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'] })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiProperty({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiProperty({ example: 'category-id' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
