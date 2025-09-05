import { z } from "zod";
import { router, protectedProcedure } from "../../trpc.server";
import { TRPCError } from "@trpc/server";

export const cartRouter = router({
  // Get user's cart
  getCart: protectedProcedure.query(async ({ ctx }) => {
    const cartItems = await ctx.prisma.cartItem.findMany({
      where: { userId: ctx.user.id },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    return {
      items: cartItems,
      total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  }),

  // Add item to cart
  addToCart: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1).default(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { productId, quantity } = input;

      // Check if product exists and has enough stock
      const product = await ctx.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      if (product.stock < quantity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not enough stock available",
        });
      }

      // Check if item already exists in cart
      const existingItem = await ctx.prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId: ctx.user.id,
            productId,
          },
        },
      });

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        
        if (product.stock < newQuantity) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Not enough stock available",
          });
        }

        return ctx.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
          include: {
            product: true,
          },
        });
      } else {
        // Create new cart item
        return ctx.prisma.cartItem.create({
          data: {
            userId: ctx.user.id,
            productId,
            quantity,
          },
          include: {
            product: true,
          },
        });
      }
    }),

  // Update cart item quantity
  updateQuantity: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().min(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { productId, quantity } = input;

      if (quantity === 0) {
        // Remove item from cart
        return ctx.prisma.cartItem.delete({
          where: {
            userId_productId: {
              userId: ctx.user.id,
              productId,
            },
          },
        });
      }

      // Check stock availability
      const product = await ctx.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      if (product.stock < quantity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not enough stock available",
        });
      }

      return ctx.prisma.cartItem.update({
        where: {
          userId_productId: {
            userId: ctx.user.id,
            productId,
          },
        },
        data: { quantity },
        include: {
          product: true,
        },
      });
    }),

  // Remove item from cart
  removeFromCart: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: ctx.user.id,
            productId: input.productId,
          },
        },
      });
    }),

  // Clear cart
  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.prisma.cartItem.deleteMany({
      where: { userId: ctx.user.id },
    });
  }),
});
