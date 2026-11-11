import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useHeading } from "../context/PreviewContext.jsx";

// Title row of an app screen: optional back link, the h1, one grey line about
// the data, and the screen's actions on the right.
export default function PageHeader({ title, subtitle, back, children }) {
  const Title = useHeading("h1");
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
      <div className="min-w-0">
        {back && (
          <Link to={back.to} className="mb-1.5 inline-flex items-center gap-1 text-[14px] text-muted hover:text-ink">
            <ChevronLeft size={15} aria-hidden="true" />
            {back.label}
          </Link>
        )}
        <Title className="font-display text-[24px] leading-[1.15] sm:text-[26px]">{title}</Title>
        {subtitle && <p className="mt-1 text-[14px] text-muted sm:text-[15px]">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
