import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({
      data,
      include: {
        products: true,
      },
    });
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      include: {
        products: {
          where: {
            published: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: {
            published: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: {
            published: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data,
      include: {
        products: {
          where: {
            published: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<Category> {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
