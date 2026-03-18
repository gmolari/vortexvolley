import { db } from "../src/lib/db";
import { users } from "../drizzle/schema";
import { hash } from "bcryptjs";

async function seedAdmin() {
  const username = "admin";
  const password = "admin123";

  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.username, username),
  });

  if (existing) {
    console.log("Admin já existe:", username);
    process.exit(0);
  }

  const hashedPassword = await hash(password, 12);

  await db.insert(users).values({
    username,
    password: hashedPassword,
    firstName: "Admin",
    lastName: "Vortex",
    nickname: "admin",
    cargo: "Administrador",
    role: "ADMIN",
  });

  console.log("Admin criado com sucesso!");
  console.log(`Usuário: ${username}`);
  console.log(`Senha: ${password}`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Erro ao criar admin:", err);
  process.exit(1);
});
