import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    const productData = {
      ...createProductDto,
      category: {
        connect: { id: createProductDto.categoryId }
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categoryId: _, ...dataWithoutCategoryId } = productData;
    return this.productsService.create(dataWithoutCategoryId);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    if (search) {
      return this.productsService.search(search, { skip, take: limitNum });
    }

    if (category) {
      return this.productsService.findByCategory(category, { skip, take: limitNum });
    }

    return this.productsService.findAll({ skip, take: limitNum });
  }

  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Get product by slug' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
