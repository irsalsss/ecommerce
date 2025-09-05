import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCartItemDto {
  @ApiProperty({ example: 'product-id' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2, minimum: 0 })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  quantity: number;
}
