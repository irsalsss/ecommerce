import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }): Promise<Product[]> {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.product.findMany({
      skip,
      take,
      where: {
        ...where,
        published: true,
      },
      orderBy,
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  async findByCategory(categoryId: string, params?: {
    skip?: number;
    take?: number;
  }): Promise<Product[]> {
    const { skip, take } = params || {};
    return this.prisma.product.findMany({
      skip,
      take,
      where: {
        categoryId,
        published: true,
      },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async search(query: string, params?: {
    skip?: number;
    take?: number;
  }): Promise<Product[]> {
    const { skip, take } = params || {};
    return this.prisma.product.findMany({
      skip,
      take,
      where: {
        AND: [
          { published: true },
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
