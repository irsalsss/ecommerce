import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { data, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation, useSubmit } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { authenticator, getUser, createUser } from "~/lib/auth.server";
import { registerSchema, type RegisterFormData } from "~/lib/validations/auth";
import { useRef } from "react";

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
  return data(null, {});
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
    // Handle validation errors from Zod
    if (error && typeof error === "object" && "issues" in error) {
      return {
        status: 400,
        error: "Please check your input and try again",
        fieldErrors: (error as { issues: unknown[] }).issues,
      };
    }

    // Handle other errors (including our beautified Prisma errors)
    return {
      status: 400,
      error: error instanceof Error ? error.message : "Registration failed",
      fieldErrors: null,
    };
  }
};

export default function Register() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "all",
  });

  const onSubmit = (data: RegisterFormData) => {
    if (formRef.current) {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);

      submit(formData, { method: "post" });
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
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription>Sign up to start shopping with us</CardDescription>
          </CardHeader>
          <CardContent>
            <Form
              ref={formRef}
              method="post"
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  {...register("name")}
                  errorMessage={errors.name?.message}
                />
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
                  placeholder="Create a password"
                  {...register("password")}
                  errorMessage={errors.password?.message}
                />
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
                  errorMessage={errors.confirmPassword?.message}
                />
              </div>

              {actionData?.error && (
                <div className="rounded bg-destructive/10 p-3 text-center text-sm text-destructive">
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
