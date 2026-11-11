import { Suspense, useEffect, useRef, useState } from "react";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import { PreviewContext } from "../context/PreviewContext.jsx";

// Design width follows the viewport bucket so the page inside renders the same
// responsive variant its Tailwind breakpoints are already choosing.
const designWidth = () => {
  const w = window.innerWidth;
  if (w >= 1280) return 1280;
  if (w >= 1024) return 1080;
  if (w >= 768) return 800;
  return 390;
};

// A live, non-interactive copy of an app screen, scaled to fit its tile.
// Used on the landing page in place of screenshots, so it never goes stale.
// `fill` lets the parent set the height (the tile crops the screen from the top).
export default function ScreenPreview({ children, activePath, ratio = 0.62, className = "", label, fill = false }) {
  const wrapper = useRef(null);
  const [width, setWidth] = useState(designWidth);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const node = wrapper.current;
    const measure = () => {
      const next = designWidth();
      setWidth(next);
      setScale(node.clientWidth / next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const withSidebar = width >= 1024;
  const height = Math.round(width * (withSidebar ? ratio : 1.5));

  return (
    <div ref={wrapper} role="img" aria-label={label} className={`relative overflow-hidden bg-frame ${className}`} style={{ aspectRatio: fill ? undefined : `${width} / ${height}` }}>
      <div
        data-ui
        inert
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 flex origin-top-left select-none bg-frame text-ink"
        style={{ width, height, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
      >
        {withSidebar && <Sidebar activePath={activePath} className="h-full" />}
        <div className="flex min-w-0 flex-1 flex-col">
          <Header role="teacher" />
          <div className={`min-h-0 flex-1 overflow-hidden border-line bg-sheet ${withSidebar ? "mb-2 mr-2 rounded-[16px] border" : "border-t"}`}>
            <div className="px-4 py-5 sm:px-6 sm:py-6">
              <PreviewContext.Provider value>
                <Suspense fallback={null}>{children}</Suspense>
              </PreviewContext.Provider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
