import { z } from "zod";

export const productFilterSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  featured: z.boolean().optional(),
  sortBy: z.enum(["name", "price", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
});

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1").default(1),
});

export const reviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().optional(),
});

export type ProductFilters = z.infer<typeof productFilterSchema>;
export type AddToCartData = z.infer<typeof addToCartSchema>;
export type ReviewData = z.infer<typeof reviewSchema>;
