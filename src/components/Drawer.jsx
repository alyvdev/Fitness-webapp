import { useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import useOverlay from "../hooks/useOverlay.js";

// Panel that slides in from the right; full width on a phone.
export default function Drawer({ open, onClose, title, children, footer }) {
  const panel = useRef(null);
  useOverlay(open, onClose, panel);
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="overlay-in absolute inset-0 bg-ink/45" onClick={onClose} aria-hidden="true" />
      <aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="drawer-in relative flex h-full w-full max-w-[420px] flex-col bg-sheet shadow-[-16px_0_48px_rgba(14,18,15,0.18)] outline-none"
      >
        <header className="flex items-center justify-between gap-4 px-5 py-4">
          <h2 className="min-w-0 text-[18px] font-semibold leading-tight">{title}</h2>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-icon flex-none" aria-label="Bağla">
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>
        {footer && <footer className="flex gap-2 border-t border-line px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">{footer}</footer>}
      </aside>
    </div>,
    document.body,
  );
}
