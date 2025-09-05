import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { createCookieSessionStorage } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { prisma } from "./db.server";
import type { User } from "@prisma/client";

// Create session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "default-secret"],
    secure: process.env.NODE_ENV === "production",
  },
});

// Create authenticator
export const authenticator = new Authenticator<User>(sessionStorage);

// Form strategy for login
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    return user;
  }),
  "form"
);

// Helper functions
export const getUser = async (request: Request): Promise<User | null> => {
  try {
    return await authenticator.isAuthenticated(request);
  } catch {
    return null;
  }
};

export const requireUser = async (request: Request): Promise<User> => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return user;
};

export const requireAdmin = async (request: Request): Promise<User> => {
  const user = await requireUser(request);
  if (user.role !== "ADMIN") {
    throw new Response("Forbidden", { status: 403 });
  }
  return user;
};

export const createUser = async (data: {
  email: string;
  password: string;
  name?: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 12);
  
  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};

export { sessionStorage };
