import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  permitSchema,
  type PermitFormData,
  type PermitFormInput,
} from "./permitSchema";

import "./PermitWizard.css";
import { Popup } from "../../components/Popup/Popup";
import { permitService } from "./permitService";
import { useSelector } from "react-redux";
import { type RootState } from "../../store/store";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/Button";
import type { Permit } from "../../types/permitsTypes";
import { useFocusTrap } from "../../hooks/useFocusTrap";

const defaultValues: PermitFormData = {
  companyName: "",
  contactPerson: "",
  email: "",
  facilityName: "",
  location: "",
  capacity: 0,
  hasPermit: false,
  documents: [],
};

const steps = [
  "Unternehmen",
  "Recyclinganlage",
  "Dokumente",
  "Zusammenfassung",
];

const STORAGE_KEY = "permit-form-draft";

interface PermitWizardProps {
  draft?: Permit;
}

export function PermitWizard({ draft }: PermitWizardProps) {
  const wizardRef = useFocusTrap<HTMLElement>(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [openSuccessPopup, setOpenSuccessPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const { user } = useSelector((state: RootState) => state.auth);
  const [filteredSteps, setFilteredSteps] = useState(steps);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    reset,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<PermitFormInput, unknown, PermitFormData>({
    resolver: zodResolver(permitSchema),
    defaultValues,
    mode: "onTouched",
  });

  const formValues = watch();

  const handleNext = async () => {
    const values = getValues();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));

    const stepFields: Array<Array<keyof PermitFormData>> = [
      ["companyName", "contactPerson", "email"],
      ["facilityName", "location", "capacity", "hasPermit"],
      ["documents"],
      [],
    ];

    const isValid = await trigger(stepFields[currentStep]);
    if (!isValid) return;
    setCurrentStep((step) => step + 1);
  };

  const handleBack = () => {
    setCurrentStep((step) => step - 1);
  };

  const onSubmit = async (data: PermitFormData) => {
    try {
      await permitService.createPermit({ ...data, userId: "user-001" });
      reset(defaultValues);
      localStorage.removeItem(STORAGE_KEY);
      setCurrentStep(0);
      setPopupTitle("Antrag wurde erfolgreich eingereicht.");
      setOpenSuccessPopup(true);
    } catch (e) {
      console.error(e);
      setPopupTitle(
        "Es ist ein Fehler eingetretten. Versuchen Sie es noch mal",
      );
      setOpenSuccessPopup(true);
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const fileNames = Array.from(files).map((file) => file.name);
    setValue("documents", fileNames, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const saveDraft = async () => {
    try {
      await permitService.createPermit(
        { ...formValues, userId: "user-001" },
        "draft",
      );
      setPopupTitle("Entwurf wurde erfolgreich gespeichert.");
      setOpenSuccessPopup(true);
    } catch (e) {
      console.error(e);
      setPopupTitle(
        "Es ist ein Fehler eingetretten. Versuchen Sie es noch mal",
      );
    }
  };

  useEffect(() => {
    if (currentStep === 0) {
      setFocus("companyName");
    }

    if (currentStep === 1) {
      setFocus("facilityName");
    }
  }, [currentStep]);

  useEffect(() => {
    if (draft) {
      reset({
        companyName: draft.companyName ?? "",
        contactPerson: draft.contactPerson ?? "",
        email: draft.email ?? "",
        facilityName: draft.facilityName ?? "",
        location: draft.location ?? "",
        capacity: draft.capacity ?? 0,
        hasPermit: draft.hasPermit ?? false,
        documents: draft.documents ?? [],
      });
      return;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      reset(JSON.parse(saved));
    }
  }, [draft, reset]);

  // autosave
  useEffect(() => {
    const subscription = watch((values) => {
      const timer = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      }, 1000);

      return () => clearTimeout(timer);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    setFilteredSteps(() => (user ? steps.slice(0, 4) : steps));
  }, [user]);

  return (
    <section className="wizardPage" ref={wizardRef}>
      <div className="wizardHeader">
        <h1>Antrag auf Zulassung einer Recyclinganlage</h1>
        <p>
          Füllen Sie die Angaben Schritt für Schritt aus. Pflichtfelder werden
          direkt geprüft.
        </p>
      </div>

      <div className="stepper">
        {filteredSteps.map((step, index) => (
          <div
            key={step}
            className={index === currentStep ? "step active" : "step"}
          >
            <span>{index + 1}</span>
            {step}
          </div>
        ))}
      </div>

      <form className="wizardCard" onSubmit={handleSubmit(onSubmit)}>
        {currentStep === 0 && (
          <div className="formStep">
            <h2>Unternehmensdaten</h2>

            <label>
              Unternehmensname
              <input {...register("companyName")} autoFocus />
              {errors.companyName && (
                <span className="error">{errors.companyName.message}</span>
              )}
            </label>

            <label>
              Kontaktperson
              <input {...register("contactPerson")} />
              {errors.contactPerson && (
                <span className="error">{errors.contactPerson.message}</span>
              )}
            </label>

            <label>
              E-Mail
              <input type="email" {...register("email")} />
              {errors.email && (
                <span className="error">{errors.email.message}</span>
              )}
            </label>
          </div>
        )}

        {currentStep === 1 && (
          <div className="formStep">
            <h2>Angaben zur Recyclinganlage</h2>

            <label>
              Name der Anlage
              <input {...register("facilityName")} />
              {errors.facilityName && (
                <span className="error">{errors.facilityName.message}</span>
              )}
            </label>

            <label>
              Standort
              <input {...register("location")} />
              {errors.location && (
                <span className="error">{errors.location.message}</span>
              )}
            </label>

            <label>
              Kapazität pro Jahr
              <input
                type="number"
                {...register("capacity", { valueAsNumber: true })}
              />
              {errors.capacity && (
                <span className="error">{errors.capacity.message}</span>
              )}
            </label>

            <label className="checkboxLabel">
              <input type="checkbox" {...register("hasPermit")} />
              Genehmigung liegt bereits vor
            </label>
          </div>
        )}

        {currentStep === 2 && (
          <div className="formStep">
            <h2>Dokumente hochladen</h2>

            <label>
              Unterlagen
              <input
                type="file"
                multiple
                onChange={(event) => handleFileChange(event.target.files)}
              />
              {errors.documents && (
                <span className="error">{errors.documents.message}</span>
              )}
            </label>

            {(formValues.documents?.length ?? 0) > 0 && (
              <ul className="documentList">
                {formValues.documents.map((document) => (
                  <li key={document}>{document}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {currentStep === 3 && (
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
        )}

        <div className="wizardActions">
          {currentStep > 0 && (
            <button
              type="button"
              className="secondaryButton"
              onClick={handleBack}
            >
              Zurück
            </button>
          )}

          <div className="primaryActions">
            <Button
              style="secondaryButton"
              title="Entwurf speichern"
              onClick={saveDraft}
            />

            {currentStep < filteredSteps.length - 1 && (
              <button
                type="button"
                className="primaryButton"
                onClick={handleNext}
              >
                Weiter
              </button>
            )}
            {currentStep === filteredSteps.length - 1 && (
              <button type="submit" className="primaryButton">
                Antrag absenden
              </button>
            )}
          </div>
        </div>
      </form>

      <Popup
        isOpen={openSuccessPopup}
        onClose={() => {
          setOpenSuccessPopup(false);
          navigate("/permits");
        }}
        title={popupTitle}
      />
    </section>
  );
}
