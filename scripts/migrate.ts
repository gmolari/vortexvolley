import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const sql = postgres(connectionString, { ssl: "require" });

async function migrate() {
  console.log("Running migration...");

  // Create new enums
  await sql`DO $$ BEGIN
    CREATE TYPE sale_item_status AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED', 'NEAR', 'DRAFT');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$`;

  await sql`DO $$ BEGIN
    CREATE TYPE section_status AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$`;

  console.log("✓ Enums created");

  // Alter sale_items table
  await sql`ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS status sale_item_status NOT NULL DEFAULT 'DRAFT'`;
  await sql`ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS starts_at TIMESTAMP`;
  await sql`ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP`;

  console.log("✓ sale_items updated");

  // Alter landing_sections table
  await sql`ALTER TABLE landing_sections ADD COLUMN IF NOT EXISTS description TEXT`;
  await sql`ALTER TABLE landing_sections ADD COLUMN IF NOT EXISTS status section_status NOT NULL DEFAULT 'DRAFT'`;
  await sql`ALTER TABLE landing_sections ADD COLUMN IF NOT EXISTS config JSONB`;

  console.log("✓ landing_sections updated");

  // Alter users table - add new columns
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname VARCHAR(100)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS cargo VARCHAR(100)`;

  // Migrate data from full_name to first_name + last_name
  await sql`UPDATE users SET first_name = split_part(full_name, ' ', 1), last_name = CASE WHEN position(' ' IN full_name) > 0 THEN substring(full_name from position(' ' IN full_name) + 1) ELSE '' END WHERE first_name IS NULL AND full_name IS NOT NULL`;

  // Set defaults for NOT NULL columns
  await sql`UPDATE users SET first_name = 'Admin' WHERE first_name IS NULL`;
  await sql`UPDATE users SET last_name = '' WHERE last_name IS NULL`;

  // Make first_name and last_name NOT NULL
  await sql`ALTER TABLE users ALTER COLUMN first_name SET NOT NULL`;
  await sql`ALTER TABLE users ALTER COLUMN last_name SET NOT NULL`;

  // Make email, phone, birth_date nullable
  await sql`ALTER TABLE users ALTER COLUMN email DROP NOT NULL`;
  await sql`ALTER TABLE users ALTER COLUMN phone DROP NOT NULL`;
  await sql`ALTER TABLE users ALTER COLUMN birth_date DROP NOT NULL`;

  // Drop old columns that are no longer in schema
  await sql`ALTER TABLE users DROP COLUMN IF EXISTS full_name`;
  await sql`ALTER TABLE users DROP COLUMN IF EXISTS avatar_base64`;

  console.log("✓ users updated");

  // Create audit_logs table
  await sql`CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    username VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id VARCHAR(255),
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
  )`;

  console.log("✓ audit_logs created");

  // Set existing active sale items to ACTIVE status
  await sql`UPDATE sale_items SET status = 'ACTIVE' WHERE active = true AND status = 'DRAFT'`;

  // Set existing visible sections to ACTIVE status
  await sql`UPDATE landing_sections SET status = 'ACTIVE' WHERE visible = true AND status = 'DRAFT'`;

  console.log("✓ Migration complete!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
