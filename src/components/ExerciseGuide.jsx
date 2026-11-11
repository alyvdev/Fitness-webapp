import { AlertCircle, SlidersHorizontal } from "lucide-react";

export function MuscleChips({ muscles, className = "" }) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {muscles.primary.map((muscle) => (
        <span key={muscle} className="rounded-full bg-lime px-2.5 py-1 text-[13px] font-medium text-ink">
          {muscle}
        </span>
      ))}
      {muscles.secondary.map((muscle) => (
        <span key={muscle} className="rounded-full bg-well px-2.5 py-1 text-[13px] text-ink">
          {muscle}
        </span>
      ))}
    </div>
  );
}

// The how-to content of one machine. `compact` is the shortened version shown
// to the student on the phone.
export default function ExerciseGuide({ item, compact = false }) {
  const mistakes = compact ? item.mistakes.slice(0, 3) : item.mistakes;
  const heading = compact ? "text-[15px] font-semibold" : "text-[17px] font-semibold";

  return (
    <div className={compact ? "space-y-6" : "space-y-8"}>
      <section aria-labelledby={`${item.id}-steps`}>
        <h2 id={`${item.id}-steps`} className={heading}>
          Necə istifadə etməli
        </h2>
        <ol className="mt-3 space-y-2.5">
          {item.steps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="tnum flex h-7 w-7 flex-none items-center justify-center rounded-full bg-ink text-[13px] font-semibold text-white" aria-hidden="true">
                {index + 1}
              </span>
              <span className={`pt-0.5 leading-relaxed ${compact ? "text-[14px]" : "text-[15px]"}`}>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby={`${item.id}-mistakes`}>
        <h2 id={`${item.id}-mistakes`} className={heading}>
          Tez-tez edilən səhvlər
        </h2>
        <ul className="mt-3 space-y-2">
          {mistakes.map((mistake) => (
            <li key={mistake} className={`flex gap-2.5 rounded-xl bg-danger-soft px-3 py-2.5 text-danger ${compact ? "text-[14px]" : "text-[15px]"}`}>
              <AlertCircle size={17} className="mt-0.5 flex-none" aria-hidden="true" />
              <span className="text-ink">{mistake}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby={`${item.id}-adjust`}>
        <h2 id={`${item.id}-adjust`} className={heading}>
          Tənzimləmə
        </h2>
        <ul className="mt-3 space-y-2">
          {item.adjustments.map((tip) => (
            <li key={tip} className={`flex gap-2.5 rounded-xl bg-well px-3 py-2.5 ${compact ? "text-[14px]" : "text-[15px]"}`}>
              <SlidersHorizontal size={16} className="mt-0.5 flex-none text-muted" aria-hidden="true" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
