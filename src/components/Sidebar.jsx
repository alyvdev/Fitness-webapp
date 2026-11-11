import { Link, useLocation } from "react-router-dom";
import { CalendarDays, ClipboardList, Dumbbell, LayoutGrid, Smartphone, Sparkles, Users } from "lucide-react";
import Logo from "./Logo.jsx";
import { draftExerciseCount, useDemo } from "../context/DemoContext.jsx";

export const NAV_ITEMS = [
  { to: "/dashboard", label: "İdarə paneli", short: "Panel", icon: LayoutGrid },
  { to: "/equipment", label: "Aparat kitabxanası", short: "Aparatlar", icon: Dumbbell },
  { to: "/students", label: "Tələbələr", short: "Tələbələr", icon: Users },
  { to: "/programs", label: "Proqramlar", short: "Proqramlar", icon: ClipboardList },
  { to: "/schedule", label: "Cədvəl", short: "Cədvəl", icon: CalendarDays },
];

// `activePath` lets the landing page render a static copy with a chosen item active.
export default function Sidebar({ activePath, className = "" }) {
  const location = useLocation();
  const { draft, setRole } = useDemo();
  const path = activePath ?? location.pathname;
  const draftCount = draftExerciseCount(draft);

  return (
    <aside className={`flex w-[232px] flex-none flex-col px-3 pb-4 ${className}`}>
      <Link to="/" className="flex h-12 items-center px-2.5" aria-label="Formada — tanıtım səhifəsi">
        <Logo />
      </Link>

      <nav aria-label="Müəllim paneli" className="mt-3 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = path.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className={`flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[14px] transition-colors ${
                active ? "bg-active font-medium text-ink" : "text-muted hover:bg-active/60 hover:text-ink"
              }`}
            >
              <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
              <span className="flex-1">{label}</span>
              {to === "/programs" && draftCount > 0 && (
                <span className="tnum rounded-full bg-lime px-1.5 text-[12px] font-semibold leading-5 text-ink" title="Qaralamadakı hərəkətlər">
                  <span className="sr-only">Qaralamada </span>
                  {draftCount}
                  <span className="sr-only"> hərəkət</span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-0.5">
        <Link
          to="/student-demo"
          onClick={() => setRole("student")}
          className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[14px] text-muted transition-colors hover:bg-active/60 hover:text-ink"
        >
          <Smartphone size={16} strokeWidth={1.75} aria-hidden="true" />
          Tələbə görünüşü
        </Link>
        <div className="flex h-9 items-center gap-2.5 px-2.5 text-[14px] text-muted">
          <Sparkles size={16} strokeWidth={1.75} aria-hidden="true" />
          <span className="flex-1">AI təhlil</span>
          <span className="rounded-full bg-active px-2 text-[12px] leading-5 text-muted">Tezliklə</span>
        </div>
      </div>
    </aside>
  );
}
