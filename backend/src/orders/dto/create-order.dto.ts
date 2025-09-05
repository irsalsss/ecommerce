import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'Acme Corp', required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  address1: string;

  @ApiProperty({ example: 'Apt 4B', required: false })
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'NY' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: '10001' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ example: 'US' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: '+1-555-123-4567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;

  @ApiProperty({ type: AddressDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  billingAddress?: AddressDto;
}
