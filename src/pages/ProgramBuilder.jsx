import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUp, Check, Plus, Search, Send, Trash2, X } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import EquipmentImage from "../components/EquipmentImage.jsx";
import Avatar from "../components/Avatar.jsx";
import Modal from "../components/Modal.jsx";
import PhoneFrame from "../components/PhoneFrame.jsx";
import StudentApp from "../components/StudentApp.jsx";
import { draftExerciseCount, useDemo } from "../context/DemoContext.jsx";
import { equipment, getEquipment } from "../data/equipment.js";
import { firstName } from "../data/students.js";

const REST_OPTIONS = [0, 30, 45, 60, 75, 90, 120, 180];

function ExerciseEditor({ exercise, index, total, onChange, onMove, onRemove }) {
  const item = getEquipment(exercise.equipmentId);
  return (
    <li className="rounded-[14px] border border-line p-3">
      <div className="flex items-center gap-3">
        <EquipmentImage item={item} showName={false} className="h-12 w-12 flex-none" rounded="rounded-lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold">{item.short}</p>
          <p className="truncate text-[13px] text-muted">{item.muscles.primary.join(", ")}</p>
        </div>
        <div className="flex flex-none gap-1">
          <button type="button" onClick={() => onMove(-1)} disabled={index === 0} className="btn btn-ghost btn-sm btn-icon" aria-label={`${item.short} — yuxarı daşı`}>
            <ArrowUp size={15} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} className="btn btn-ghost btn-sm btn-icon" aria-label={`${item.short} — aşağı daşı`}>
            <ArrowDown size={15} aria-hidden="true" />
          </button>
          <button type="button" onClick={onRemove} className="btn btn-danger btn-sm btn-icon" aria-label={`${item.short} — sil`}>
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-[84px_110px_120px_minmax(0,1fr)]">
        <label>
          <span className="label">Set</span>
          <input type="number" min={1} max={12} inputMode="numeric" value={exercise.sets} onChange={(event) => onChange({ sets: Math.max(1, Number(event.target.value) || 1) })} className="field tnum" />
        </label>
        <label>
          <span className="label">Təkrar</span>
          <input value={exercise.reps} onChange={(event) => onChange({ reps: event.target.value })} className="field tnum" />
        </label>
        <label>
          <span className="label">Fasilə</span>
          <select value={exercise.rest} onChange={(event) => onChange({ rest: Number(event.target.value) })} className="field tnum">
            {REST_OPTIONS.map((seconds) => (
              <option key={seconds} value={seconds}>
                {seconds ? `${seconds} san` : "Yoxdur"}
              </option>
            ))}
          </select>
        </label>
        <label className="col-span-3 sm:col-span-1">
          <span className="label">Qeyd</span>
          <input value={exercise.note} onChange={(event) => onChange({ note: event.target.value })} placeholder="Məsələn: yüngül çəki ilə" className="field" />
        </label>
      </div>
    </li>
  );
}

function ExercisePicker({ open, onClose, dayName, addedIds, onPick }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("az");
    if (!q) return equipment;
    return equipment.filter((item) => [item.name, ...item.groups, ...item.muscles.primary].join(" ").toLocaleLowerCase("az").includes(q));
  }, [query]);

  return (
    <Modal open={open} onClose={onClose} title="Hərəkət əlavə et" description={`${dayName} üçün kitabxanadan seç.`} size="md">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Aparat və ya əzələ axtar" aria-label="Aparat və ya əzələ axtar" className="field pl-9" />
      </div>
      <ul className="mt-3 space-y-1.5">
        {results.map((item) => {
          const added = addedIds.includes(item.id);
          return (
            <li key={item.id}>
              <button type="button" onClick={() => onPick(item)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-well">
                <EquipmentImage item={item} showName={false} className="h-12 w-12 flex-none" rounded="rounded-lg" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium">{item.name}</span>
                  <span className="block truncate text-[13px] text-muted">
                    {item.groups.join(", ")} · {item.suggested}
                  </span>
                </span>
                <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${added ? "bg-ink text-lime" : "bg-lime text-ink"}`}>
                  {added ? <Check size={16} strokeWidth={2.5} aria-hidden="true" /> : <Plus size={16} strokeWidth={2.5} aria-hidden="true" />}
                </span>
              </button>
            </li>
          );
        })}
        {results.length === 0 && <li className="rounded-xl bg-well px-4 py-8 text-center text-[14px] text-muted">Bu axtarışa uyğun aparat yoxdur.</li>}
      </ul>
    </Modal>
  );
}

export default function ProgramBuilder() {
  const navigate = useNavigate();
  const { draft, students, updateDraft, updateDraftDay, addToDraft, resetDraft, sendDraft, setDemoStudentId, setRole, toast } = useDemo();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sent, setSent] = useState(null);
  const [previewStudent, setPreviewStudent] = useState(null);

  const activeDay = Math.min(draft.activeDay, draft.days.length - 1);
  const day = draft.days[activeDay];
  const total = draftExerciseCount(draft);
  const canSend = total > 0 && draft.studentIds.length > 0;

  const changeExercise = (uid, patch) => updateDraftDay(activeDay, (list) => list.map((exercise) => (exercise.uid === uid ? { ...exercise, ...patch } : exercise)));
  const removeExercise = (uid) => updateDraftDay(activeDay, (list) => list.filter((exercise) => exercise.uid !== uid));
  const moveExercise = (index, direction) =>
    updateDraftDay(activeDay, (list) => {
      const next = [...list];
      const target = index + direction;
      if (target < 0 || target >= next.length) return list;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const addDay = () => updateDraft((current) => ({ days: [...current.days, { name: `Gün ${current.days.length + 1}`, exercises: [] }], activeDay: current.days.length }));
  const removeDay = () =>
    updateDraft((current) => ({
      days: current.days.filter((_, index) => index !== activeDay).map((item, index) => ({ ...item, name: `Gün ${index + 1}` })),
      activeDay: Math.max(0, activeDay - 1),
    }));

  const toggleStudent = (id) =>
    updateDraft((current) => ({ studentIds: current.studentIds.includes(id) ? current.studentIds.filter((item) => item !== id) : [...current.studentIds, id] }));

  const send = () => {
    const program = sendDraft();
    const names = students.filter((student) => program.studentIds.includes(student.id)).map(firstName);
    toast(`Proqram göndərildi: ${names.join(", ")}`);
    setSent(program);
    setPreviewStudent(program.studentIds[0]);
    resetDraft();
  };

  const closePreview = () => {
    setSent(null);
    navigate("/programs");
  };

  return (
    <>
      <PageHeader title="Proqram qurucusu" subtitle="Kitabxanadan hərəkət seç, set və təkrarı yaz, tələbəyə göndər." back={{ to: "/programs", label: "Proqramlar" }} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="label">Proqramın adı</span>
              <input value={draft.name} onChange={(event) => updateDraft({ name: event.target.value })} placeholder="Məsələn: Aysel — 3 günlük" className="field" />
            </label>
            <label>
              <span className="label">Qısa izah</span>
              <input value={draft.description} onChange={(event) => updateDraft({ description: event.target.value })} placeholder="Tələbə bunu proqramın başında görəcək" className="field" />
            </label>
          </div>

          <div className="mt-5 flex items-center gap-2 border-b border-line">
            <div role="tablist" aria-label="Məşq günləri" className="scroll-x flex min-w-0 flex-1 gap-5">
              {draft.days.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  aria-selected={index === activeDay}
                  onClick={() => updateDraft({ activeDay: index })}
                  className={`-mb-px flex h-11 flex-none items-center gap-1.5 border-b-2 text-[14px] transition-colors ${
                    index === activeDay ? "border-ink font-semibold" : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {item.name}
                  <span className="tnum text-[13px] font-normal text-faint">{item.exercises.length}</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={addDay} disabled={draft.days.length >= 7} className="btn btn-ghost btn-sm mb-1.5 flex-none">
              <Plus size={14} aria-hidden="true" /> Gün
            </button>
          </div>

          <div className="mt-4" role="tabpanel" aria-label={day.name}>
            {day.exercises.length === 0 ? (
              <div className="rounded-[14px] bg-well px-5 py-10 text-center">
                <p className="text-[16px] font-semibold">{day.name} hələ boşdur</p>
                <p className="mt-1 text-[14px] text-muted">Kitabxanadan ilk hərəkəti əlavə et.</p>
                <button type="button" onClick={() => setPickerOpen(true)} className="btn btn-accent mt-4">
                  <Plus size={17} strokeWidth={2.5} aria-hidden="true" /> Hərəkət əlavə et
                </button>
              </div>
            ) : (
              <>
                <ul className="space-y-2.5">
                  {day.exercises.map((exercise, index) => (
                    <ExerciseEditor
                      key={exercise.uid}
                      exercise={exercise}
                      index={index}
                      total={day.exercises.length}
                      onChange={(patch) => changeExercise(exercise.uid, patch)}
                      onMove={(direction) => moveExercise(index, direction)}
                      onRemove={() => removeExercise(exercise.uid)}
                    />
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap justify-between gap-2">
                  <button type="button" onClick={() => setPickerOpen(true)} className="btn btn-dark">
                    <Plus size={17} strokeWidth={2.5} aria-hidden="true" /> Hərəkət əlavə et
                  </button>
                  {draft.days.length > 1 && (
                    <button type="button" onClick={removeDay} className="btn btn-danger">
                      <X size={15} aria-hidden="true" /> Bu günü sil
                    </button>
                  )}
                </div>
              </>
            )}
            {day.exercises.length === 0 && draft.days.length > 1 && (
              <button type="button" onClick={removeDay} className="btn btn-danger mt-3">
                <X size={15} aria-hidden="true" /> Bu günü sil
              </button>
            )}
          </div>
        </div>

        <aside className="card p-4 lg:sticky lg:top-[68px]">
          <h2 className="text-[15px] font-semibold">Kimə göndərilsin?</h2>
          <ul className="mt-3 space-y-1">
            {students.map((student) => {
              const checked = draft.studentIds.includes(student.id);
              return (
                <li key={student.id}>
                  <label className={`flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors ${checked ? "bg-lime-soft" : "hover:bg-well"}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleStudent(student.id)} className="peer sr-only" />
                    <Avatar student={student} size={32} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium">{student.name}</span>
                      <span className="block truncate text-[13px] text-muted">{student.goal}</span>
                    </span>
                    <span className={`flex h-5 w-5 flex-none items-center justify-center rounded-md border-2 peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 ${checked ? "border-ink bg-ink text-lime" : "border-[#cfd4c9] text-transparent"}`}>
                      <Check size={13} strokeWidth={3.5} aria-hidden="true" />
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <p className="tnum mt-4 border-t border-line pt-4 text-[13px] text-muted">
            {draft.days.length} gün · {total} hərəkət · {draft.studentIds.length} tələbə
          </p>
          <button type="button" onClick={send} disabled={!canSend} className="btn btn-accent mt-3 h-11 w-full">
            <Send size={16} aria-hidden="true" /> Tələbəyə göndər
          </button>
          {!canSend && <p className="mt-2 text-[13px] text-muted">{total === 0 ? "Göndərmək üçün ən azı bir hərəkət əlavə et." : "Göndərmək üçün ən azı bir tələbə seç."}</p>}
          {(total > 0 || draft.name) && (
            <button
              type="button"
              onClick={() => {
                resetDraft();
                toast("Qaralama təmizləndi", { tone: "info" });
              }}
              className="btn btn-ghost mt-2 w-full"
            >
              Qaralamanı təmizlə
            </button>
          )}
        </aside>
      </div>

      <ExercisePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        dayName={day.name}
        addedIds={day.exercises.map((exercise) => exercise.equipmentId)}
        onPick={(item) => {
          addToDraft(item.id, activeDay);
          toast(`${item.short} əlavə edildi: ${day.name}`);
        }}
      />

      <Modal
        open={Boolean(sent)}
        onClose={closePreview}
        title="Proqram göndərildi"
        description="Tələbə telefonunda bunu görür."
        size="md"
        footer={
          <>
            <button type="button" onClick={closePreview} className="btn btn-ghost">
              Proqramlara qayıt
            </button>
            <button
              type="button"
              onClick={() => {
                setDemoStudentId(previewStudent);
                setRole("student");
                navigate("/student-demo");
              }}
              className="btn btn-accent"
            >
              Tələbə görünüşündə aç
            </button>
          </>
        }
      >
        {sent && (
          <>
            {sent.studentIds.length > 1 && (
              <div className="mb-3 flex flex-wrap justify-center gap-1.5" role="group" aria-label="Tələbə seç">
                {students
                  .filter((student) => sent.studentIds.includes(student.id))
                  .map((student) => (
                    <button
                      key={student.id}
                      type="button"
                      aria-pressed={student.id === previewStudent}
                      onClick={() => setPreviewStudent(student.id)}
                      className={`h-8 rounded-full px-3 text-[13px] ${student.id === previewStudent ? "bg-ink font-medium text-white" : "bg-well"}`}
                    >
                      {firstName(student)}
                    </button>
                  ))}
              </div>
            )}
            <div className="flex justify-center overflow-hidden rounded-2xl bg-frame py-5">
              <div className="h-[560px] w-[278px]">
                <div className="origin-top-left scale-[0.8]">
                  <PhoneFrame always>
                    <StudentApp key={previewStudent} studentId={previewStudent} program={sent} initialTab="program" />
                  </PhoneFrame>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
