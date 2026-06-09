import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { PermitWizard } from "../features/permit/PermitWizard";
import { permitService } from "../features/permit/permitService";
import type { Permit } from "../features/permit/permit.types";

export function EditPermitPage() {
  const { id } = useParams<{ id: string }>();
  const [draft, setDraft] = useState<Permit | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    permitService.getPermitById(id).then((permit) => {
      setDraft(permit);
      setLoading(false);
    });
  }, [id]);

  if (loading) return null;

  return <PermitWizard draft={draft} />;
}
