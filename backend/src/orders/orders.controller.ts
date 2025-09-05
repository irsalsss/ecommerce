import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @Post()
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, createOrderDto);
  }

  @ApiOperation({ summary: 'Get user orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    return this.ordersService.findAll(req.user.id, { skip, take: limitNum });
  }

  @ApiOperation({ summary: 'Get all orders (admin only)' })
  @ApiResponse({ status: 200, description: 'All orders retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get('admin/all')
  findAllAdmin(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    return this.ordersService.findAll(undefined, { skip, take: limitNum });
  }

  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto.status as OrderStatus);
  }

  @ApiOperation({ summary: 'Update payment status' })
  @ApiResponse({ status: 200, description: 'Payment status updated successfully' })
  @Patch(':id/payment-status')
  updatePaymentStatus(@Param('id') id: string, @Body() body: { paymentStatus: PaymentStatus }) {
    return this.ordersService.updatePaymentStatus(id, body.paymentStatus);
  }
}
