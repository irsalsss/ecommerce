import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { Order, OrderStatus, PaymentStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const cartItems = await this.cartService.getCart(userId);
    
    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => {
      return total + (parseFloat(item.product.price.toString()) * item.quantity);
    }, 0);

    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order with transaction
    const order = await this.prisma.$transaction(async (prisma) => {
      // Create the order
      const newOrder = await prisma.order.create({
        data: {
          orderNumber,
          userId,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          subtotal,
          tax,
          shipping,
          total,
          shippingFirstName: createOrderDto.shippingAddress.firstName,
          shippingLastName: createOrderDto.shippingAddress.lastName,
          shippingCompany: createOrderDto.shippingAddress.company,
          shippingAddress1: createOrderDto.shippingAddress.address1,
          shippingAddress2: createOrderDto.shippingAddress.address2,
          shippingCity: createOrderDto.shippingAddress.city,
          shippingState: createOrderDto.shippingAddress.state,
          shippingPostalCode: createOrderDto.shippingAddress.postalCode,
          shippingCountry: createOrderDto.shippingAddress.country,
          shippingPhone: createOrderDto.shippingAddress.phone,
          billingFirstName: createOrderDto.billingAddress?.firstName,
          billingLastName: createOrderDto.billingAddress?.lastName,
          billingCompany: createOrderDto.billingAddress?.company,
          billingAddress1: createOrderDto.billingAddress?.address1,
          billingAddress2: createOrderDto.billingAddress?.address2,
          billingCity: createOrderDto.billingAddress?.city,
          billingState: createOrderDto.billingAddress?.state,
          billingPostalCode: createOrderDto.billingAddress?.postalCode,
          billingCountry: createOrderDto.billingAddress?.country,
          billingPhone: createOrderDto.billingAddress?.phone,
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      // Create order items
      for (const cartItem of cartItems) {
        await prisma.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: cartItem.product.price,
            total: parseFloat(cartItem.product.price.toString()) * cartItem.quantity,
          },
        });
      }

      // Clear the cart
      await prisma.cartItem.deleteMany({
        where: { userId },
      });

      return newOrder;
    });

    return this.findOne(order.id);
  }

  async findAll(userId?: string, params?: {
    skip?: number;
    take?: number;
  }) {
    const { skip, take } = params || {};
    return this.prisma.order.findMany({
      skip,
      take,
      where: userId ? { userId } : undefined,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { paymentStatus },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }
}
