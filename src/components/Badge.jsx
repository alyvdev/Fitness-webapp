const TONES = {
  neutral: "bg-well text-ink",
  ok: "bg-ok-soft text-ok",
  danger: "bg-danger-soft text-danger",
  lime: "bg-lime-soft text-lime-deep",
  accent: "bg-lime text-ink",
  sky: "bg-sky-soft text-sky",
  amber: "bg-amber-soft text-amber",
  dark: "bg-ink text-white",
};

export default function Badge({ tone = "neutral", children, className = "" }) {
  return (
    <span className={`inline-flex h-6 flex-none items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[12px] font-medium ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}

export const paymentTone = (status) => (status === "Ödənilib" ? "ok" : "danger");
export const classTone = (type) => ({ Fərdi: "lime", Qrup: "dark", Online: "sky" })[type] ?? "neutral";
export const difficultyTone = (difficulty) => ({ Başlanğıc: "ok", Orta: "amber", İrəli: "danger" })[difficulty] ?? "neutral";
