export type PermitStatus =
  | "draft"
  | "submitted"
  | "inReview"
  | "addDockRequired"
  | "approved"
  | "rejected";

export const statusLabels: Record<PermitStatus, string> = {
  draft: "Entwurf",
  submitted: "Eingereicht",
  inReview: "In Prüfung",
  addDockRequired: "Unterlagen nachreichen",
  approved: "Genehmigt",
  rejected: "Abgelehnt",
};

export type Permit = {
  id: string;
  userId: string;
  facilityName?: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  location?: string;
  submittedAt?: string;
  capacity?: number;
  hasPermit?: boolean;
  documents?: string[];
  status: PermitStatus;
  rejectionReason?: string;
};
