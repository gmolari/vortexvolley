"use server";

import { db } from "@/lib/db";
import { users } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";

export async function createUser(data: {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  role?: "MEMBER" | "ADMIN" | "OWNER";
}) {
  const hashedPassword = await hash(data.password, 12);
  const [user] = await db
    .insert(users)
    .values({
      ...data,
      password: hashedPassword,
      role: data.role || "MEMBER",
    })
    .returning();

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getUserById(id: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  if (!user) return null;
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getUsers() {
  const result = await db.query.users.findMany();
  return result.map(({ password: _, ...user }) => user);
}
