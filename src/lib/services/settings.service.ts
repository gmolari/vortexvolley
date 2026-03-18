"use server";

import { db } from "@/lib/db";
import { siteSettings } from "@/../drizzle/schema";
import { eq } from "drizzle-orm";

export async function getSetting(key: string): Promise<string | null> {
  const setting = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.key, key),
  });
  return setting?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  const existing = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.key, key),
  });

  if (existing) {
    await db
      .update(siteSettings)
      .set({ value, updatedAt: new Date() })
      .where(eq(siteSettings.key, key));
  } else {
    await db.insert(siteSettings).values({ key, value });
  }
}

export async function getGlobalEmail(): Promise<string | null> {
  return getSetting("global_notification_email");
}

export async function setGlobalEmail(email: string) {
  return setSetting("global_notification_email", email);
}
