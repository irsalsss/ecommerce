import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/lib/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  return await authenticator.logout(request, { redirectTo: "/" });
};

export const loader = async ({ request }: ActionFunctionArgs) => {
  return await authenticator.logout(request, { redirectTo: "/" });
};
