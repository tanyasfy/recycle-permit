import { Button } from "../ui/Button";
import "./Popup.css";
import "./ConfirmPopup.css";

interface ConfirmPopupProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmPopup({
  isOpen,
  title,
  message,
  confirmLabel = "Bestätigen",
  cancelLabel = "Abbrechen",
  onConfirm,
  onCancel,
}: ConfirmPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="popupOverlay" onClick={onCancel}>
      <div
        className="popupContent confirmPopupContent"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="popupTitle">{title}</h2>
        <p className="confirmMessage">{message}</p>
        <div className="confirmActions">
          <Button
            type="button"
            style="secondaryButton"
            title={cancelLabel}
            onClick={onCancel}
          />
          <Button
            type="button"
            style="primaryButton"
            title={confirmLabel}
            onClick={onConfirm}
            buttonStyle={{ background: "#b42318", borderColor: "#b42318" }}
          />
        </div>
      </div>
    </div>
  );
}
