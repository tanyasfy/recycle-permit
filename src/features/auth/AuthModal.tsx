import "./AuthModal.css";
import { useForm } from "react-hook-form";
import { Popup } from "../../components/Popup/Popup";
import { useEffect, useState } from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { authService } from "./authService";
import type { LoginRequest } from "../../types/authTypes";
import { useAppDispatch } from "../../hooks/hooks";
import { loginMockUser, setDraftCount } from "../../store/authSlice";
import { authSchema, type AuthFormInput } from "./authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/Button";
import { permitService } from "../permit/permitService";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigateTo?: string;
}

const defaultValues = {
  password: "",
  loginId: "",
};

export function AuthModal({
  isOpen,
  onClose,
  navigateTo = "/permits",
}: AuthModalProps) {
  const [stayLogged, setStayLogged] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  const sectionRef = useFocusTrap<HTMLElement>(isOpen);

  const stepFields: Array<keyof AuthFormInput> = ["loginId", "password"];

  const {
    register,
    handleSubmit,
    trigger,
    setFocus,
    formState: { errors },
  } = useForm<AuthFormInput, unknown, LoginRequest>({
    resolver: zodResolver(authSchema),
    defaultValues,
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginRequest) => {
    const isValid = await trigger(stepFields);
    if (!isValid) return;

    try {
      const user = await authService.login(data);
      const draftCount = await permitService.getDraftCount(user.id);
      dispatch(loginMockUser());
      dispatch(setDraftCount(draftCount));
      onClose();

      navigate(navigateTo);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) setFocus("loginId");
  }, [setFocus, isOpen]);

  return (
    <Popup isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <section ref={sectionRef}>
        <form className="wizardCard" onSubmit={handleSubmit(onSubmit)}>
          <div className="formStep">
            <h2>Schon angemeldet?</h2>
            <p>
              Dann melden Sie sich bitte mit Ihrer Benutzer-ID und Ihrem
              Passwort an.
            </p>

            <label>
              Benutzer-Id
              <input {...register("loginId")} />
              {errors.loginId && (
                <span className="error">{errors.loginId.message}</span>
              )}
            </label>

            <label>
              Passwort
              <input {...register("password")} />
              {errors.password && (
                <span className="error">{errors.password.message}</span>
              )}
            </label>

            <label className="checkboxLabel">
              <input
                type="checkbox"
                checked={stayLogged}
                onChange={(prev) => setStayLogged(!prev)}
              />
              Angemeldet bleiben
            </label>
          </div>

          <div className="authActions">
            <Button
              type="button"
              style="secondaryButton"
              onClick={onClose}
              title="Abbrechen"
            />
            <Button type="submit" style="primaryButton" title="Anmelden" />
          </div>
        </form>

        <div className="accordion">
          <button
            type="button"
            className="accordionTrigger"
            onClick={() => setShowHelp(!showHelp)}
            aria-expanded={showHelp}
          >
            Sie haben noch keine Benutzer-ID?
            <span className="accordionIcon">{showHelp ? "▲" : "▼"}</span>
          </button>
          {showHelp && (
            <div className="accordionContent">
              <p>
                Sie haben noch keine Benutzer-ID? Dann müssen Sie sich zunächst
                neu anmelden, um das ear-Portal nutzen zu können. Gegenstand der
                Anmeldung ist u.a. die Eingabe Ihrer Kontaktdaten, die Sie
                einmalig bestätigen müssen. Mit der Anmeldung am ear-Portal wird
                ein Benutzeraccount für Sie eingerichtet.
              </p>
              <p>
                Im Anschluss gelangen Sie nach Eingabe von Benutzer-ID und
                Passwort in das ear-Portal. Dort können Sie Ihre Daten
                verwalten, je nach Benutzeraccount Anträge stellen bzw.
                Mengenmitteilungen abgeben.
              </p>
            </div>
          )}
        </div>
      </section>
    </Popup>
  );
}
