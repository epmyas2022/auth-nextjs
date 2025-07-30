import Link from "next/link";
import { getSession } from "../auth/core/session";
import { cookies } from "next/headers";
import LogOutButton from "@/auth/next/components/LogOutButton";
export default async function Home() {
  const session = await getSession(await cookies());
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Authorization
        </h1>
        <p className="max-w-2xl">
          Este es un ejemplo de aplicación de autorización con Next.js y Drizzle
          ORM. Usando Autorizacion Estandar y OAuth
        </p>
        {!session ? (
          <div className="flex gap-2 items-center">
            <Link
              className="bg-sky-500 text-white py-3 px-6 rounded-full font-bold"
              href="/sign-in"
            >
              Sign In
            </Link>
            <Link
              className="bg-black text-white py-3 px-6 rounded-full font-bold"
              href="/sign-up"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Bienvenido, {session.name}</h1>

            <div className="w-sm">
              <LogOutButton />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
