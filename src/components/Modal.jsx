import { useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import useOverlay from "../hooks/useOverlay.js";

const SIZES = { sm: "sm:max-w-[400px]", md: "sm:max-w-[520px]", lg: "sm:max-w-[720px]", xl: "sm:max-w-[920px]" };

// Centred dialog on desktop, bottom sheet on a phone.
export default function Modal({ open, onClose, title, description, children, footer, size = "md" }) {
  const panel = useRef(null);
  useOverlay(open, onClose, panel);
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="overlay-in absolute inset-0 bg-ink/55" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`modal-in relative flex max-h-[92dvh] w-full flex-col rounded-t-[20px] bg-sheet shadow-[0_24px_64px_rgba(14,18,15,0.28)] outline-none sm:rounded-[20px] ${SIZES[size]}`}
      >
        <header className="flex items-start justify-between gap-4 px-5 pb-3 pt-5 sm:px-6">
          <div className="min-w-0">
            <h2 className="text-[18px] font-semibold leading-tight">{title}</h2>
            {description && <p className="mt-1 text-[14px] text-muted">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-icon -mr-1 -mt-1 flex-none" aria-label="Bağla">
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-6">{children}</div>
        {footer && (
          <footer className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))] sm:px-6">{footer}</footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
