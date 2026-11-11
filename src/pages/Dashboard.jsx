import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import Card from "../components/Card.jsx";
import Avatar, { AvatarStack } from "../components/Avatar.jsx";
import Badge, { classTone } from "../components/Badge.jsx";
import EquipmentImage from "../components/EquipmentImage.jsx";
import AttendanceChart from "../components/charts/AttendanceChart.jsx";
import { programFor, useDemo } from "../context/DemoContext.jsx";
import { useHeading } from "../context/PreviewContext.jsx";
import { equipment } from "../data/equipment.js";
import { DAY_NAMES } from "../data/schedule.js";
import { attendanceSummary, classesOn, debt, endTime, formatDate, today, weekdayIndex, weeklyAttendanceTrend } from "../data/selectors.js";

export default function Dashboard() {
  const { students, classes, programs } = useDemo();
  const TrendTitle = useHeading("h2");
  const withProgram = students.filter((student) => programFor(programs, student.id)).length;
  const now = today();
  const todayIndex = weekdayIndex(now);
  const todayClasses = classesOn(classes, todayIndex);
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

  const summaries = students.map((student) => ({ student, attendance: attendanceSummary(student.id) }));
  const attended = summaries.reduce((sum, row) => sum + row.attendance.attended, 0);
  const total = summaries.reduce((sum, row) => sum + row.attendance.total, 0);
  const averageRate = total ? Math.round((attended / total) * 100) : 0;
  const late = students.filter((student) => student.unpaidMonths > 0);
  const lateSum = late.reduce((sum, student) => sum + debt(student), 0);
  const trend = weeklyAttendanceTrend(8);

  // Students who missed 2+ classes in 30 days or whose payment is overdue.
  const attention = summaries
    .map(({ student, attendance }) => {
      const reasons = [];
      if (attendance.missed >= 2) reasons.push(`30 gündə ${attendance.missed} dərs buraxıb`);
      if (student.unpaidMonths > 0) reasons.push(`${debt(student)} AZN ödəniş gecikir`);
      return { student, reasons, weight: attendance.missed + student.unpaidMonths * 2 };
    })
    .filter((row) => row.reasons.length)
    .sort((a, b) => b.weight - a.weight);

  const kpis = [
    { label: "Aktiv tələbə", value: students.length, caption: `${withProgram} nəfərin proqramı var` },
    { label: "Bu həftə dərs sayı", value: classes.length, caption: `bu gün ${todayClasses.length} dərs` },
    { label: "Orta davamiyyət", value: `${averageRate}%`, caption: `son 30 gün, ${attended}/${total} dərs` },
    { label: "Gecikən ödəniş", value: `${lateSum} AZN`, caption: late.length ? `${late.length} tələbə` : "gecikən yoxdur", alert: late.length > 0 },
  ];

  return (
    <>
      <PageHeader
        title="İdarə paneli"
        subtitle={`${DAY_NAMES[todayIndex]}, ${formatDate(now)} · bu gün ${todayClasses.length} dərs${attention.length ? `, ${attention.length} tələbə diqqət tələb edir` : ""}`}
      >
        <Link to="/schedule" className="btn btn-ghost">
          Cədvələ bax
        </Link>
        <Link to="/programs/new" className="btn btn-accent">
          <Plus size={17} strokeWidth={2.5} aria-hidden="true" /> Proqram qur
        </Link>
      </PageHeader>

      <dl className="mb-4 grid grid-cols-2 overflow-hidden rounded-[14px] border border-line lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <div key={kpi.label} className={`px-4 py-4 sm:px-5 ${index % 2 ? "border-l border-line" : ""} ${index > 1 ? "max-lg:border-t max-lg:border-line" : ""} ${index === 2 ? "lg:border-l lg:border-line" : ""}`}>
            <dt className="text-[13px] text-muted sm:text-[14px]">{kpi.label}</dt>
            <dd className={`tnum mt-1 text-[26px] font-semibold leading-none sm:text-[30px] ${kpi.alert ? "text-danger" : ""}`}>{kpi.value}</dd>
            <dd className="tnum mt-1.5 truncate text-[13px] text-muted">{kpi.caption}</dd>
          </div>
        ))}
      </dl>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          <Card
            title={`Bugünkü dərslər (${todayClasses.length})`}
            action={
              <Link to="/schedule" className="flex items-center gap-1 text-[14px] font-medium hover:underline">
                Həftəlik cədvəl <ArrowRight size={14} aria-hidden="true" />
              </Link>
            }
          >
            {todayClasses.length === 0 ? (
              <p className="rounded-xl bg-well px-4 py-6 text-center text-[14px] text-muted">Bu gün dərs yoxdur. İstirahət günüdür.</p>
            ) : (
              <ul className="divide-y divide-line">
                {todayClasses.map((cls) => {
                  const start = cls.start.split(":").map(Number);
                  const startMinutes = start[0] * 60 + start[1];
                  const state = nowMinutes >= startMinutes + cls.duration ? "Bitib" : nowMinutes >= startMinutes ? "İndi" : null;
                  const people = students.filter((student) => cls.studentIds.includes(student.id));
                  return (
                    <li key={cls.id} className={`flex items-center gap-3 py-3 ${state === "Bitib" ? "opacity-55" : ""}`}>
                      <p className="tnum w-[50px] flex-none text-[15px] font-semibold leading-tight">
                        {cls.start}
                        <span className="block text-[13px] font-normal text-muted">{endTime(cls)}</span>
                      </p>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-medium">{cls.title}</p>
                        <p className="truncate text-[13px] text-muted">{cls.note || `${cls.duration} dəqiqə`}</p>
                      </div>
                      <span className="hidden sm:block">
                        <AvatarStack students={people} />
                      </span>
                      {state === "İndi" ? <Badge tone="accent">İndi</Badge> : <Badge tone={classTone(cls.type)}>{cls.type}</Badge>}
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <section className="on-dark rounded-[14px] bg-ink p-4 text-white sm:p-5" aria-labelledby="trend-title">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <TrendTitle id="trend-title" className="text-[15px] font-semibold">
                Həftəlik davamiyyət
              </TrendTitle>
              <p className="tnum text-[13px] text-white/70">
                Son həftə <span className="font-semibold text-lime">{trend[trend.length - 1].rate}%</span> · əvvəlki həftə {trend[trend.length - 2].rate}%
              </p>
            </div>
            <AttendanceChart data={trend} height={200} />
          </section>
        </div>

        <div className="space-y-4">
          <Card title="Diqqət tələb edənlər">
            {attention.length === 0 ? (
              <p className="rounded-xl bg-well px-4 py-6 text-center text-[14px] text-muted">Hər şey qaydasındadır: buraxılan dərs və gecikən ödəniş yoxdur.</p>
            ) : (
              <ul className="divide-y divide-line">
                {attention.map(({ student, reasons }) => (
                  <li key={student.id}>
                    <Link to={`/students/${student.id}`} className="group flex items-center gap-3 py-3">
                      <Avatar student={student} size={40} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-medium">{student.name}</span>
                        {reasons.map((reason) => (
                          <span key={reason} className="tnum block truncate text-[13px] text-danger">
                            {reason}
                          </span>
                        ))}
                      </span>
                      <ArrowRight size={15} className="flex-none text-faint transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card
            title="Aparat kitabxanası"
            action={
              <Link to="/equipment" className="flex items-center gap-1 text-[14px] font-medium hover:underline">
                Hamısı <ArrowRight size={14} aria-hidden="true" />
              </Link>
            }
          >
            <div className="grid grid-cols-4 gap-2">
              {equipment.slice(0, 4).map((item) => (
                <Link key={item.id} to={`/equipment/${item.id}`} aria-label={item.name} className="transition-transform hover:scale-[1.04]">
                  <EquipmentImage item={item} showName={false} className="aspect-square w-full" rounded="rounded-lg" />
                </Link>
              ))}
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">
              {equipment.length} aparatın izahı hazırdır. QR kodu aparata yapışdır — tələbə özü oxusun.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
