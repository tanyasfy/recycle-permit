import { z } from "zod";

export const authSchema = z.object({
  loginId: z
    .string()
    .min(5, "Der Benutzername muss mindestens 5 Zeichen enthalten."),
  password: z
    .string()
    .min(5, "Das Passwort muss mindestens 5 Zeichen enthalten."),
});

export type AuthFormData = z.input<typeof authSchema>;
