import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { permitService } from "../features/permit/permitService";
import { statusLabels, type Permit } from "../types/permitsTypes";
import "./PermitDetailPage.css";

export function PermitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [permit, setPermit] = useState<Permit | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    permitService.getPermitById(id).then((result) => {
      setPermit(result);
      setLoading(false);
    });
  }, [id]);

  if (loading) return null;

  if (!permit) {
    return (
      <section className="permitDetailPage">
        <p>Antrag nicht gefunden.</p>
        <Link to="/permits" className="secondaryButton">
          Zurück zu meinen Anträgen
        </Link>
      </section>
    );
  }

  return (
    <section className="permitDetailPage">
      <div className="permitDetailHeader">
        <div>
          <span className="permitId">{permit.id}</span>
          <h1>{permit.facilityName ?? "–"}</h1>
        </div>
        <span className={`statusBadge ${permit.status}`}>
          {statusLabels[permit.status]}
        </span>
      </div>

      <div className="permitDetailGrid">
        <div>
          <span>Unternehmen</span>
          <strong>{permit.companyName ?? "–"}</strong>
        </div>
        <div>
          <span>Kontaktperson</span>
          <strong>{permit.contactPerson ?? "–"}</strong>
        </div>
        <div>
          <span>E-Mail</span>
          <strong>{permit.email ?? "–"}</strong>
        </div>
        <div>
          <span>Standort</span>
          <strong>{permit.location ?? "–"}</strong>
        </div>
        <div>
          <span>Kapazität</span>
          <strong>
            {permit.capacity != null ? `${permit.capacity} t/Jahr` : "–"}
          </strong>
        </div>
        <div>
          <span>Eingereicht am</span>
          <strong>{permit.submittedAt ?? "–"}</strong>
        </div>
        {permit.documents && permit.documents.length > 0 && (
          <div className="permitDetailDocuments">
            <span>Dokumente</span>
            <ul>
              {permit.documents.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {permit.rejectionReason && (
        <div className={`authorityBox ${permit.status}`}>
          <strong>
            {permit.status === "addDockRequired"
              ? "Hinweis des Amtes – Unterlagen nachreichen"
              : "Begründung des Amtes"}
          </strong>
          <p>{permit.rejectionReason}</p>
        </div>
      )}

      <div className="permitDetailActions">
        <Link to="/permits" className="secondaryButton">
          Zurück
        </Link>
        {permit.status === "draft" && (
          <Link to={`/permit/${permit.id}/edit`} className="primaryButton">
            Entwurf fortsetzen
          </Link>
        )}
        {permit.status === "addDockRequired" && (
          <Link to={`/permit/${permit.id}/edit`} className="primaryButton">
            Unterlagen hochladen
          </Link>
        )}
      </div>
    </section>
  );
}
