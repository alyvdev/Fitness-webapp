import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo.jsx";
import { useDemo } from "../context/DemoContext.jsx";

export const INSTRUCTOR = { name: "Fuad Rzayev", title: "Fərdi məşqçi" };

// "Demo rejimi" switch between the instructor panel and the student view.
export function RoleToggle({ role }) {
  const navigate = useNavigate();
  const { setRole } = useDemo();
  const go = (next) => {
    setRole(next);
    navigate(next === "teacher" ? "/dashboard" : "/student-demo");
  };
  return (
    <div role="group" aria-label="Demo rejimi" className="flex h-8 items-center rounded-full bg-active p-0.5">
      {[
        { id: "teacher", label: "Müəllim" },
        { id: "student", label: "Tələbə" },
      ].map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={role === option.id}
          onClick={() => go(option.id)}
          className={`h-7 rounded-full px-3 text-[13px] transition-colors ${
            role === option.id ? "bg-sheet font-semibold text-ink shadow-[0_1px_2px_rgba(14,18,15,0.12)]" : "text-muted hover:text-ink"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// 48px top bar on the frame tint. `showLogo` is used where there is no sidebar.
export default function Header({ role = "teacher", showLogo = false, className = "" }) {
  return (
    <header className={`flex h-12 flex-none items-center justify-between gap-3 px-4 lg:px-5 ${className}`}>
      <div className="flex min-w-0 items-center gap-3">
        <Link to="/" className={showLogo ? "flex" : "flex lg:hidden"} aria-label="Formada — tanıtım səhifəsi">
          <Logo />
        </Link>
        {!showLogo && (
          <p className="hidden truncate text-[14px] text-muted lg:block">
            <span className="font-medium text-ink">{INSTRUCTOR.name}</span> · {INSTRUCTOR.title}
          </p>
        )}
      </div>
      <div className="flex flex-none items-center gap-2.5">
        <span className="hidden text-[13px] text-muted sm:inline">Demo rejimi</span>
        <RoleToggle role={role} />
      </div>
    </header>
  );
}
