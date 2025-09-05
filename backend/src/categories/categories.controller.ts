import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @ApiOperation({ summary: 'Get category by slug' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
