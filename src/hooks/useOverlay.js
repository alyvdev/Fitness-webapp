import { useEffect } from "react";

// Shared behaviour for modals and drawers: Escape closes, the page behind
// does not scroll, and focus returns to where it was.
export default function useOverlay(open, onClose, panelRef) {
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef?.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
    // onClose and panelRef are stable enough for a demo; re-running on every
    // render would steal focus from the fields inside the dialog.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}
