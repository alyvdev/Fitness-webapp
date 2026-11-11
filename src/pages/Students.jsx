import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Search } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import Avatar from "../components/Avatar.jsx";
import Badge, { paymentTone } from "../components/Badge.jsx";
import { Segmented } from "../components/Tabs.jsx";
import { useDemo } from "../context/DemoContext.jsx";
import { GOALS } from "../data/students.js";
import { attendanceSummary, formatKg, nextClass, paymentStatus } from "../data/selectors.js";

const ALL = "Hamısı";

function AttendanceCell({ rate }) {
  return (
    <span className="inline-flex items-center justify-end gap-2">
      <span className="hidden h-1.5 w-14 overflow-hidden rounded-full bg-active lg:block" aria-hidden="true">
        <span className={`block h-full rounded-full ${rate < 75 ? "bg-danger" : "bg-lime-deep"}`} style={{ width: `${rate}%` }} />
      </span>
      <span className={`tnum ${rate < 75 ? "font-semibold text-danger" : ""}`}>{rate}%</span>
    </span>
  );
}

export default function Students() {
  const { students, weights, classes } = useDemo();
  const [query, setQuery] = useState("");
  const [goal, setGoal] = useState(ALL);
  const [payment, setPayment] = useState(ALL);

  const rows = useMemo(
    () =>
      students.map((student) => {
        const series = weights[student.id];
        return {
          student,
          weight: series[series.length - 1],
          attendance: attendanceSummary(student.id),
          payment: paymentStatus(student),
          next: nextClass(student.id, classes),
        };
      }),
    [students, weights, classes],
  );

  const visible = rows.filter(({ student, payment: status }) => {
    if (goal !== ALL && student.goal !== goal) return false;
    if (payment !== ALL && status !== payment) return false;
    return student.name.toLocaleLowerCase("az").includes(query.trim().toLocaleLowerCase("az"));
  });

  const lateCount = rows.filter((row) => row.payment === "Gecikir").length;
  const reset = () => {
    setQuery("");
    setGoal(ALL);
    setPayment(ALL);
  };

  return (
    <>
      <PageHeader
        title="Tələbələr"
        subtitle={`${students.length} aktiv tələbə · ${lateCount ? `${lateCount} nəfərin ödənişi gecikir` : "bütün ödənişlər vaxtındadır"}`}
      />

      <div className="space-y-3">
        <div className="relative max-w-[420px]">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ad ilə axtar" aria-label="Tələbəni ad ilə axtar" className="field pl-9" />
        </div>
        <div className="flex items-center gap-3">
          <span className="w-[60px] flex-none text-[13px] text-muted">Məqsəd</span>
          <Segmented label="Məqsəd" options={[ALL, ...GOALS]} value={goal} onChange={setGoal} className="-mr-4 min-w-0 flex-1 pr-4 sm:mr-0 sm:pr-0" />
        </div>
        <div className="flex items-center gap-3">
          <span className="w-[60px] flex-none text-[13px] text-muted">Ödəniş</span>
          <Segmented label="Ödəniş statusu" options={[ALL, "Ödənilib", "Gecikir"]} value={payment} onChange={setPayment} className="min-w-0 flex-1" />
        </div>
      </div>

      <p className="tnum mb-2 mt-5 text-[14px] text-muted" aria-live="polite">
        {visible.length} tələbə
      </p>

      {visible.length === 0 ? (
        <div className="rounded-[14px] bg-well px-5 py-12 text-center">
          <p className="text-[16px] font-semibold">Bu filtrlərə uyğun tələbə yoxdur</p>
          <button type="button" onClick={reset} className="btn btn-dark mt-4">
            Bütün tələbələri göstər
          </button>
        </div>
      ) : (
        <>
          {/* Desktop and tablet: table */}
          <div className="hidden md:block">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr className="text-left text-[13px] text-muted">
                  <th scope="col" className="h-10 font-normal">Tələbə</th>
                  <th scope="col" className="h-10 font-normal">Məqsəd</th>
                  <th scope="col" className="h-10 text-right font-normal">Çəki</th>
                  <th scope="col" className="h-10 pr-6 text-right font-normal">Davamiyyət, 30 gün</th>
                  <th scope="col" className="h-10 font-normal">Ödəniş</th>
                  <th scope="col" className="h-10 font-normal">Növbəti dərs</th>
                  <th scope="col" className="h-10 w-8"><span className="sr-only">Aç</span></th>
                </tr>
              </thead>
              <tbody>
                {visible.map(({ student, weight, attendance, payment: status, next }) => (
                  <tr key={student.id} className="group relative border-t border-line transition-colors hover:bg-well">
                    <td className="h-[60px] py-2 pr-3">
                      <Link to={`/students/${student.id}`} className="flex items-center gap-3 after:absolute after:inset-0">
                        <Avatar student={student} size={36} />
                        <span className="font-semibold">{student.name}</span>
                      </Link>
                    </td>
                    <td className="pr-3 text-muted">{student.goal}</td>
                    <td className="tnum text-right">
                      {formatKg(weight)} <span className="text-muted">kq</span>
                    </td>
                    <td className="pr-6 text-right">
                      <AttendanceCell rate={attendance.rate} />
                    </td>
                    <td>
                      <Badge tone={paymentTone(status)}>{status}</Badge>
                    </td>
                    <td className="tnum text-muted">{next ? next.label : "—"}</td>
                    <td className="text-faint">
                      <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phone: two-line rows */}
          <ul className="divide-y divide-line border-t border-line md:hidden">
            {visible.map(({ student, weight, attendance, payment: status, next }) => (
              <li key={student.id}>
                <Link to={`/students/${student.id}`} className="flex items-center gap-3 py-3">
                  <Avatar student={student} size={44} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-[15px] font-semibold">{student.name}</span>
                      <Badge tone={paymentTone(status)}>{status}</Badge>
                    </span>
                    <span className="tnum mt-0.5 block truncate text-[13px] text-muted">
                      {student.goal} · {formatKg(weight)} kq · <span className={attendance.rate < 75 ? "font-semibold text-danger" : ""}>{attendance.rate}%</span>
                    </span>
                    <span className="tnum block truncate text-[13px] text-muted">Növbəti dərs: {next ? next.label : "—"}</span>
                  </span>
                  <ChevronRight size={16} className="flex-none text-faint" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
