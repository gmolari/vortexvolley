import { testDbConnection } from "@/services/db-test.action";
import Image from "next/image";

export default async function Home() {
  const a = testDbConnection();

  return (
    <div className="flex flex-col gap-8 min-h-screen items-center justify-center bg-zinc-50 font-geist-mono dark:bg-black">
      <span className="text-gray-400">
        DB Connection:{" "}
        <span className="text-white">{JSON.stringify(await a)}</span>
      </span>

      <span className="text-2xl font-bold">Vortex Volley</span>
    </div>
  );
}
