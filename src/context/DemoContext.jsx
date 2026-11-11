import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { programs as seedPrograms } from "../data/programs.js";
import { schedule as seedSchedule } from "../data/schedule.js";
import { students as seedStudents } from "../data/students.js";
import { progress } from "../data/progress.js";
import { getEquipment } from "../data/equipment.js";

const DemoContext = createContext(null);

let uid = 0;
const nextId = (prefix) => `${prefix}-${Date.now().toString(36)}-${(uid += 1)}`;

const emptyDraft = () => ({
  sourceId: null,
  name: "",
  description: "",
  activeDay: 0,
  days: [{ name: "Gün 1", exercises: [] }],
  studentIds: [],
});

const toDraftExercise = (exercise) => ({ ...exercise, uid: nextId("ex") });

export function DemoProvider({ children }) {
  const [role, setRole] = useState("teacher");
  const [programs, setPrograms] = useState(seedPrograms);
  const [classes, setClasses] = useState(seedSchedule);
  const [students, setStudents] = useState(seedStudents);
  const [weights, setWeights] = useState(() =>
    Object.fromEntries(Object.entries(progress).map(([id, entry]) => [id, entry.weight])),
  );
  const [draft, setDraft] = useState(emptyDraft);
  const [toasts, setToasts] = useState([]);
  const [demoStudentId, setDemoStudentId] = useState("aysel");
  const [doneExercises, setDoneExercises] = useState({});
  const timers = useRef({});

  const dismissToast = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }, []);

  // toast("Mətn", { tone: "success" | "info" | "warn", action: { label, to } })
  const toast = useCallback(
    (message, options = {}) => {
      const id = nextId("toast");
      setToasts((list) => [...list.slice(-2), { id, message, tone: "success", ...options }]);
      timers.current[id] = setTimeout(() => dismissToast(id), 4200);
    },
    [dismissToast],
  );

  /* ---- Program draft ---- */

  const updateDraft = useCallback((patch) => {
    setDraft((current) => ({ ...current, ...(typeof patch === "function" ? patch(current) : patch) }));
  }, []);

  const updateDraftDay = useCallback((dayIndex, updater) => {
    setDraft((current) => ({
      ...current,
      days: current.days.map((day, index) => (index === dayIndex ? { ...day, exercises: updater(day.exercises) } : day)),
    }));
  }, []);

  const addToDraft = useCallback((equipmentId, dayIndex) => {
    const item = getEquipment(equipmentId);
    if (!item) return;
    setDraft((current) => {
      const target = dayIndex ?? current.activeDay;
      return {
        ...current,
        days: current.days.map((day, index) =>
          index === target
            ? { ...day, exercises: [...day.exercises, toDraftExercise({ equipmentId, ...item.defaults, note: "" })] }
            : day,
        ),
      };
    });
  }, []);

  const resetDraft = useCallback(() => setDraft(emptyDraft()), []);

  const loadDraft = useCallback((program, { asCopy = false } = {}) => {
    setDraft({
      sourceId: asCopy ? null : program.id,
      name: asCopy ? `${program.name} (surət)` : program.name,
      description: program.description,
      activeDay: 0,
      days: program.days.map((day) => ({ name: day.name, exercises: day.exercises.map(toDraftExercise) })),
      studentIds: asCopy ? [] : program.studentIds,
    });
  }, []);

  // A student follows one program at a time: assigning removes them elsewhere.
  const withoutStudents = (list, studentIds) =>
    list.map((program) => ({ ...program, studentIds: program.studentIds.filter((id) => !studentIds.includes(id)) }));

  const sendDraft = useCallback(() => {
    const program = {
      id: draft.sourceId ?? nextId("program"),
      name: draft.name.trim() || "Adsız proqram",
      description: draft.description.trim() || "Fərdi proqram.",
      level: "Fərdi",
      weeks: 4,
      isTemplate: false,
      studentIds: draft.studentIds,
      days: draft.days.map((day) => ({
        name: day.name,
        exercises: day.exercises.map(({ uid: _uid, ...exercise }) => exercise),
      })),
    };
    setPrograms((list) => {
      const cleaned = withoutStudents(list, program.studentIds);
      const existing = cleaned.find((item) => item.id === program.id);
      if (existing) {
        return cleaned.map((item) => (item.id === program.id ? { ...existing, ...program, isTemplate: existing.isTemplate, level: existing.level, weeks: existing.weeks } : item));
      }
      return [program, ...cleaned];
    });
    return program;
  }, [draft]);

  const duplicateProgram = useCallback((programId) => {
    setPrograms((list) => {
      const source = list.find((program) => program.id === programId);
      if (!source) return list;
      const copy = { ...source, id: nextId("program"), name: `${source.name} (surət)`, studentIds: [] };
      const index = list.indexOf(source);
      return [...list.slice(0, index + 1), copy, ...list.slice(index + 1)];
    });
  }, []);

  const assignProgram = useCallback((programId, studentId) => {
    setPrograms((list) =>
      withoutStudents(list, [studentId]).map((program) =>
        program.id === programId ? { ...program, studentIds: [...program.studentIds, studentId] } : program,
      ),
    );
  }, []);

  /* ---- Schedule ---- */

  const addClass = useCallback((cls) => setClasses((list) => [...list, { ...cls, id: nextId("class") }]), []);
  const updateClass = useCallback((id, patch) => setClasses((list) => list.map((cls) => (cls.id === id ? { ...cls, ...patch } : cls))), []);
  const removeClass = useCallback((id) => setClasses((list) => list.filter((cls) => cls.id !== id)), []);

  /* ---- Students ---- */

  const updateStudent = useCallback((id, patch) => setStudents((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s))), []);
  const addWeight = useCallback((studentId, kg) => setWeights((map) => ({ ...map, [studentId]: [...map[studentId], kg] })), []);

  const toggleExerciseDone = useCallback((key) => setDoneExercises((map) => ({ ...map, [key]: !map[key] })), []);

  const value = useMemo(
    () => ({
      role,
      setRole,
      programs,
      classes,
      students,
      weights,
      draft,
      toasts,
      demoStudentId,
      doneExercises,
      setDemoStudentId,
      toast,
      dismissToast,
      updateDraft,
      updateDraftDay,
      addToDraft,
      resetDraft,
      loadDraft,
      sendDraft,
      duplicateProgram,
      assignProgram,
      addClass,
      updateClass,
      removeClass,
      updateStudent,
      addWeight,
      toggleExerciseDone,
    }),
    [role, programs, classes, students, weights, draft, toasts, demoStudentId, doneExercises, toast, dismissToast, updateDraft, updateDraftDay, addToDraft, resetDraft, loadDraft, sendDraft, duplicateProgram, assignProgram, addClass, updateClass, removeClass, updateStudent, addWeight, toggleExerciseDone],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used inside <DemoProvider>");
  return context;
}

// Program currently assigned to a student, or undefined.
export const programFor = (programs, studentId) => programs.find((program) => program.studentIds.includes(studentId));
export const draftExerciseCount = (draft) => draft.days.reduce((sum, day) => sum + day.exercises.length, 0);
