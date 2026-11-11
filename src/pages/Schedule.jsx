import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CalendarClock, Clock, Plus, Repeat, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import Avatar from "../components/Avatar.jsx";
import Badge, { classTone } from "../components/Badge.jsx";
import Drawer from "../components/Drawer.jsx";
import Modal from "../components/Modal.jsx";
import { useDemo } from "../context/DemoContext.jsx";
import { useHeading } from "../context/PreviewContext.jsx";
import { CLASS_TYPES, DAY_NAMES, DAY_SHORT } from "../data/schedule.js";
import { firstName } from "../data/students.js";
import { addDays, classesOn, endTime, findConflicts, formatDate, formatDayMonth, sameDay, startOfWeek, toMinutes, today, weekdayIndex } from "../data/selectors.js";

const FIRST_HOUR = 7;
const LAST_HOUR = 21;
const HOUR_HEIGHT = 56;
const HOURS = Array.from({ length: LAST_HOUR - FIRST_HOUR }, (_, index) => FIRST_HOUR + index);
// 07:00 … 20:00 in half-hour steps; a select keeps the 24-hour format on every device.
const START_TIMES = HOURS.slice(0, -1).flatMap((hour) => [`${String(hour).padStart(2, "0")}:00`, `${String(hour).padStart(2, "0")}:30`]);

// Each class type has its own mark, repeated in the legend.
const BLOCK_STYLES = {
  Fərdi: "bg-lime-soft text-ink border-l-[3px] border-lime-deep",
  Qrup: "bg-ink text-white border-l-[3px] border-lime",
  Online: "bg-sky-soft text-ink border-l-[3px] border-sky",
};

// Overlapping classes share the column width side by side.
const layoutDay = (list) =>
  list.map((cls) => {
    const start = toMinutes(cls.start);
    const overlapping = list.filter((other) => {
      const otherStart = toMinutes(other.start);
      return start < otherStart + other.duration && otherStart < start + cls.duration;
    });
    return { cls, columns: overlapping.length, column: overlapping.indexOf(cls) };
  });

function ClassForm({ open, onClose, editing, defaultDay }) {
  const { students, classes, addClass, updateClass, toast } = useDemo();
  const [form, setForm] = useState(() =>
    editing
      ? { studentIds: editing.studentIds, type: editing.type, day: editing.day, start: editing.start, duration: editing.duration, note: editing.note, repeat: true }
      : { studentIds: [], type: "Fərdi", day: defaultDay, start: "17:00", duration: 60, note: "", repeat: true },
  );
  const set = (patch) => setForm((current) => ({ ...current, ...patch }));

  const candidate = { id: editing?.id ?? "new", ...form };
  const clash = findConflicts([...classes.filter((cls) => cls.id !== candidate.id), candidate]).has(candidate.id);
  const valid = form.studentIds.length > 0 && /^\d{2}:\d{2}$/.test(form.start);

  const toggleStudent = (id) => {
    if (form.type !== "Qrup") return set({ studentIds: form.studentIds.includes(id) ? [] : [id] });
    return set({ studentIds: form.studentIds.includes(id) ? form.studentIds.filter((item) => item !== id) : [...form.studentIds, id] });
  };

  const submit = (event) => {
    event.preventDefault();
    if (!valid) return;
    const names = students.filter((student) => form.studentIds.includes(student.id)).map(firstName);
    const title = form.type === "Qrup" ? `Qrup dərsi — ${names.length} nəfər` : `${names[0]} — ${form.type.toLocaleLowerCase("az")} dərs`;
    const { repeat, ...fields } = form;
    if (editing) {
      updateClass(editing.id, { ...fields, title: editing.title });
      toast(`Dərs köçürüldü: ${DAY_NAMES[form.day]}, ${form.start}`);
    } else {
      addClass({ ...fields, title });
      toast(`Dərs əlavə edildi: ${DAY_NAMES[form.day]}, ${form.start}${repeat ? " · hər həftə" : ""}`);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Dərsi köçür" : "Yeni dərs əlavə et"}
      description={editing ? editing.title : undefined}
      footer={
        <>
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Ləğv et
          </button>
          <button type="submit" form="class-form" disabled={!valid} className="btn btn-accent">
            {editing ? "Köçür" : "Əlavə et"}
          </button>
        </>
      }
    >
      <form id="class-form" onSubmit={submit} className="space-y-4">
        <div>
          <span className="label">Dərsin növü</span>
          <div className="flex gap-1.5" role="group" aria-label="Dərsin növü">
            {CLASS_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={form.type === type}
                onClick={() => set({ type, studentIds: type === "Qrup" ? form.studentIds : form.studentIds.slice(0, 1) })}
                className={`h-9 flex-1 rounded-full text-[14px] transition-colors ${form.type === type ? "bg-ink font-medium text-white" : "bg-well hover:bg-active"}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="label">{form.type === "Qrup" ? "Tələbələr" : "Tələbə"}</span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Tələbə seç">
            {students.map((student) => {
              const selected = form.studentIds.includes(student.id);
              return (
                <button
                  key={student.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleStudent(student.id)}
                  className={`flex h-9 items-center gap-1.5 rounded-full pl-1 pr-3 text-[14px] transition-colors ${selected ? "bg-lime font-medium" : "bg-well hover:bg-active"}`}
                >
                  <Avatar student={student} size={28} />
                  {firstName(student)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <label className="col-span-2 sm:col-span-1">
            <span className="label">Gün</span>
            <select value={form.day} onChange={(event) => set({ day: Number(event.target.value) })} className="field">
              {DAY_NAMES.map((name, index) => (
                <option key={name} value={index}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="label">Saat</span>
            <select value={form.start} onChange={(event) => set({ start: event.target.value })} className="field tnum">
              {START_TIMES.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="label">Müddət</span>
            <select value={form.duration} onChange={(event) => set({ duration: Number(event.target.value) })} className="field tnum">
              {[30, 45, 60, 90].map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} dəq
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          <span className="label">Qeyd</span>
          <input value={form.note} onChange={(event) => set({ note: event.target.value })} placeholder="Məsələn: bantları gətir" className="field" />
        </label>

        {!editing && (
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-well px-3.5 py-3">
            <span className="flex items-center gap-2 text-[14px] font-medium">
              <Repeat size={16} aria-hidden="true" /> Hər həftə təkrarla
            </span>
            <input type="checkbox" role="switch" checked={form.repeat} onChange={(event) => set({ repeat: event.target.checked })} className="peer sr-only" />
            <span className="relative h-6 w-11 flex-none rounded-full bg-[#cfd4c9] transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-ink peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2" aria-hidden="true" />
          </label>
        )}

        {clash && (
          <p className="flex gap-2.5 rounded-xl bg-danger-soft px-3.5 py-3 text-[14px]" role="alert">
            <AlertTriangle size={17} className="mt-0.5 flex-none text-danger" aria-hidden="true" />
            <span>Bu vaxt başqa dərslə üst-üstə düşür. Yenə də əlavə edə bilərsən, amma cədvəldə xəbərdarlıq görünəcək.</span>
          </p>
        )}
      </form>
    </Modal>
  );
}

export default function Schedule() {
  const { classes, students, removeClass, toast } = useDemo();
  const DayTitle = useHeading("h2");
  const now = today();
  const todayIndex = weekdayIndex(now);
  const monday = startOfWeek(now);
  const [selectedId, setSelectedId] = useState(null);
  const [formState, setFormState] = useState(null); // { editing } | null
  const [mobileDay, setMobileDay] = useState(todayIndex);

  const conflicts = useMemo(() => findConflicts(classes), [classes]);
  const selected = classes.find((cls) => cls.id === selectedId);
  const todayCount = classesOn(classes, todayIndex).length;
  const conflictList = classes.filter((cls) => conflicts.has(cls.id)).sort((a, b) => a.day - b.day || toMinutes(a.start) - toMinutes(b.start));
  const studentsOf = (cls) => students.filter((student) => cls.studentIds.includes(student.id));

  const cancel = (cls) => {
    removeClass(cls.id);
    setSelectedId(null);
    toast(`Dərs ləğv edildi: ${cls.title}`, { tone: "info" });
  };

  return (
    <>
      <PageHeader title="Cədvəl" subtitle={`Bu gün: ${todayCount} dərs · bu həftə cəmi ${classes.length} dərs · ${formatDayMonth(monday)}–${formatDate(addDays(monday, 6))}`}>
        <button type="button" onClick={() => setFormState({ editing: null })} className="btn btn-accent">
          <Plus size={17} strokeWidth={2.5} aria-hidden="true" /> Yeni dərs əlavə et
        </button>
      </PageHeader>

      {conflictList.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[14px] bg-danger-soft px-4 py-3 text-[14px]" role="alert">
          <AlertTriangle size={17} className="flex-none text-danger" aria-hidden="true" />
          <p className="min-w-0 flex-1">
            <span className="font-semibold">Vaxt toqquşması:</span> {DAY_NAMES[conflictList[0].day]},{" "}
            {conflictList.map((cls) => `${cls.start}–${endTime(cls)}`).join(" və ")} dərsləri üst-üstə düşür.
          </p>
          <button type="button" onClick={() => setSelectedId(conflictList[conflictList.length - 1].id)} className="btn btn-ghost btn-sm">
            Dərsə bax
          </button>
        </div>
      )}

      <ul className="mb-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-muted" aria-label="Dərs növləri">
        {CLASS_TYPES.map((type) => (
          <li key={type} className="flex items-center gap-1.5">
            <span className={`h-3.5 w-5 rounded ${BLOCK_STYLES[type]}`} aria-hidden="true" /> {type}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span className="h-3.5 w-5 rounded ring-2 ring-inset ring-danger" aria-hidden="true" /> Toqquşma
        </li>
      </ul>

      {/* Tablet and desktop: week grid */}
      <div className="hidden overflow-hidden rounded-[14px] border border-line md:block">
        <div className="grid grid-cols-[52px_repeat(7,minmax(0,1fr))] border-b border-line">
          <span />
          {DAY_NAMES.map((name, index) => {
            const date = addDays(monday, index);
            const isToday = sameDay(date, now);
            return (
              <div key={name} className={`border-l border-line px-2 py-2.5 text-center ${index >= 5 ? "bg-well" : ""}`}>
                <p className={`text-[13px] ${isToday ? "font-semibold text-ink" : "text-muted"}`}>
                  <span className="xl:hidden">{DAY_SHORT[index]}</span>
                  <span className="hidden xl:inline">{name}</span>
                </p>
                <p className={`tnum mx-auto mt-0.5 w-fit rounded-full px-2 text-[14px] leading-6 ${isToday ? "bg-lime font-semibold" : ""}`}>{formatDayMonth(date)}</p>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-[52px_repeat(7,minmax(0,1fr))]" style={{ height: HOURS.length * HOUR_HEIGHT }}>
          <div className="relative">
            {HOURS.map((hour, index) => (
              <span key={hour} className="tnum absolute right-2 text-[12px] text-muted" style={{ top: index * HOUR_HEIGHT + 4 }}>
                {String(hour).padStart(2, "0")}:00
              </span>
            ))}
          </div>
          {DAY_NAMES.map((name, dayIndex) => (
            <div
              key={name}
              className={`relative border-l border-line ${dayIndex >= 5 ? "bg-well" : ""} ${dayIndex === todayIndex ? "bg-lime-soft/40" : ""}`}
              style={{ backgroundImage: "linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)", backgroundSize: `100% ${HOUR_HEIGHT}px` }}
              aria-label={name}
            >
              {layoutDay(classesOn(classes, dayIndex)).map(({ cls, columns, column }) => {
                const top = ((toMinutes(cls.start) - FIRST_HOUR * 60) / 60) * HOUR_HEIGHT;
                const height = (cls.duration / 60) * HOUR_HEIGHT - 3;
                const clash = conflicts.has(cls.id);
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => setSelectedId(cls.id)}
                    className={`absolute overflow-hidden rounded-md px-1.5 py-1 text-left transition-transform hover:z-10 hover:scale-[1.02] active:scale-[0.98] ${BLOCK_STYLES[cls.type]} ${clash ? "ring-2 ring-inset ring-danger" : ""}`}
                    style={{ top: top + 1, height, left: `calc(${(column / columns) * 100}% + 2px)`, width: `calc(${100 / columns}% - 4px)` }}
                    aria-label={`${cls.title}, ${cls.start}–${endTime(cls)}, ${cls.type}${clash ? ", vaxt toqquşması" : ""}`}
                  >
                    <span className="tnum flex items-center gap-1 text-[12px] font-semibold leading-tight">
                      {clash && <AlertTriangle size={11} className="flex-none text-danger" aria-hidden="true" />}
                      {cls.start}
                    </span>
                    <span className="line-clamp-2 text-[12px] leading-tight">{cls.title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Phone: one day at a time */}
      <div className="md:hidden">
        <div className="scroll-x -mx-4 flex gap-1.5 px-4" role="tablist" aria-label="Həftənin günləri">
          {DAY_SHORT.map((short, index) => {
            const date = addDays(monday, index);
            const active = index === mobileDay;
            const count = classesOn(classes, index).length;
            return (
              <button
                key={short}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`${DAY_NAMES[index]}, ${count} dərs`}
                onClick={() => setMobileDay(index)}
                className={`flex h-[62px] min-w-[46px] flex-1 flex-col items-center justify-center rounded-xl text-[13px] transition-colors ${
                  active ? "bg-ink text-white" : index === todayIndex ? "bg-lime text-ink" : "bg-well text-ink"
                }`}
              >
                <span className={active ? "text-white/70" : "text-muted"}>{short}</span>
                <span className="tnum text-[16px] font-semibold leading-tight">{date.getDate()}</span>
                <span className={`mt-0.5 h-1 w-1 rounded-full ${count ? (active ? "bg-lime" : "bg-ink") : "bg-transparent"}`} aria-hidden="true" />
              </button>
            );
          })}
        </div>
        <DayTitle className="mb-2 mt-4 text-[15px] font-semibold">
          {DAY_NAMES[mobileDay]}
          {mobileDay === todayIndex && <span className="font-normal text-muted"> · bu gün</span>}
        </DayTitle>
        {classesOn(classes, mobileDay).length === 0 ? (
          <p className="rounded-[14px] bg-well px-4 py-8 text-center text-[14px] text-muted">Bu gün üçün dərs yoxdur.</p>
        ) : (
          <ul className="space-y-2">
            {classesOn(classes, mobileDay).map((cls) => {
              const clash = conflicts.has(cls.id);
              return (
                <li key={cls.id}>
                  <button type="button" onClick={() => setSelectedId(cls.id)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left ${BLOCK_STYLES[cls.type]} ${clash ? "ring-2 ring-inset ring-danger" : ""}`}>
                    <span className="tnum w-[52px] flex-none text-[15px] font-semibold leading-tight">
                      {cls.start}
                      <span className="block text-[13px] font-normal opacity-70">{endTime(cls)}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium">{cls.title}</span>
                      <span className="flex items-center gap-1 text-[13px] opacity-75">
                        {clash && <AlertTriangle size={13} className="text-danger" aria-hidden="true" />}
                        {clash ? "Vaxt toqquşması · " : ""}
                        {cls.type}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected?.title ?? ""}
        footer={
          selected && (
            <>
              <button type="button" onClick={() => setFormState({ editing: selected })} className="btn btn-dark flex-1">
                <CalendarClock size={16} aria-hidden="true" /> Köçür
              </button>
              <button type="button" onClick={() => cancel(selected)} className="btn btn-danger flex-1">
                <Trash2 size={15} aria-hidden="true" /> Ləğv et
              </button>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={classTone(selected.type)}>{selected.type}</Badge>
              <span className="tnum flex items-center gap-1.5 text-[14px]">
                <Clock size={15} className="text-muted" aria-hidden="true" />
                {DAY_NAMES[selected.day]}, {selected.start}–{endTime(selected)} · {selected.duration} dəq
              </span>
            </div>

            {conflicts.has(selected.id) && (
              <p className="flex gap-2.5 rounded-xl bg-danger-soft px-3.5 py-3 text-[14px]" role="alert">
                <AlertTriangle size={17} className="mt-0.5 flex-none text-danger" aria-hidden="true" />
                <span>Bu dərs eyni gündə başqa dərslə üst-üstə düşür. Birini başqa vaxta köçür.</span>
              </p>
            )}

            <section aria-labelledby="class-students">
              <h3 id="class-students" className="text-[13px] text-muted">
                Tələbələr ({selected.studentIds.length})
              </h3>
              <ul className="mt-1.5 divide-y divide-line">
                {studentsOf(selected).map((student) => (
                  <li key={student.id}>
                    <Link to={`/students/${student.id}`} className="flex items-center gap-3 py-2.5">
                      <Avatar student={student} size={36} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-medium">{student.name}</span>
                        <span className="block truncate text-[13px] text-muted">{student.goal}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="class-note">
              <h3 id="class-note" className="text-[13px] text-muted">
                Qeyd
              </h3>
              <p className="mt-1.5 rounded-xl bg-well px-3.5 py-3 text-[14px] leading-relaxed">{selected.note || "Bu dərs üçün qeyd yoxdur."}</p>
            </section>
          </div>
        )}
      </Drawer>

      {formState && (
        <ClassForm
          key={formState.editing?.id ?? "new"}
          open
          editing={formState.editing}
          defaultDay={todayIndex}
          onClose={() => {
            setFormState(null);
          }}
        />
      )}
    </>
  );
}
