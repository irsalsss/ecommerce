import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class AddToCartDto {
  @ApiProperty({ example: 'product-id' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  quantity: number;
}
