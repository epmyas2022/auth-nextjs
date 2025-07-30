"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInSchema } from "../schemas/auth.schema";
import { signInAction } from "../server/actions";

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    await signInAction(data);
  };
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="email">
          Email:
        </label>
        <input
          {...register("email")}
          autoComplete="email"
          className="textinput"
          placeholder="user@mail.com"
          type="email"
          id="email"
          name="email"
          required
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="password">
          Contraseña:
        </label>
        <input
          {...register("password")}
          autoComplete="current-password"
          placeholder="******"
          className="textinput"
          type="password"
          id="password"
          name="password"
          required
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </div>
      <button
        type="submit"
        className="bg-sky-500 text-white py-3 px-6 rounded-full font-bold cursor-pointer mt-2"
      >
        Iniciar sesión
      </button>

      <div className="flex justify-center items-center gap-4 mt-2">
        <div className="bg-gray-200 py-2 px-4 rounded-full">
          <Link
            href="/api/oauth/github"
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2 font-bold"
          >
            <span className="mdi mdi-github text-2xl"></span>
            Iniciar sesión con GitHub
          </Link>
        </div>
      </div>
      <p className="text-gray-600 mt-2 text-sm text-center">
        ¿No tienes una cuenta?{" "}
        <Link href="/sign-up" className="underline font-bold">
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
}
