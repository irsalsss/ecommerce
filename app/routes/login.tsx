import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { data, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation, useSubmit } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRef } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { authenticator, sessionStorage } from "~/lib/auth.server";
import { loginSchema, type LoginFormData } from "~/lib/validations/auth";

export const meta: MetaFunction = () => {
  return [
    { title: "Login - E-commerce Store" },
    { name: "description", content: "Sign in to your account" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const user = session.get("user");

  if (user) {
    return redirect("/");
  }

  return data({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const user = await authenticator.authenticate("form", request);
    const session = await sessionStorage.getSession(
      request.headers.get("cookie")
    );

    session.set("user", user);

    return redirect("/", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  } catch (error) {
    return {
      status: 400,
      error: error instanceof Error ? error.message : "Invalid credentials",
    };
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    // Client-side validation passed, now submit to Remix action
    if (formRef.current) {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      
      submit(formData, {
        method: "post",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue shopping</CardDescription>
          </CardHeader>
          <CardContent>
            <Form 
              ref={formRef}
              method="post" 
              className="space-y-4" 
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  errorMessage={errors.email?.message}
                />
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
                  errorMessage={errors.password?.message}
                />
              </div>

              {actionData && "error" in actionData && actionData.error && (
                <div className="rounded bg-destructive/10 p-3 text-center text-sm text-destructive">
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
