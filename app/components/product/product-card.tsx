import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { useCartStore } from "~/lib/stores/cart";
import { formatPrice } from "~/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    comparePrice?: number;
    images: string[];
    stock: number;
    averageRating?: number;
    reviewCount?: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      stock: product.stock,
    });
  };

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden">
        <Link to={`/products/${product.slug}`}>
          <div className="relative overflow-hidden">
            <div className="aspect-square bg-muted flex items-center justify-center">
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-muted-foreground">No image</div>
              )}
            </div>
            
            {discount > 0 && (
              <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
                -{discount}%
              </div>
            )}

            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-medium">Out of Stock</span>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <h3 className="font-semibold line-clamp-2 mb-2">{product.name}</h3>
            
            {product.averageRating && product.reviewCount && (
              <div className="flex items-center space-x-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.averageRating!)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
          </CardContent>
        </Link>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
