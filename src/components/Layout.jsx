import { Suspense } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar, { NAV_ITEMS } from "./Sidebar.jsx";

// App shell: a tinted frame (sidebar + 48px top bar, no rule between them)
// around a white sheet inset 8px from the right and bottom edges.
// On a phone the frame disappears and the navigation moves to a bottom bar.
export default function Layout({ variant = "teacher" }) {
  const { pathname } = useLocation();

  if (variant === "student") {
    return (
      <div className="flex min-h-dvh flex-col bg-frame">
        <Header role="student" showLogo className="sticky top-0 z-30 bg-frame" />
        <main className="flex flex-1 flex-col">
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-frame lg:pl-[232px]">
      <Sidebar className="fixed inset-y-0 left-0 hidden lg:flex" />
      <Header role="teacher" className="sticky top-0 z-30 bg-frame" />
      <main className="min-h-[calc(100dvh-48px)] border-line bg-sheet pb-24 max-lg:border-t lg:mb-2 lg:mr-2 lg:min-h-[calc(100dvh-56px)] lg:rounded-[16px] lg:border lg:pb-0">
        <div key={pathname} className="page-in mx-auto max-w-[1240px] px-4 py-5 sm:px-6 sm:py-6">
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      <nav
        aria-label="Müəllim paneli"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-sheet pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {NAV_ITEMS.map(({ to, short, icon: Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className={`flex h-[58px] flex-col items-center justify-center gap-1 text-[11px] transition-colors ${active ? "font-semibold text-ink" : "text-muted"}`}
            >
              <span className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${active ? "bg-lime" : ""}`}>
                <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
              </span>
              {short}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
