import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";

import { trpc } from "~/lib/trpc/client";
import { getUser } from "~/lib/auth.server";
import { useUserStore } from "~/lib/stores/user";
import { ToastProvider, ToastViewport } from "~/components/ui/toast";

import stylesheet from "~/styles/globals.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const meta: MetaFunction = () => [
  { title: "E-commerce Store" },
  { name: "description", content: "Modern e-commerce application" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  return json({ user });
};

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default function App() {
  const { user } = useLoaderData<typeof loader>();
  const setUser = useUserStore((state) => state.setUser);

  // Set user in store
  if (user && !useUserStore.getState().user) {
    setUser(user);
  }

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <Outlet />
              <ToastViewport />
            </ToastProvider>
          </QueryClientProvider>
        </trpc.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
