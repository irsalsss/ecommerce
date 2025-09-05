import { Link } from "@remix-run/react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-primary"></div>
              <span className="font-bold">Store</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your one-stop shop for all your needs. Quality products, great prices, fast delivery.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground">
                Products
              </Link>
              <Link to="/categories" className="text-sm text-muted-foreground hover:text-foreground">
                Categories
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About Us
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Service</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground">
                Help Center
              </Link>
              <Link to="/shipping" className="text-sm text-muted-foreground hover:text-foreground">
                Shipping Info
              </Link>
              <Link to="/returns" className="text-sm text-muted-foreground hover:text-foreground">
                Returns
              </Link>
              <Link to="/track-order" className="text-sm text-muted-foreground hover:text-foreground">
                Track Order
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
                Cookie Policy
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
