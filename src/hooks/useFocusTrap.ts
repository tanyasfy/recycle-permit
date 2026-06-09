import { useEffect, useRef } from "react";

export function useFocusTrap<T extends HTMLElement>(isActive: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!isActive) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const container = ref.current;
      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>("input, button"),
      ).filter((el) => !el.hasAttribute("disabled"));

      if (focusable.length === 0) return;

      e.preventDefault();

      const currentIndex = focusable.indexOf(
        document.activeElement as HTMLElement,
      );

      if (e.shiftKey) {
        const prev =
          currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1;
        focusable[prev].focus();
      } else {
        const next =
          currentIndex >= focusable.length - 1 ? 0 : currentIndex + 1;
        focusable[next].focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isActive]);

  return ref;
}
