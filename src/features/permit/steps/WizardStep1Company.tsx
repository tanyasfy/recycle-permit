import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { PermitFormInput } from "../permitSchema";

interface Props {
  register: UseFormRegister<PermitFormInput>;
  errors: FieldErrors<PermitFormInput>;
}

export function WizardStep1Company({ register, errors }: Props) {
  return (
    <div className="formStep">
      <h2>Unternehmensdaten</h2>

      <label>
        Unternehmensname
        <input {...register("companyName")} autoFocus />
        {errors.companyName && (
          <span className="error" role="alert">
            {errors.companyName.message}
          </span>
        )}
      </label>

      <label>
        Kontaktperson
        <input {...register("contactPerson")} />
        {errors.contactPerson && (
          <span className="error" role="alert">
            {errors.contactPerson.message}
          </span>
        )}
      </label>

      <label>
        E-Mail
        <input type="email" {...register("email")} />
        {errors.email && (
          <span className="error" role="alert">
            {errors.email.message}
          </span>
        )}
      </label>
    </div>
  );
}
