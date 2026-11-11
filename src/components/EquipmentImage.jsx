import { useEffect, useState } from "react";
import { Dumbbell } from "lucide-react";

// Equipment photo with lazy loading. If the file is missing from
// /public/equipment the neutral fallback (icon + machine name) stays visible.
export default function EquipmentImage({ item, index = 0, className = "", rounded = "rounded-xl", showName = true, eager = false, alt }) {
  const src = item.images?.[index];
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    setLoaded(false);
    setFailed(!src);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-well ${rounded} ${className}`}>
      {(!loaded || failed) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2 text-center text-faint">
          <Dumbbell aria-hidden="true" strokeWidth={1.5} className="h-[30%] max-h-9 min-h-4 w-auto" />
          {showName && failed && <span className="line-clamp-2 text-[13px] font-medium leading-tight text-muted">{item.short}</span>}
        </div>
      )}
      {!failed && (
        <img
          src={src}
          alt={alt ?? `${item.short} — aparatın şəkli`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
