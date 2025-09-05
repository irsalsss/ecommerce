import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../../trpc.server";
import { TRPCError } from "@trpc/server";

export const productsRouter = router({
  // Get all products with pagination and filtering
  getProducts: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(12),
        categoryId: z.string().optional(),
        search: z.string().optional(),
        featured: z.boolean().optional(),
        sortBy: z.enum(["name", "price", "createdAt"]).default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, limit, categoryId, search, featured, sortBy, sortOrder } = input;
      const skip = (page - 1) * limit;

      const where = {
        published: true,
        ...(categoryId && { categoryId }),
        ...(featured !== undefined && { featured }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };

      const [products, total] = await Promise.all([
        ctx.prisma.product.findMany({
          where,
          include: {
            category: true,
            reviews: {
              select: {
                rating: true,
              },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        ctx.prisma.product.count({ where }),
      ]);

      // Calculate average rating for each product
      const productsWithRating = products.map((product) => ({
        ...product,
        averageRating:
          product.reviews.length > 0
            ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
              product.reviews.length
            : 0,
        reviewCount: product.reviews.length,
        reviews: undefined, // Remove reviews from response for performance
      }));

      return {
        products: productsWithRating,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Get single product by slug
  getProduct: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { slug: input.slug, published: true },
        include: {
          category: true,
          reviews: {
            include: {
              user: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const averageRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length
          : 0;

      return {
        ...product,
        averageRating,
        reviewCount: product.reviews.length,
      };
    }),

  // Get featured products
  getFeatured: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.product.findMany({
      where: { featured: true, published: true },
      include: {
        category: true,
      },
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  // Admin: Create product
  createProduct: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        price: z.number().positive(),
        comparePrice: z.number().positive().optional(),
        sku: z.string().optional(),
        stock: z.number().min(0).default(0),
        images: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
        published: z.boolean().default(true),
        categoryId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.product.create({
        data: input,
        include: {
          category: true,
        },
      });
    }),

  // Admin: Update product
  updateProduct: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        comparePrice: z.number().positive().optional(),
        sku: z.string().optional(),
        stock: z.number().min(0).optional(),
        images: z.array(z.string()).optional(),
        featured: z.boolean().optional(),
        published: z.boolean().optional(),
        categoryId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      return ctx.prisma.product.update({
        where: { id },
        data,
        include: {
          category: true,
        },
      });
    }),

  // Admin: Delete product
  deleteProduct: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.product.delete({
        where: { id: input.id },
      });
    }),
});
