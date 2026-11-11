// Brand mark: a barbell seen from the side, drawn from five bars.
export function LogoMark({ className = "h-5 w-auto" }) {
  return (
    <svg viewBox="0 0 28 20" className={className} aria-hidden="true" fill="currentColor">
      <rect x="0" y="5" width="3.5" height="10" rx="1.75" />
      <rect x="5" y="0" width="4.5" height="20" rx="2.25" />
      <rect x="9.5" y="8.25" width="9" height="3.5" />
      <rect x="18.5" y="0" width="4.5" height="20" rx="2.25" />
      <rect x="24.5" y="5" width="3.5" height="10" rx="1.75" />
    </svg>
  );
}

export default function Logo({ className = "", markClassName = "h-[18px] w-auto text-lime-deep" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={markClassName} />
      <span className="font-display text-[19px] leading-none">Formada</span>
    </span>
  );
}
