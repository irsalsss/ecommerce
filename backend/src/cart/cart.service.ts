import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartItem } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<CartItem> {
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async updateCartItem(userId: string, productId: string, quantity: number): Promise<CartItem> {
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!existingItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity <= 0) {
      await this.prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });
      return existingItem;
    }

    return this.prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        quantity,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    await this.prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async clearCart(userId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });
  }

  async getCartTotal(userId: string): Promise<number> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.product.price.toString()) * item.quantity);
    }, 0);
  }
}
