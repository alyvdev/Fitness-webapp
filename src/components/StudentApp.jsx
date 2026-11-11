import { useState } from "react";
import { CalendarDays, Check, ChevronRight, ClipboardList, Dumbbell, Flame, TrendingUp, X } from "lucide-react";
import EquipmentImage from "./EquipmentImage.jsx";
import ExerciseGuide, { MuscleChips } from "./ExerciseGuide.jsx";
import Badge, { classTone } from "./Badge.jsx";
import WeightChart from "./charts/WeightChart.jsx";
import { useDemo } from "../context/DemoContext.jsx";
import { getEquipment } from "../data/equipment.js";
import { firstName } from "../data/students.js";
import { attendanceSummary, endTime, formatDate, formatKg, formatRest, formatSigned, nextClass, today, weekdayIndex } from "../data/selectors.js";
import { DAY_NAMES } from "../data/schedule.js";

const TABS = [
  { id: "today", label: "Bu gün", icon: Dumbbell },
  { id: "program", label: "Proqramım", icon: ClipboardList },
  { id: "progress", label: "İrəliləyiş", icon: TrendingUp },
];

function ExerciseRow({ exercise, done, onToggle, onOpen }) {
  const item = getEquipment(exercise.equipmentId);
  if (!item) return null;
  return (
    <li className={`flex items-center gap-3 rounded-2xl p-2 transition-colors ${done ? "bg-lime-soft" : "bg-well"}`}>
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left" aria-label={`${item.short} — izahı aç`}>
        <EquipmentImage item={item} showName={false} className="h-14 w-14 flex-none" rounded="rounded-xl" />
        <span className="min-w-0">
          <span className={`block truncate text-[15px] font-semibold ${done ? "line-through decoration-ink/40" : ""}`}>{item.short}</span>
          <span className="tnum block text-[13px] text-muted">
            {exercise.sets} × {exercise.reps} · {formatRest(exercise.rest)}
          </span>
          {exercise.note && <span className="block truncate text-[13px] text-muted">{exercise.note}</span>}
        </span>
      </button>
      {onToggle && (
        <button
          type="button"
          role="checkbox"
          aria-checked={done}
          aria-label={`${item.short} — tamamlandı`}
          onClick={onToggle}
          className={`flex h-11 w-11 flex-none items-center justify-center rounded-full border-2 transition-all active:scale-90 ${
            done ? "border-ink bg-ink text-lime" : "border-[#cfd4c9] bg-sheet text-transparent"
          }`}
        >
          <Check size={20} strokeWidth={3} aria-hidden="true" />
        </button>
      )}
      {!onToggle && <ChevronRight size={18} className="mr-1 flex-none text-faint" aria-hidden="true" />}
    </li>
  );
}

// The student's phone app. Rendered inside <PhoneFrame>; also reused as the
// preview after the instructor sends a program.
export default function StudentApp({ studentId, program, initialTab = "today" }) {
  const { students, weights, classes, doneExercises, toggleExerciseDone, addWeight, toast } = useDemo();
  const [tab, setTab] = useState(initialTab);
  const [guideId, setGuideId] = useState(null);
  const [weightInput, setWeightInput] = useState("");

  const student = students.find((s) => s.id === studentId);
  const series = weights[studentId];
  const current = series[series.length - 1];
  const change = current - series[0];
  const attendance = attendanceSummary(studentId);
  const upcoming = nextClass(studentId, classes);
  const now = today();

  const dayIndex = program ? weekdayIndex(now) % program.days.length : 0;
  const todayPlan = program?.days[dayIndex];
  const doneKey = (index) => `${studentId}:${program?.id}:${dayIndex}:${index}`;
  const doneCount = todayPlan ? todayPlan.exercises.filter((_, index) => doneExercises[doneKey(index)]).length : 0;
  const guideItem = guideId ? getEquipment(guideId) : null;

  const submitWeight = (event) => {
    event.preventDefault();
    const kg = Number(weightInput.replace(",", "."));
    if (!kg || kg < 30 || kg > 250) {
      toast("Çəkini kq ilə yaz, məsələn 68,4", { tone: "warn" });
      return;
    }
    addWeight(studentId, Math.round(kg * 10) / 10);
    setWeightInput("");
    toast("Çəkin yeniləndi və müəlliminə göndərildi");
  };

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-10 sm:pt-12">
        <header className="mb-4">
          <p className="text-[13px] text-muted">
            {DAY_NAMES[weekdayIndex(now)]}, {formatDate(now)}
          </p>
          <p className="font-display text-[24px] leading-tight">Salam, {firstName(student)}</p>
        </header>

        {tab === "today" && (
          <div className="space-y-4">
            <section className="on-dark rounded-2xl bg-ink p-4 text-white" aria-label="Növbəti dərs">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-[13px] text-white/70">
                  <CalendarDays size={14} aria-hidden="true" /> Növbəti dərs
                </p>
                {upcoming && <Badge tone={upcoming.cls.type === "Qrup" ? "accent" : classTone(upcoming.cls.type)}>{upcoming.cls.type}</Badge>}
              </div>
              {upcoming ? (
                <>
                  <p className="tnum mt-2 text-[22px] font-semibold leading-tight">{upcoming.label}</p>
                  <p className="tnum mt-0.5 text-[14px] text-white/70">
                    {formatDate(upcoming.date)} · {upcoming.cls.start}–{endTime(upcoming.cls)} · Fuad müəllim
                  </p>
                </>
              ) : (
                <p className="mt-2 text-[15px] text-white/80">Bu həftə planlaşdırılmış dərs yoxdur.</p>
              )}
            </section>

            {todayPlan ? (
              <section aria-labelledby="today-title">
                <div className="mb-2 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h2 id="today-title" className="text-[17px] font-semibold">
                      Bugünkü məşq
                    </h2>
                    <p className="truncate text-[13px] text-muted">
                      {todayPlan.name} · {program.name}
                    </p>
                  </div>
                  <p className="tnum flex-none text-[13px] font-medium">
                    {doneCount}/{todayPlan.exercises.length} tamamlandı
                  </p>
                </div>
                <div className="mb-3 h-2 overflow-hidden rounded-full bg-well" role="progressbar" aria-valuemin={0} aria-valuemax={todayPlan.exercises.length} aria-valuenow={doneCount} aria-label="Bugünkü məşqin gedişi">
                  <div className="h-full origin-left rounded-full bg-lime-deep transition-transform duration-300" style={{ transform: `scaleX(${todayPlan.exercises.length ? doneCount / todayPlan.exercises.length : 0})` }} />
                </div>
                <ul className="space-y-2">
                  {todayPlan.exercises.map((exercise, index) => (
                    <ExerciseRow
                      key={`${exercise.equipmentId}-${index}`}
                      exercise={exercise}
                      done={Boolean(doneExercises[doneKey(index)])}
                      onToggle={() => toggleExerciseDone(doneKey(index))}
                      onOpen={() => setGuideId(exercise.equipmentId)}
                    />
                  ))}
                </ul>
                {doneCount === todayPlan.exercises.length && todayPlan.exercises.length > 0 && (
                  <p className="mt-3 rounded-2xl bg-lime px-4 py-3 text-[15px] font-semibold">Əla! Bugünkü məşq tamamlandı.</p>
                )}
              </section>
            ) : (
              <p className="rounded-2xl bg-well p-4 text-[15px]">Müəllimin hələ proqram göndərməyib. Göndərən kimi burada görünəcək.</p>
            )}
          </div>
        )}

        {tab === "program" && (
          <div className="space-y-5">
            {program ? (
              <>
                <div>
                  <h2 className="text-[17px] font-semibold">{program.name}</h2>
                  <p className="mt-1 text-[14px] leading-relaxed text-muted">{program.description}</p>
                </div>
                {program.days.map((day, index) => (
                  <section key={day.name + index} aria-label={day.name}>
                    <h3 className="mb-2 flex items-center gap-2 text-[15px] font-semibold">
                      {day.name}
                      {index === dayIndex && <Badge tone="accent">Bu gün</Badge>}
                      <span className="tnum ml-auto text-[13px] font-normal text-muted">{day.exercises.length} hərəkət</span>
                    </h3>
                    <ul className="space-y-2">
                      {day.exercises.map((exercise, i) => (
                        <ExerciseRow key={`${exercise.equipmentId}-${i}`} exercise={exercise} done={false} onOpen={() => setGuideId(exercise.equipmentId)} />
                      ))}
                    </ul>
                  </section>
                ))}
              </>
            ) : (
              <p className="rounded-2xl bg-well p-4 text-[15px]">Hələ proqram təyin edilməyib.</p>
            )}
          </div>
        )}

        {tab === "progress" && (
          <div className="space-y-4">
            <section className="rounded-2xl bg-well p-4" aria-labelledby="weight-title">
              <h2 id="weight-title" className="text-[13px] text-muted">
                Hazırkı çəki
              </h2>
              <p className="tnum mt-0.5 text-[30px] font-semibold leading-tight">
                {formatKg(current)} <span className="text-[16px] font-normal text-muted">kq</span>
              </p>
              <p className="tnum text-[13px] text-muted">
                {series.length} ölçmədə {formatSigned(change)} kq
              </p>
              <div className="-mx-1 mt-3">
                <WeightChart weights={series} height={170} compact />
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3">
              <section className="rounded-2xl bg-lime p-4" aria-label="Davamiyyət seriyası">
                <Flame size={18} aria-hidden="true" />
                <p className="tnum mt-2 text-[26px] font-semibold leading-none">{attendance.streak}</p>
                <p className="mt-1 text-[13px]">ardıcıl dərs</p>
              </section>
              <section className="rounded-2xl bg-well p-4" aria-label="Son 30 gündə davamiyyət">
                <CalendarDays size={18} aria-hidden="true" />
                <p className="tnum mt-2 text-[26px] font-semibold leading-none">{attendance.rate}%</p>
                <p className="tnum mt-1 text-[13px] text-muted">
                  30 gündə {attendance.attended}/{attendance.total} dərs
                </p>
              </section>
            </div>

            <form onSubmit={submitWeight} className="rounded-2xl bg-well p-4">
              <label htmlFor={`weight-${studentId}`} className="text-[15px] font-semibold">
                Çəkimi yenilə
              </label>
              <p className="mt-0.5 text-[13px] text-muted">Səhər, ac qarına çəkil.</p>
              <div className="mt-3 flex gap-2">
                <div className="relative flex-1">
                  <input
                    id={`weight-${studentId}`}
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder={formatKg(current)}
                    value={weightInput}
                    onChange={(event) => setWeightInput(event.target.value)}
                    className="field tnum pr-10"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-muted">kq</span>
                </div>
                <button type="submit" className="btn btn-dark">
                  Yadda saxla
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <nav aria-label="Tələbə menyusu" className="grid flex-none grid-cols-3 border-t border-line bg-sheet pb-[env(safe-area-inset-bottom)]">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-current={tab === id ? "page" : undefined}
            onClick={() => setTab(id)}
            className={`flex h-[60px] flex-col items-center justify-center gap-1 text-[12px] transition-colors ${tab === id ? "font-semibold text-ink" : "text-muted"}`}
          >
            <span className={`flex h-7 w-14 items-center justify-center rounded-full transition-colors ${tab === id ? "bg-lime" : ""}`}>
              <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
            </span>
            {label}
          </button>
        ))}
      </nav>

      {guideItem && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label={guideItem.name}>
          <div className="overlay-in absolute inset-0 bg-ink/50" onClick={() => setGuideId(null)} aria-hidden="true" />
          <div className="sheet-up relative flex max-h-[90%] flex-col rounded-t-[24px] bg-sheet">
            <div className="relative flex-none p-3 pb-0">
              <EquipmentImage item={guideItem} className="aspect-[16/10] w-full" rounded="rounded-2xl" />
              <button type="button" onClick={() => setGuideId(null)} className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-sheet text-ink shadow-[0_2px_8px_rgba(14,18,15,0.2)]" aria-label="Bağla">
                <X size={17} aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-4">
              <h2 className="text-[19px] font-semibold leading-tight">{guideItem.name}</h2>
              <p className="tnum mt-1 text-[14px] text-muted">{guideItem.suggested}</p>
              <MuscleChips muscles={guideItem.muscles} className="mb-5 mt-3" />
              <ExerciseGuide item={guideItem} compact />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
