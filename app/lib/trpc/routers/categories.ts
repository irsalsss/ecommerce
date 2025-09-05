import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../../trpc.server";

export const categoriesRouter = router({
  // Get all categories
  getCategories: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: {
                published: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }),

  // Get category by slug
  getCategory: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.category.findUnique({
        where: { slug: input.slug },
        include: {
          _count: {
            select: {
              products: {
                where: {
                  published: true,
                },
              },
            },
          },
        },
      });
    }),

  // Admin: Create category
  createCategory: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.category.create({
        data: input,
      });
    }),

  // Admin: Update category
  updateCategory: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        description: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      return ctx.prisma.category.update({
        where: { id },
        data,
      });
    }),

  // Admin: Delete category
  deleteCategory: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.category.delete({
        where: { id: input.id },
      });
    }),
});
