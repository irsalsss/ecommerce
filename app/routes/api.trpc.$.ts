import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "~/lib/trpc/root";
import { createTRPCContext } from "~/lib/trpc.server";
import { getUser } from "~/lib/auth.server";

const handler = async (request: Request) => {
  const user = await getUser(request);
  
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => createTRPCContext({ user }),
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return handler(request);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return handler(request);
};
