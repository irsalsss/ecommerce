import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { authenticator, getUser } from "~/lib/auth.server";
import { loginSchema, type LoginFormData } from "~/lib/validations/auth";

export const meta: MetaFunction = () => {
  return [
    { title: "Login - E-commerce Store" },
    { name: "description", content: "Sign in to your account" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (user) {
    return redirect("/");
  }
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const user = await authenticator.authenticate("form", request, {
      successRedirect: "/",
    });
    return json({ user });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Invalid credentials" },
      { status: 400 }
    );
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue shopping
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {actionData && 'error' in actionData && actionData.error && (
                <div className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded">
                  {actionData.error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
