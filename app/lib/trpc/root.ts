import { router } from "../trpc.server";
import { productsRouter } from "./routers/products";
import { cartRouter } from "./routers/cart";
import { categoriesRouter } from "./routers/categories";

export const appRouter = router({
  products: productsRouter,
  cart: cartRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
