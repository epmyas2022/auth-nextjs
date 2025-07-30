"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "../schemas/auth.schema";
import { signUpAction } from "../server/actions";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>();

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    console.log("Form data:", data);
    await signUpAction(data);
  };
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="name">
          Nombre:
        </label>
        <input
          {...register("name")}
          className="textinput"
          placeholder="John Doe"
          type="text"
          id="name"
          name="name"
          required
        />
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="email">
          Email:
        </label>
        <input
          {...register("email")}
          className="textinput"
          autoComplete="email"
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
          placeholder="******"
          autoComplete="new-password"
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

      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="confirmPassword">
          Confirmar contraseña:
        </label>
        <input
          {...register("confirmPassword")}
          placeholder="******"
          autoComplete="new-password"
          className="textinput"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
        />
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="bg-sky-500 text-white py-3 px-6 rounded-full font-bold cursor-pointer mt-2"
      >
        Registrarse
      </button>

      <p className="text-gray-600 mt-2 text-sm text-center">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/sign-in" className="underline font-bold">
          Inicia sesión aquí
        </Link>
      </p>
    </form>
  );
}
