import { Link } from "@remix-run/react";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useCartStore } from "~/lib/stores/cart";
import { useUserStore } from "~/lib/stores/user";
import { formatPrice } from "~/lib/utils";

export function Header() {
  const { items, isOpen, toggleCart, getItemCount, getTotal } = useCartStore();
  const { user, isAuthenticated } = useUserStore();
  
  const itemCount = getItemCount();
  const total = getTotal();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary"></div>
          <span className="text-xl font-bold">Store</span>
        </Link>

        {/* Search */}
        <div className="hidden flex-1 max-w-md mx-8 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-sm font-medium hover:text-primary">
              Products
            </Link>
            <Link to="/categories" className="text-sm font-medium hover:text-primary">
              Categories
            </Link>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-2">
            {isAuthenticated() ? (
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline text-sm">
                  Hello, {user?.name}
                </span>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/account">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </nav>
      </div>

      {/* Cart Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div role="button" tabIndex={0} className="fixed inset-0 bg-black/20" onClick={toggleCart} onKeyDown={toggleCart} />
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <Button variant="ghost" size="icon" onClick={toggleCart}>
                ×
              </Button>
            </div>

            {items.length === 0 ? (
              <p className="text-muted-foreground">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-lg bg-muted"></div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold">Total: {formatPrice(total)}</span>
                  </div>
                  <Button className="w-full" asChild>
                    <Link to="/checkout">Checkout</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
