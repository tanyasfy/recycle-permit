import { useParams } from "react-router";
import { PermitWizard } from "../features/permit/PermitWizard";
import { usePermit } from "../hooks/usePermit";

export function EditPermitPage() {
  const { id } = useParams<{ id: string }>();

  const { permit, loading } = usePermit(id);

  if (loading)
    return <h2>Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.</h2>;

  return <PermitWizard draft={permit} />;
}
