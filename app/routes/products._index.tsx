import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Grid, List } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { Header } from "~/components/layout/header";
import { Footer } from "~/components/layout/footer";
import { ProductCard } from "~/components/product/product-card";
import { trpc } from "~/lib/trpc/client";

export const meta: MetaFunction = () => {
  return [
    { title: "Products - E-commerce Store" },
    { name: "description", content: "Browse our collection of products" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const search = url.searchParams.get("search") || "";
  const categoryId = url.searchParams.get("category") || "";
  const sortBy = url.searchParams.get("sortBy") || "createdAt";
  const sortOrder = url.searchParams.get("sortOrder") || "desc";

  return json({
    initialFilters: {
      page,
      search,
      categoryId,
      sortBy,
      sortOrder,
    },
  });
};

// Define types for the tRPC responses
type Category = {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
};

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  averageRating?: number;
  reviewCount?: number;
  category: {
    id: string;
    name: string;
  };
};

type ProductsResponse = {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export default function Products() {
  useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const filters = {
    page: parseInt(searchParams.get("page") || "1"),
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("category") || "",
    sortBy: (searchParams.get("sortBy") as "name" | "price" | "createdAt") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    limit: 12,
  };

  const { data: productsData, isLoading } = trpc.products.getProducts.useQuery(filters) as {
    data: ProductsResponse | undefined;
    isLoading: boolean;
  };
  const { data: categories } = trpc.categories.getCategories.useQuery() as {
    data: Category[] | undefined;
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });
    
    // Reset to page 1 when filters change (except when changing page)
    if (!("page" in newFilters)) {
      params.set("page", "1");
    }
    
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    updateFilters({ search });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Products</h1>
          <p className="text-muted-foreground">
            Discover our amazing collection of products
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? "block" : "hidden"}`}>
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4">Filters</h2>
                
                {/* Categories */}
                {categories && categories.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => updateFilters({ categoryId: "" })}
                        className={`block w-full text-left text-sm hover:text-primary ${
                          !filters.categoryId ? "text-primary font-medium" : "text-muted-foreground"
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((category: Category) => (
                        <button
                          key={category.id}
                          onClick={() => updateFilters({ categoryId: category.id })}
                          className={`block w-full text-left text-sm hover:text-primary ${
                            filters.categoryId === category.id
                              ? "text-primary font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {category.name} ({category._count?.products || 0})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sort Options */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Sort By</h3>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split("-");
                      updateFilters({ 
                        sortBy: sortBy as typeof filters.sortBy, 
                        sortOrder: sortOrder as typeof filters.sortOrder 
                      });
                    }}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="price-asc">Price Low to High</option>
                    <option value="price-desc">Price High to Low</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Search and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex-1">
                <Input
                  name="search"
                  placeholder="Search products..."
                  defaultValue={filters.search}
                  className="w-full"
                />
              </form>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4" />
                </Button>
                
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : productsData?.products && productsData.products.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === "grid" 
                    ? "sm:grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-1"
                }`}>
                  {productsData.products.map((product: Product, index: number) => (
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

                {/* Pagination */}
                {productsData.pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      disabled={productsData.pagination.page === 1}
                      onClick={() => updateFilters({ page: productsData.pagination.page - 1 })}
                    >
                      Previous
                    </Button>
                    
                    <span className="text-sm text-muted-foreground">
                      Page {productsData.pagination.page} of {productsData.pagination.totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      disabled={productsData.pagination.page === productsData.pagination.totalPages}
                      onClick={() => updateFilters({ page: productsData.pagination.page + 1 })}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
