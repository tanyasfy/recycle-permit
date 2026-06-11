import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { PermitFormInput } from "../permitSchema";

interface Props {
  register: UseFormRegister<PermitFormInput>;
  errors: FieldErrors<PermitFormInput>;
}

export function WizardStep2Facility({ register, errors }: Props) {
  return (
    <div className="formStep">
      <h2>Angaben zur Recyclinganlage</h2>

      <label>
        Name der Anlage
        <input {...register("facilityName")} />
        {errors.facilityName && (
          <span className="error" role="alert">
            {errors.facilityName.message}
          </span>
        )}
      </label>

      <label>
        Standort
        <input {...register("location")} />
        {errors.location && (
          <span className="error" role="alert">
            {errors.location.message}
          </span>
        )}
      </label>

      <label>
        Kapazität pro Jahr
        <input
          type="number"
          {...register("capacity", { valueAsNumber: true })}
        />
        {errors.capacity && (
          <span className="error" role="alert">
            {errors.capacity.message}
          </span>
        )}
      </label>

      <label className="checkboxLabel">
        <input type="checkbox" {...register("hasPermit")} />
        Genehmigung liegt bereits vor
      </label>
    </div>
  );
}
