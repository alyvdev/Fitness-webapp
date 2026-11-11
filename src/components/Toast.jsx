import { Link } from "react-router-dom";
import { AlertTriangle, Check, Info, X } from "lucide-react";
import { useDemo } from "../context/DemoContext.jsx";

const ICONS = { success: Check, info: Info, warn: AlertTriangle };

export default function ToastViewport() {
  const { toasts, dismissToast } = useDemo();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[76px] z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6" role="status" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.tone] ?? Check;
        return (
          <div
            key={toast.id}
            className="toast-in on-dark pointer-events-auto flex w-full max-w-[440px] items-center gap-3 rounded-xl bg-ink py-2.5 pl-3.5 pr-2 text-[14px] text-white shadow-[0_12px_32px_rgba(14,18,15,0.3)]"
          >
            <span className={`flex h-6 w-6 flex-none items-center justify-center rounded-full ${toast.tone === "warn" ? "bg-amber-soft text-amber" : "bg-lime text-ink"}`}>
              <Icon size={14} strokeWidth={2.5} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 leading-snug">{toast.message}</span>
            {toast.action && (
              <Link to={toast.action.to} onClick={() => dismissToast(toast.id)} className="flex-none rounded-lg px-2.5 py-1.5 font-semibold text-lime hover:bg-white/10">
                {toast.action.label}
              </Link>
            )}
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Bildirişi bağla"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
