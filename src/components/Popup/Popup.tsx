import "./Popup.css";

interface PopupProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
}

export function Popup({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
}: PopupProps) {
  if (!isOpen) return null;

  return (
    <div className="popupOverlay" onClick={onClose}>
      <div className="popupContent" onClick={(e) => e.stopPropagation()}>
        <div className="popupHeader">
          {title && <h2 className="popupTitle">{title}</h2>}
          {showCloseButton && (
            <button
              className="popupCloseButton"
              onClick={onClose}
              aria-label="Schließen"
            >
              ✕
            </button>
          )}
        </div>
        <div className="popupBody">{children}</div>
      </div>
    </div>
  );
}
