import { useEffect } from "react";
import Avatar from "../components/Avatar.jsx";
import PhoneFrame from "../components/PhoneFrame.jsx";
import StudentApp from "../components/StudentApp.jsx";
import { programFor, useDemo } from "../context/DemoContext.jsx";
import { firstName } from "../data/students.js";

export default function StudentDemo() {
  const { students, programs, demoStudentId, setDemoStudentId, setRole } = useDemo();
  const student = students.find((item) => item.id === demoStudentId) ?? students[0];
  const program = programFor(programs, student.id);

  useEffect(() => {
    setRole("student");
  }, [setRole]);

  return (
    <div className="flex flex-1 items-center justify-center gap-14 sm:px-6 sm:py-6">
      <section className="hidden max-w-[340px] lg:block" aria-labelledby="student-view-title">
        <h1 id="student-view-title" className="font-display text-[32px] leading-[1.1]">
          Tələbə bunu görür
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-muted">
          Proqramı göndərən kimi tələbənin telefonunda açılır: bugünkü məşq, hər aparatın izahı və öz irəliləyişi.
        </p>
        <h2 className="mb-2 mt-7 text-[13px] text-muted">Kimin telefonuna baxaq?</h2>
        <ul className="grid grid-cols-2 gap-1.5">
          {students.map((item) => {
            const active = item.id === student.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setDemoStudentId(item.id)}
                  className={`flex h-11 w-full items-center gap-2 rounded-full pl-1.5 pr-3 text-[14px] transition-colors ${active ? "bg-ink font-medium text-white" : "bg-sheet hover:bg-active"}`}
                >
                  <Avatar student={item} size={32} />
                  <span className="truncate">{firstName(item)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <PhoneFrame>
        <h1 className="sr-only lg:hidden">Tələbə görünüşü</h1>
        <StudentApp key={student.id} studentId={student.id} program={program} />
      </PhoneFrame>
    </div>
  );
}
