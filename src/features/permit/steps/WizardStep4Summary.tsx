import type { PermitFormData } from "../permitSchema";

interface Props {
  formValues: PermitFormData;
}

export function WizardStep4Summary({ formValues }: Props) {
  return (
    <div className="formStep">
      <h2>Zusammenfassung</h2>

      <div className="summaryGrid">
        <div>
          <strong>Unternehmen</strong>
          <p>{formValues.companyName}</p>
        </div>
        <div>
          <strong>Kontaktperson</strong>
          <p>{formValues.contactPerson}</p>
        </div>
        <div>
          <strong>E-Mail</strong>
          <p>{formValues.email}</p>
        </div>
        <div>
          <strong>Anlage</strong>
          <p>{formValues.facilityName}</p>
        </div>
        <div>
          <strong>Standort</strong>
          <p>{formValues.location}</p>
        </div>
        <div>
          <strong>Kapazität</strong>
          <p>{formValues.capacity} t/Jahr</p>
        </div>
      </div>
    </div>
  );
}
