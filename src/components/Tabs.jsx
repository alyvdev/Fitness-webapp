// Underline tabs on a full-width rule. `tabs` is [{ id, label, count? }].
export default function Tabs({ tabs, value, onChange, label, className = "" }) {
  return (
    <div role="tablist" aria-label={label} className={`scroll-x flex gap-6 border-b border-line ${className}`}>
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`relative -mb-px flex h-11 flex-none items-center gap-1.5 border-b-2 text-[14px] transition-colors ${
              active ? "border-ink font-semibold text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {tab.label}
            {tab.count != null && <span className="tnum text-[13px] font-normal text-faint">{tab.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

// Row of pill buttons for filters. `options` is strings or { id, label }.
export function Segmented({ options, value, onChange, label, className = "" }) {
  return (
    <div role="group" aria-label={label} className={`scroll-x flex gap-1.5 ${className}`}>
      {options.map((option) => {
        const id = typeof option === "string" ? option : option.id;
        const text = typeof option === "string" ? option : option.label;
        const active = id === value;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(id)}
            className={`h-9 flex-none rounded-full px-3.5 text-[14px] transition-colors ${
              active ? "bg-ink font-medium text-white" : "bg-well text-ink hover:bg-active"
            }`}
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}
