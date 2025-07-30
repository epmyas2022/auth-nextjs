import { z } from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});


//TODO: Validar confirmPassword

export const signUpSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(6).max(100),
  confirmPassword: z.string().min(6).max(100),
});
