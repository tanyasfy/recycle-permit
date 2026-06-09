import { useState } from "react";
import { AuthModal } from "../features/auth/AuthModal";
import { useAppSelector } from "../hooks/hooks";
import "./StartPage.css";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/Button";

export function StartPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/permit/new");
    }
  };

  return (
    <main className="start-page">
      <section className={user ? "hero heroGrid" : "hero heroCentered"}>
        <div>
          <h1 className="eyebrow">
            Digitale Antragstellung für Recyclinganlagen
          </h1>
          <p className="heroText">
            Stellen Sie Ihren Antrag Schritt für Schritt und behalten Sie den
            Bearbeitungsstatus jederzeit im Blick.
          </p>

          <div className="heroActions">
            <Button
              style="primaryButton"
              onClick={handleClick}
              title="Neuen Antrag erstellen"
              buttonStyle={{ fontWeight: 700, fontSize: "16px" }}
            />
            {user && (
              <Button
                style="secondaryButton"
                onClick={() => navigate("/permits")}
                title="Meine Anträge ansehen"
                buttonStyle={{ fontWeight: 700, fontSize: "16px" }}
              />
            )}
          </div>
        </div>

        {user && (
          <div className="infoBox">
            <span className="infoLabel">Aktueller Status</span>
            <strong>{user.drafts} Entwürfe</strong>
            <p>Sie können begonnene Anträge jederzeit fortsetzen.</p>
          </div>
        )}
      </section>

      <section className="taskSection">
        <div className="sectionHeader">
          <h2>Was können Sie hier tun?</h2>
        </div>

        <div className="taskGrid">
          <div className="taskCard">
            <span>01</span>
            <h3>Zulassung beantragen</h3>
            <p>Starten Sie einen neuen Antrag für eine Recyclinganlage.</p>
          </div>

          <div className="taskCard">
            <span>02</span>
            <h3>Anträge verwalten</h3>
            <p>Bearbeiten Sie Entwürfe oder prüfen Sie eingereichte Anträge.</p>
          </div>

          <div className="taskCard">
            <span>03</span>
            <h3>Status prüfen</h3>
            <p>Verfolgen Sie den aktuellen Bearbeitungsstand transparent.</p>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={openAuthModal}
        onClose={() => setOpenAuthModal(false)}
        navigateTo="/permit/new"
      />
    </main>
  );
}
