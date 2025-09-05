import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShoppingBag, Truck, Shield } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Header } from "~/components/layout/header";
import { Footer } from "~/components/layout/footer";
import { ProductCard } from "~/components/product/product-card";
import { trpc } from "~/lib/trpc/client";

export const meta: MetaFunction = () => {
  return [
    { title: "E-commerce Store - Home" },
    { name: "description", content: "Discover amazing products at great prices" },
  ];
};

export default function Index() {
  const { data: featuredProducts } = trpc.products.getFeatured.useQuery();
  const { data: categories } = trpc.categories.getCategories.useQuery();

  const features = [
    {
      icon: ShoppingBag,
      title: "Quality Products",
      description: "Carefully curated products from trusted brands",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Free shipping on orders over $50",
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Your data is protected with industry-standard security",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container py-24 lg:py-32">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
                  Discover Amazing
                  <span className="text-primary"> Products</span>
                </h1>
                <p className="text-lg text-muted-foreground lg:text-xl">
                  Shop from our curated collection of high-quality products at unbeatable prices.
                  Fast shipping, easy returns, and exceptional customer service.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link to="/products">
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/categories">Browse Categories</Link>
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8">
                  <div className="h-full w-full rounded-xl bg-background/50 backdrop-blur-sm flex items-center justify-center">
                    <ShoppingBag className="h-32 w-32 text-primary/50" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We're committed to providing the best shopping experience with quality products and exceptional service.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="text-center p-6">
                    <CardContent className="space-y-4">
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts && featuredProducts.length > 0 && (
          <section className="py-16 lg:py-24 bg-muted/50">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
                <p className="text-muted-foreground text-lg">
                  Discover our handpicked selection of trending products
                </p>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.slice(0, 8).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" asChild>
                  <Link to="/products">View All Products</Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Categories */}
        {categories && categories.length > 0 && (
          <section className="py-16 lg:py-24">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
                <p className="text-muted-foreground text-lg">
                  Find exactly what you're looking for
                </p>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categories.slice(0, 6).map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link to={`/categories/${category.slug}`}>
                      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="text-muted-foreground">{category.name}</div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{category.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {category.description}
                          </p>
                          <p className="text-sm text-primary">
                            {category._count?.products} products
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
