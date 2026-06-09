import { z } from "zod";

export const permitSchema = z.object({
  companyName: z.string().min(2, "Bitte geben Sie den Unternehmensnamen ein."),
  contactPerson: z.string().min(2, "Bitte geben Sie eine Kontaktperson ein."),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),

  facilityName: z.string().min(2, "Bitte geben Sie den Namen der Anlage ein."),
  location: z.string().min(2, "Bitte geben Sie den Standort ein."),
  capacity: z.number().positive("Die Kapazität muss größer als 0 sein."),

  hasPermit: z.boolean(),
  documents: z
    .array(z.string())
    .min(1, "Bitte laden Sie mindestens ein Dokument hoch."),
});

export type PermitFormInput = z.input<typeof permitSchema>;
export type PermitFormData = z.infer<typeof permitSchema>;
