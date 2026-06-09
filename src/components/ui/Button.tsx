import type { CSSProperties } from "react";
import "./Button.css";

interface ButtonProps {
  type?: "button" | "submit";
  style: "primaryButton" | "secondaryButton" | "tertiaryButton";
  title: string;
  onClick?: () => void;
  className?: string;
  buttonStyle?: CSSProperties;
}

export function Button({
  type = "button",
  style,
  title,
  onClick,
  className,
  buttonStyle,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[style, className].filter(Boolean).join(" ")}
      style={buttonStyle}
      onClick={onClick}
    >
      {title}
    </button>
  );
}
