import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { authenticator, getUser, createUser } from "~/lib/auth.server";
import { registerSchema, type RegisterFormData } from "~/lib/validations/auth";

export const meta: MetaFunction = () => {
  return [
    { title: "Register - E-commerce Store" },
    { name: "description", content: "Create your account" },
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
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const validatedData = registerSchema.parse(data);
    
    await createUser({
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
    });

    // Automatically log in the user after registration
    return await authenticator.authenticate("form", request, {
      successRedirect: "/",
    });
  } catch (error) {
    return json(
      { 
        error: error instanceof Error ? error.message : "Registration failed",
        fieldErrors: error instanceof Error && "issues" in error ? error.issues : null
      },
      { status: 400 }
    );
  }
};

export default function Register() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
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
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription>
              Sign up to start shopping with us
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

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
                  placeholder="Create a password"
                  {...register("password")}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              {actionData?.error && (
                <div className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded">
                  {actionData.error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
