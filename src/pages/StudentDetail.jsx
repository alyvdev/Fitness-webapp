import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Camera, ChevronLeft, ChevronRight, HeartPulse, MessageCircle, Phone } from "lucide-react";
import Avatar from "../components/Avatar.jsx";
import Badge, { paymentTone } from "../components/Badge.jsx";
import Card from "../components/Card.jsx";
import Modal from "../components/Modal.jsx";
import Tabs from "../components/Tabs.jsx";
import EquipmentImage from "../components/EquipmentImage.jsx";
import WeightChart from "../components/charts/WeightChart.jsx";
import { programFor, useDemo } from "../context/DemoContext.jsx";
import { getEquipment } from "../data/equipment.js";
import { MEASUREMENT_LABELS, MEASUREMENT_WEEKS, progress } from "../data/progress.js";
import { DAY_SHORT } from "../data/schedule.js";
import {
  MONTHS,
  attendanceSummary,
  debt,
  formatCm,
  formatDate,
  formatKg,
  formatRest,
  formatSigned,
  getMonthCalendar,
  nextClass,
  paymentHistory,
  paymentStatus,
  today,
  weekdayIndex,
} from "../data/selectors.js";

const TABS = [
  { id: "overview", label: "Ümumi" },
  { id: "progress", label: "İrəliləyiş" },
  { id: "attendance", label: "Davamiyyət" },
  { id: "program", label: "Proqram" },
  { id: "payment", label: "Ödəniş" },
];

/* ---- Ümumi ---- */

function OverviewTab({ student, next }) {
  const { updateStudent, toast } = useDemo();
  const [notes, setNotes] = useState(student.notes);
  const [health, setHealth] = useState(student.health);
  const dirty = notes !== student.notes || health !== student.health;

  const save = (event) => {
    event.preventDefault();
    updateStudent(student.id, { notes, health });
    toast("Qeydlər yadda saxlanıldı");
  };

  const rows = [
    ["Yaş", `${student.age}`],
    ["Məqsəd", student.goal],
    ["Telefon", student.phone],
    ["Başlama tarixi", formatDate(new Date(student.since))],
    ["Növbəti dərs", next ? next.label : "—"],
    ["Aylıq ödəniş", `${student.fee} AZN`],
  ];

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <Card title="Profil">
        <dl className="divide-y divide-line">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 py-2.5 text-[14px]">
              <dt className="text-muted">{label}</dt>
              <dd className="tnum text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => toast(`WhatsApp-da ${student.name} ilə söhbət açılır (demo)`)} className="btn btn-dark flex-1">
            <MessageCircle size={16} aria-hidden="true" /> WhatsApp
          </button>
          <button type="button" onClick={() => toast(`${student.phone} nömrəsinə zəng (demo)`, { tone: "info" })} className="btn btn-ghost flex-1">
            <Phone size={16} aria-hidden="true" /> Zəng et
          </button>
        </div>
      </Card>

      <Card title="Qeydlər">
        <form onSubmit={save} className="space-y-4">
          <div>
            <label htmlFor="health" className="label flex items-center gap-1.5">
              <HeartPulse size={14} className="text-danger" aria-hidden="true" /> Sağlamlıq qeydi
            </label>
            <textarea id="health" rows={2} value={health} onChange={(event) => setHealth(event.target.value)} className="field border-amber-soft bg-amber-soft/50" />
          </div>
          <div>
            <label htmlFor="notes" className="label">
              Müəllimin qeydləri
            </label>
            <textarea id="notes" rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} className="field" />
          </div>
          <button type="submit" disabled={!dirty} className="btn btn-dark">
            Yadda saxla
          </button>
        </form>
      </Card>
    </div>
  );
}

/* ---- İrəliləyiş ---- */

function ProgressTab({ student, series }) {
  const { toast } = useDemo();
  const measurements = progress[student.id].measurements;
  const change = series[series.length - 1] - series[0];

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <Card
        title="Çəki, son 12 həftə"
        action={
          <p className="tnum text-[14px] text-muted">
            {formatKg(series[0])} → <span className="font-semibold text-ink">{formatKg(series[series.length - 1])} kq</span> ({formatSigned(change)})
          </p>
        }
      >
        <WeightChart weights={series} height={260} />
      </Card>

      <div className="space-y-4">
        <Card title="Bədən ölçüləri, sm">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-[13px] text-muted">
                <th scope="col" className="pb-2 text-left font-normal">Nahiyə</th>
                {MEASUREMENT_WEEKS.map((week) => (
                  <th key={week} scope="col" className="pb-2 text-right font-normal">
                    H{week}
                  </th>
                ))}
                <th scope="col" className="pb-2 text-right font-normal">Fərq</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(MEASUREMENT_LABELS).map(([key, label]) => {
                const values = measurements[key];
                const diff = values[values.length - 1] - values[0];
                return (
                  <tr key={key} className="border-t border-line">
                    <th scope="row" className="py-2.5 text-left font-medium">{label}</th>
                    {values.map((value, index) => (
                      <td key={MEASUREMENT_WEEKS[index]} className={`tnum py-2.5 text-right ${index === values.length - 1 ? "font-semibold" : "text-muted"}`}>
                        {formatCm(value)}
                      </td>
                    ))}
                    <td className="tnum py-2.5 text-right text-muted">{formatSigned(diff)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <Card title="Əvvəl və sonra">
          <div className="grid grid-cols-2 gap-3">
            {["Əvvəl", "Sonra"].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => toast(`"${label}" şəkli üçün kamera açılır (demo)`, { tone: "info" })}
                className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#c9cec4] bg-well text-muted transition-colors hover:border-ink hover:text-ink"
              >
                <Camera size={22} strokeWidth={1.5} aria-hidden="true" />
                <span className="text-[14px] font-medium">{label}</span>
                <span className="text-[13px]">Şəkil əlavə et</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---- Davamiyyət ---- */

const DAY_STYLES = {
  attended: "bg-lime text-ink font-semibold",
  missed: "bg-danger-soft text-danger font-semibold",
  upcoming: "border border-dashed border-ink/50 text-ink",
};

function AttendanceTab({ student }) {
  const { classes } = useDemo();
  const [offset, setOffset] = useState(0);
  const base = today();
  const month = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const days = getMonthCalendar(student.id, classes, month);
  const blanks = weekdayIndex(month);
  const summary = attendanceSummary(student.id);

  const legend = [
    ["attended", "Gəlib"],
    ["missed", "Buraxıb"],
    ["upcoming", "Planlaşdırılıb"],
  ];

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <Card
        title={`${MONTHS[month.getMonth()]} ${month.getFullYear()}`}
        action={
          <div className="flex gap-1">
            <button type="button" onClick={() => setOffset((v) => v - 1)} disabled={offset <= -2} className="btn btn-ghost btn-sm btn-icon" aria-label="Əvvəlki ay">
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => setOffset((v) => v + 1)} disabled={offset >= 1} className="btn btn-ghost btn-sm btn-icon" aria-label="Növbəti ay">
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {DAY_SHORT.map((day) => (
            <span key={day} className="pb-1 text-[12px] text-muted">
              {day}
            </span>
          ))}
          {Array.from({ length: blanks }, (_, index) => (
            <span key={`blank-${index}`} />
          ))}
          {days.map(({ date, status, isToday }) => (
            <span
              key={date.getDate()}
              title={status ? `${formatDate(date)} — ${legend.find(([key]) => key === status)[1]}` : formatDate(date)}
              className={`tnum flex aspect-square items-center justify-center rounded-lg text-[13px] ${status ? DAY_STYLES[status] : "text-faint"} ${isToday ? "ring-2 ring-ink ring-offset-1" : ""}`}
            >
              {date.getDate()}
            </span>
          ))}
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-muted">
          {legend.map(([key, label]) => (
            <li key={key} className="flex items-center gap-1.5">
              <span className={`h-3.5 w-3.5 rounded ${DAY_STYLES[key]}`} aria-hidden="true" /> {label}
            </li>
          ))}
          <li className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded ring-2 ring-ink" aria-hidden="true" /> Bu gün
          </li>
        </ul>
      </Card>

      <Card title="Son 30 gün">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {[
            ["Davamiyyət", `${summary.rate}%`, summary.rate < 75],
            ["Gəldiyi dərs", `${summary.attended}/${summary.total}`, false],
            ["Buraxdığı dərs", `${summary.missed}`, summary.missed >= 2],
            ["Ardıcıl gəliş", `${summary.streak} dərs`, false],
          ].map(([label, value, alert]) => (
            <div key={label}>
              <dt className="text-[13px] text-muted">{label}</dt>
              <dd className={`tnum mt-0.5 text-[24px] font-semibold leading-tight ${alert ? "text-danger" : ""}`}>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 rounded-xl bg-well px-3.5 py-3 text-[14px] leading-relaxed">
          {summary.missed >= 2
            ? `${student.name.split(" ")[0]} son 30 gündə ${summary.missed} dərs buraxıb. Yazıb səbəbini soruşmağa dəyər.`
            : summary.missed === 1
              ? "Bir dərs buraxılıb, qalan dərslərin hamısına gəlib."
              : "Son 30 gündə heç bir dərs buraxılmayıb."}
        </p>
      </Card>
    </div>
  );
}

/* ---- Proqram ---- */

function ProgramTab({ student, program, onAssign }) {
  const { loadDraft } = useDemo();
  const navigate = useNavigate();

  if (!program) {
    return (
      <div className="rounded-[14px] bg-well px-5 py-12 text-center">
        <p className="text-[16px] font-semibold">Hələ proqram təyin edilməyib</p>
        <p className="mt-1 text-[14px] text-muted">Hazır şablonlardan birini seç və ya sıfırdan qur.</p>
        <button type="button" onClick={onAssign} className="btn btn-accent mt-4">
          Yeni proqram təyin et
        </button>
      </div>
    );
  }

  return (
    <Card
      title={program.name}
      action={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              loadDraft(program);
              navigate("/programs/new");
            }}
            className="btn btn-ghost btn-sm"
          >
            Redaktə et
          </button>
          <button type="button" onClick={onAssign} className="btn btn-accent btn-sm">
            Yeni proqram təyin et
          </button>
        </div>
      }
    >
      <p className="max-w-[640px] text-[14px] leading-relaxed text-muted">{program.description}</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {program.days.map((day, index) => (
          <section key={day.name + index} className="rounded-xl bg-well p-3" aria-label={day.name}>
            <h3 className="mb-2 flex items-center justify-between px-1 text-[14px] font-semibold">
              {day.name}
              <span className="tnum text-[13px] font-normal text-muted">{day.exercises.length} hərəkət</span>
            </h3>
            <ul className="space-y-1.5">
              {day.exercises.map((exercise, i) => {
                const item = getEquipment(exercise.equipmentId);
                return (
                  <li key={`${exercise.equipmentId}-${i}`}>
                    <Link to={`/equipment/${item.id}`} className="flex items-center gap-2.5 rounded-lg bg-sheet p-1.5 pr-3 transition-colors hover:bg-active">
                      <EquipmentImage item={item} showName={false} className="h-10 w-10 flex-none" rounded="rounded-md" />
                      <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{item.short}</span>
                      <span className="tnum flex-none text-[13px] text-muted" title={`Fasilə: ${formatRest(exercise.rest)}`}>
                        {exercise.sets} × {exercise.reps}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </Card>
  );
}

/* ---- Ödəniş ---- */

function PaymentTab({ student }) {
  const { updateStudent, toast } = useDemo();
  const history = paymentHistory(student);
  const owed = debt(student);

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card title="Aylıq ödənişlər">
        <ul className="divide-y divide-line">
          {history.map((row) => (
            <li key={row.key} className="flex items-center gap-3 py-3 text-[14px]">
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{row.label}</span>
                <span className="tnum block text-[13px] text-muted">{row.paidOn ? `Ödənilib: ${row.paidOn}` : "Ödəniş gözlənilir"}</span>
              </span>
              <span className="tnum font-medium">{row.amount} AZN</span>
              <Badge tone={paymentTone(row.status)}>{row.status}</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Borc">
        <p className={`tnum text-[30px] font-semibold leading-tight ${owed ? "text-danger" : ""}`}>
          {owed} <span className="text-[16px] font-normal text-muted">AZN</span>
        </p>
        <p className="mt-1 text-[14px] text-muted">{owed ? `${student.unpaidMonths} aylıq ödəniş gecikir.` : "Bütün ödənişlər vaxtında edilib."}</p>
        {owed > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            <button type="button" onClick={() => toast(`${student.name} üçün ödəniş xatırlatması göndərildi (demo)`)} className="btn btn-dark">
              Ödənişi xatırlat
            </button>
            <button
              type="button"
              onClick={() => {
                updateStudent(student.id, { unpaidMonths: student.unpaidMonths - 1 });
                toast(`${student.fee} AZN ödəniş qeyd edildi`);
              }}
              className="btn btn-ghost"
            >
              Bir ayı ödənildi kimi qeyd et
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ---- Page ---- */

export default function StudentDetail() {
  const { id } = useParams();
  const { students, weights, classes, programs, assignProgram, toast } = useDemo();
  const [tab, setTab] = useState("overview");
  const [assignOpen, setAssignOpen] = useState(false);

  const student = students.find((s) => s.id === id);
  if (!student) return <Navigate to="/students" replace />;

  const series = weights[student.id];
  const summary = attendanceSummary(student.id);
  const status = paymentStatus(student);
  const program = programFor(programs, student.id);
  const next = nextClass(student.id, classes);

  const kpis = [
    ["Hazırkı çəki", `${formatKg(series[series.length - 1])} kq`, `12 həftədə ${formatSigned(series[series.length - 1] - series[0])} kq`, false],
    ["Davamiyyət", `${summary.rate}%`, `30 gündə ${summary.attended}/${summary.total} dərs`, summary.rate < 75],
    ["Növbəti dərs", next ? next.label : "—", next ? next.cls.type : "Planlaşdırılmayıb", false],
    ["Ödəniş", status, status === "Gecikir" ? `Borc: ${debt(student)} AZN` : `${student.fee} AZN / ay`, status === "Gecikir"],
  ];

  return (
    <>
      <Link to="/students" className="mb-3 inline-flex items-center gap-1 text-[14px] text-muted hover:text-ink">
        <ChevronLeft size={15} aria-hidden="true" /> Tələbələr
      </Link>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <Avatar student={student} size={56} />
          <div className="min-w-0">
            <h1 className="font-display text-[24px] leading-[1.15] sm:text-[26px]">{student.name}</h1>
            <p className="mt-0.5 text-[14px] text-muted">
              {student.goal} · {student.age} yaş
            </p>
          </div>
        </div>
        <button type="button" onClick={() => setAssignOpen(true)} className="btn btn-accent">
          Yeni proqram təyin et
        </button>
      </div>

      <dl className="mb-5 grid grid-cols-2 overflow-hidden rounded-[14px] border border-line lg:grid-cols-4">
        {kpis.map(([label, value, caption, alert], index) => (
          <div key={label} className={`px-4 py-3.5 ${index % 2 ? "border-l border-line" : ""} ${index > 1 ? "max-lg:border-t max-lg:border-line" : ""} ${index === 2 ? "lg:border-l lg:border-line" : ""}`}>
            <dt className="text-[13px] text-muted">{label}</dt>
            <dd className={`tnum mt-0.5 truncate text-[20px] font-semibold leading-tight sm:text-[22px] ${alert ? "text-danger" : ""}`}>{value}</dd>
            <dd className="tnum mt-0.5 truncate text-[13px] text-muted">{caption}</dd>
          </div>
        ))}
      </dl>

      <Tabs tabs={TABS} value={tab} onChange={setTab} label="Tələbə bölmələri" className="mb-5" />

      <div role="tabpanel" aria-label={TABS.find((t) => t.id === tab).label}>
        {tab === "overview" && <OverviewTab key={student.id} student={student} next={next} />}
        {tab === "progress" && <ProgressTab student={student} series={series} />}
        {tab === "attendance" && <AttendanceTab student={student} />}
        {tab === "program" && <ProgramTab student={student} program={program} onAssign={() => setAssignOpen(true)} />}
        {tab === "payment" && <PaymentTab student={student} />}
      </div>

      <Modal open={assignOpen} onClose={() => setAssignOpen(false)} title="Proqram təyin et" description={`${student.name} üçün proqram seç. Əvvəlki proqramı əvəz edəcək.`}>
        <ul className="space-y-2">
          {programs.map((item) => {
            const current = item.id === program?.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  disabled={current}
                  onClick={() => {
                    assignProgram(item.id, student.id);
                    setAssignOpen(false);
                    setTab("program");
                    toast(`"${item.name}" ${student.name.split(" ")[0]} üçün təyin edildi`);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${current ? "bg-lime-soft" : "bg-well hover:bg-active"}`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold">{item.name}</span>
                    <span className="tnum block text-[13px] text-muted">
                      {item.days.length} gün · {item.days.reduce((sum, day) => sum + day.exercises.length, 0)} hərəkət · {item.level}
                    </span>
                  </span>
                  {current ? <Badge tone="accent">Hazırkı</Badge> : <ChevronRight size={16} className="text-faint" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
        <Link to="/programs/new" className="btn btn-ghost mt-3 w-full">
          Sıfırdan yeni proqram qur
        </Link>
      </Modal>
    </>
  );
}
