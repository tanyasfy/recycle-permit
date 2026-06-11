import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { PermitFormInput } from "../permitSchema";

interface Props {
  register: UseFormRegister<PermitFormInput>;
  errors: FieldErrors<PermitFormInput>;
  documents: string[];
  onFileChange: (files: FileList | null) => void;
}

export function WizardStep3Documents({
  register,
  errors,
  documents,
  onFileChange,
}: Props) {
  return (
    <div className="formStep">
      <h2>Dokumente hochladen</h2>

      <label>
        Unterlagen
        <input
          type="file"
          multiple
          onChange={(e) => onFileChange(e.target.files)}
        />
        {errors.documents && (
          <span className="error" role="alert">
            {errors.documents.message}
          </span>
        )}
      </label>

      {documents.length > 0 && (
        <ul className="documentList">
          {documents.map((doc) => (
            <li key={doc}>{doc}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
