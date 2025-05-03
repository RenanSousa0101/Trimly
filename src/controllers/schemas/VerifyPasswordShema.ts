import { z } from "zod";

const passwordRequirements = z.string()
  .min(8, "A senha deve ter pelo menos 8 caracteres.")
  .max(50, "A senha não pode ter mais de 50 caracteres.")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número.")

export const GetPassword = z.object({
    password: passwordRequirements,
})