import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
  @Post('add')
  addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, addToCartDto.productId, addToCartDto.quantity);
  }

  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  @Patch('update')
  updateCartItem(@Request() req, @Body() updateCartItemDto: UpdateCartItemDto) {
    return this.cartService.updateCartItem(req.user.id, updateCartItemDto.productId, updateCartItemDto.quantity);
  }

  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully' })
  @Delete('remove/:productId')
  removeFromCart(@Request() req, @Param('productId') productId: string) {
    return this.cartService.removeFromCart(req.user.id, productId);
  }

  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  @Delete('clear')
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }

  @ApiOperation({ summary: 'Get cart total' })
  @ApiResponse({ status: 200, description: 'Cart total retrieved successfully' })
  @Get('total')
  getCartTotal(@Request() req) {
    return this.cartService.getCartTotal(req.user.id);
  }
}
