import { db } from "../src/lib/db";
import { users } from "../drizzle/schema";
import { hash } from "bcryptjs";

async function seedAdmin() {
  const email = "admin@vortexvolley.com";
  const password = "admin123";

  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (existing) {
    console.log("Admin já existe:", email);
    process.exit(0);
  }

  const hashedPassword = await hash(password, 12);

  await db.insert(users).values({
    fullName: "Admin Vortex",
    username: "admin",
    email,
    password: hashedPassword,
    phone: "43999999999",
    birthDate: "1990-01-01",
    role: "ADMIN",
  });

  console.log("Admin criado com sucesso!");
  console.log(`Email: ${email}`);
  console.log(`Senha: ${password}`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Erro ao criar admin:", err);
  process.exit(1);
});
