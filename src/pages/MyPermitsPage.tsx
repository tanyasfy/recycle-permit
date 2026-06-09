import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/hooks";
import "./MyPermitsPage.css";
import {
  statusLabels,
  type Permit,
  type PermitStatus,
} from "../types/permitsTypes";
import { permitService } from "../features/permit/permitService";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { ConfirmPopup } from "../components/Popup/ConfirmPopup";
import { Popup } from "../components/Popup/Popup";

export function MyPermitsPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [permits, setPermits] = useState<Permit[]>([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<PermitStatus | null>(null);

  const availableStatuses = Array.from(new Set(permits.map((p) => p.status)));
  const filteredPermits = activeFilter
    ? permits.filter((p) => p.status === activeFilter)
    : permits;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    permitService.getPermitsByUserId(user.id).then(setPermits);
  }, [user]);

  const handleDelete = async () => {
    if (!confirmId) return;

    try {
      await permitService.deletePermit(confirmId);
      setPermits((prev) => prev.filter((p) => p.id !== confirmId));
      setTitle("Entwurf wurde erfolgreich gelöscht");
    } catch (e) {
      console.error(e);
      setTitle("Etwas ist schiffgelaufen. Versuchen Sie es bitte erneut.");
    } finally {
      setConfirmId(null);
      setOpenPopup(true);
    }
  };

  return (
    <section className="myPermitsPage">
      <div className="pageHeader">
        <p className="eyebrow">Meine Anträge</p>
        <h1>Anträge verwalten</h1>
        <p>
          Hier finden Sie Ihre Entwürfe, eingereichten Anträge und den aktuellen
          Bearbeitungsstatus.
        </p>
      </div>

      <div className="permitsToolbar">
        <div className="filterBar">
          <button
            className={`filterChip${activeFilter === null ? " filterChipActive" : ""}`}
            onClick={() => setActiveFilter(null)}
          >
            Alle
          </button>
          {availableStatuses.map((status) => (
            <button
              key={status}
              className={`filterChip${activeFilter === status ? " filterChipActive" : ""}`}
              onClick={() =>
                setActiveFilter(activeFilter === status ? null : status)
              }
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
        <Link to="/permit/new" className="primaryButton">
          Neuen Antrag erstellen
        </Link>
      </div>

      <div className="permitsGrid">
        {filteredPermits.map((permit) => (
          <article key={permit.id} className="permitCard">
            <div className="permitCardHeader">
              <div>
                <span className="permitId">{permit.id}</span>
                <h2>{permit.facilityName}</h2>
              </div>

              <span className={`statusBadge ${permit.status}`}>
                {statusLabels[permit.status]}
              </span>
            </div>

            <div className="permitDetails">
              <div>
                <span>Unternehmen</span>
                <strong>{permit.companyName}</strong>
              </div>

              <div>
                <span>Datum</span>
                <strong>{permit.submittedAt}</strong>
              </div>
            </div>

            <div className="permitActions">
              <Button
                onClick={() => navigate(`/permit/${permit.id}`)}
                style="secondaryButton"
                title="Details ansehen"
              />

              {permit.status === "draft" && (
                <>
                  <Button
                    onClick={() => navigate(`/permit/${permit.id}/edit`)}
                    style="primaryButton"
                    title="Entwurf fortsetzen"
                  />
                  <Button
                    onClick={() => setConfirmId(permit.id)}
                    style="secondaryButton"
                    title="Löschen"
                  />
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      <ConfirmPopup
        isOpen={confirmId !== null}
        title="Antrag löschen"
        message="Möchten Sie diesen Antrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmLabel="Löschen"
        cancelLabel="Abbrechen"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />

      <Popup
        isOpen={openPopup}
        onClose={() => {
          setOpenPopup(false);
        }}
        title={title}
      />
    </section>
  );
}
