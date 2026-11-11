import { lazy, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { ArrowRight, ArrowUpRight, Check, Plus } from "lucide-react";
import ScreenPreview from "../components/ScreenPreview.jsx";
import EquipmentImage from "../components/EquipmentImage.jsx";
import { LogoMark } from "../components/Logo.jsx";
import useReveal from "../hooks/useReveal.js";
import { useDemo } from "../context/DemoContext.jsx";
import { equipment, getEquipment } from "../data/equipment.js";
import { classesOn, today, weekdayIndex } from "../data/selectors.js";
import credits from "../data/imageCredits.json";

const Dashboard = lazy(() => import("./Dashboard.jsx"));
const Equipment = lazy(() => import("./Equipment.jsx"));
const Students = lazy(() => import("./Students.jsx"));
const Schedule = lazy(() => import("./Schedule.jsx"));

const TILE = "rounded-[14px]";
const H2 = "font-display text-[clamp(30px,4vw,56px)] leading-[1.02]";

const SECTIONS = [
  { href: "#problem", label: "Problem" },
  { href: "#imkanlar", label: "İmkanlar" },
  { href: "#nece-isleyir", label: "Necə işləyir" },
  { href: "#qiymet", label: "Qiymət" },
];

const FACTS = ["Aparat kitabxanası və QR kodlar", "Fərdi məşq proqramları", "Çəki, ölçü və davamiyyət izləməsi", "Həftəlik dərs cədvəli", "Tələbə üçün telefon görünüşü"];

const PAINS = [
  {
    title: "Eyni aparatı gündə on dəfə izah edirsən.",
    text: "Hər yeni tələbəyə oturacağın hündürlüyünü, tutuşu və nəfəsi yenidən başa salırsan.",
  },
  {
    title: "Proqramlar WhatsApp-da, ölçülər Excel-də itir.",
    text: "Kimə hansı proqramı göndərdiyini tapmaq üçün söhbətləri aşağı-yuxarı çevirirsən.",
  },
  {
    title: "Kimin dərsi nə vaxtdır, yadda qalmır.",
    text: "İki tələbəni eyni saata yazdığını yalnız onlar qapıda görüşəndə bilirsən.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: 29,
    note: "Tək işləyən müəllim üçün",
    lines: ["10 tələbəyə qədər", "Aparat kitabxanası", "Fərdi proqramlar", "Həftəlik cədvəl"],
  },
  {
    name: "Pro",
    price: 59,
    note: "Dolu qrafiki olan müəllim üçün",
    lines: ["Limitsiz tələbə", "Aparatlar üçün QR kodlar", "Çəki, ölçü və davamiyyət izləməsi", "Ödəniş statusları və xatırlatma", "AI təhlil — tezliklə"],
  },
];

const BOARD_IDS = ["leg-press", "lat-pulldown", "cable-crossover", "kettlebell", "treadmill", "hyperextension", "barbell-bench"];
const LEVEL_BLOCK = { Başlanğıc: "bg-white text-ink", Orta: "bg-[#8fa58d] text-ink", İrəli: "bg-ink-4 text-white" };

/* ---- Hero ---- */

function Hero() {
  const marquee = "Formada — aparatı bir dəfə izah et — ";
  return (
    <section className="grid gap-2 lg:min-h-[calc(100svh-16px)] lg:grid-rows-[auto_auto_minmax(0,1fr)]" aria-labelledby="hero-title">
      <div className={`marquee ${TILE} flex h-[104px] items-center overflow-hidden bg-ink-2 sm:h-[150px]`} aria-hidden="true">
        <div className="marquee-track flex flex-none whitespace-nowrap">
          {[0, 1].map((copy) => (
            <span key={copy} className="font-display flex-none pr-[0.3em] text-[clamp(84px,13vw,190px)] leading-none">
              {marquee.repeat(2)}
            </span>
          ))}
        </div>
      </div>

      <nav aria-label="Səhifə bölmələri" className="order-3 grid grid-cols-2 gap-2 lg:order-none lg:grid-cols-4">
        {SECTIONS.map((section) => (
          <a key={section.href} href={section.href} className={`${TILE} group flex h-14 items-center justify-between bg-ink-2 px-5 text-[16px] transition-colors hover:bg-ink-3`}>
            {section.label}
            <ArrowRight size={16} className="rotate-90 text-white/50 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
          </a>
        ))}
      </nav>

      <div className="order-2 grid gap-2 lg:order-none lg:grid-cols-12">
        <div className="order-3 grid grid-cols-2 gap-2 lg:order-none lg:col-span-3 lg:flex lg:flex-col">
          <div className={`${TILE} relative min-h-[180px] overflow-hidden lg:flex-1`}>
            <EquipmentImage item={getEquipment("dumbbells")} eager rounded={TILE} className="absolute inset-0 h-full w-full" alt="Zalda hantel rəfi" />
          </div>
          <ul className={`${TILE} space-y-2 bg-ink-2 p-5 text-[15px] leading-snug`}>
            {FACTS.map((fact) => (
              <li key={fact} className="flex gap-2.5">
                <Check size={16} className="mt-0.5 flex-none text-lime" strokeWidth={2.5} aria-hidden="true" />
                {fact}
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 flex flex-col gap-2 lg:order-none lg:col-span-7">
          <div className={`${TILE} bg-ink-2 p-5 sm:p-7`}>
            <h1 id="hero-title" className="font-display text-[clamp(36px,5.2vw,76px)] leading-[0.98]">
              Aparatı bir dəfə izah et.
            </h1>
            <p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-white/80 sm:text-[19px]">
              Formada fitnes müəllimləri üçün platformadır: aparat kitabxanası, fərdi proqramlar, tələbə izləməsi və həftəlik cədvəl bir yerdə.
            </p>
            <Link to="/dashboard" className="btn btn-accent mt-6 h-12 px-6 text-[16px] lg:hidden">
              Demonu bax <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <Link to="/dashboard" className={`${TILE} group relative block min-h-[240px] flex-1 overflow-hidden bg-frame`} aria-label="Müəllim panelinin demosunu aç">
            <ScreenPreview fill activePath="/dashboard" label="Müəllim panelinin görüntüsü: bugünkü dərslər və davamiyyət" className="h-full min-h-[240px] w-full sm:min-h-[340px]">
              <Dashboard />
            </ScreenPreview>
          </Link>
        </div>

        <div className="order-2 grid grid-cols-2 gap-2 lg:order-none lg:col-span-2 lg:flex lg:flex-col">
          {[
            ["bg-white text-ink", "Bütün interfeys Azərbaycan dilində"],
            ["bg-[#c9d3c4] text-ink", "Telefonda da rahat işləyir"],
            ["bg-ink-4 text-white", "Qiymətlər AZN ilə"],
            ["bg-ink-3 text-white", "Demo üçün qeydiyyat lazım deyil"],
          ].map(([tone, text]) => (
            <p key={text} className={`${TILE} ${tone} flex min-h-[72px] items-start p-4 text-[15px] font-medium leading-snug lg:flex-1`}>
              {text}
            </p>
          ))}
          <Link
            to="/dashboard"
            className={`${TILE} group col-span-2 hidden min-h-[120px] flex-col justify-between bg-lime p-4 text-ink transition-transform active:scale-[0.98] lg:flex lg:flex-[1.6]`}
          >
            <ArrowUpRight size={28} className="self-end transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
            <span className="font-display text-[clamp(22px,1.9vw,30px)] leading-none">Demonu bax</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---- Problem ---- */

function Problem() {
  return (
    <section id="problem" className="grid scroll-mt-4 gap-2 md:grid-cols-2 xl:grid-cols-4" aria-labelledby="problem-title">
      <div className={`${TILE} reveal flex min-h-[200px] flex-col justify-between bg-lime p-6 text-ink xl:min-h-[320px]`}>
        <h2 id="problem-title" className={H2}>
          Tanış gəlir?
        </h2>
        <p className="mt-6 max-w-[300px] text-[16px] font-medium leading-snug">Müəllimlərin vaxtını məşq yox, bu üç şey yeyir.</p>
      </div>
      {PAINS.map((pain, index) => (
        <article key={pain.title} className={`${TILE} reveal flex flex-col justify-between gap-8 bg-ink-2 p-6`} style={{ "--i": index + 1 }}>
          <p className="text-[24px] font-semibold leading-[1.15] tracking-[-0.01em] sm:text-[28px]">{pain.title}</p>
          <p className="text-[16px] leading-relaxed text-white/75">{pain.text}</p>
        </article>
      ))}
    </section>
  );
}

/* ---- Features ---- */

function Features() {
  const { classes, students, weights } = useDemo();
  const todayClasses = classesOn(classes, weekdayIndex(today())).slice(0, 4);
  const aysel = students.find((student) => student.id === "aysel");
  const series = weights.aysel;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const points = series.map((kg, index) => `${(index / (series.length - 1)) * 300},${8 + ((max - kg) / (max - min)) * 64}`).join(" ");

  return (
    <section id="imkanlar" className="grid scroll-mt-4 grid-cols-2 gap-2 lg:grid-cols-12 lg:grid-rows-[repeat(8,88px)]" aria-labelledby="features-title">
      <div className={`${TILE} reveal col-span-2 bg-ink-2 p-6 lg:col-span-3 lg:row-span-3`}>
        <h2 id="features-title" className={H2}>
          Dörd iş, bir panel
        </h2>
      </div>

      <Link to="/equipment" className={`${TILE} reveal group relative col-span-2 min-h-[320px] overflow-hidden lg:col-span-6 lg:row-span-5`} style={{ "--i": 1 }}>
        <EquipmentImage item={getEquipment("cable-crossover")} rounded={TILE} className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]" alt="Zalda krossover aparatı" />
        <div className="absolute inset-x-2 bottom-2 rounded-[10px] bg-ink p-5">
          <h3 className="flex items-center justify-between gap-3 text-[22px] font-semibold leading-tight sm:text-[26px]">
            Aparat kitabxanası
            <ArrowUpRight size={22} className="flex-none text-lime transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </h3>
          <p className="mt-1.5 max-w-[520px] text-[16px] leading-relaxed text-white/80">Hər aparatın real şəkli, addım-addım istifadə qaydası, tez-tez edilən səhvlər və üstünə yapışdırmaq üçün QR kod.</p>
        </div>
      </Link>

      <Link to="/programs" className={`${TILE} reveal group flex flex-col justify-between gap-6 bg-ink-3 p-5 transition-colors hover:bg-ink-4 lg:col-span-3 lg:row-span-3`} style={{ "--i": 2 }}>
        <h3 className="text-[20px] font-semibold leading-tight sm:text-[24px]">Fərdi proqramlar</h3>
        <p className="text-[16px] leading-relaxed text-white/80">Kitabxanadan hərəkət seç, set və təkrarı yaz, bir düymə ilə tələbəyə göndər.</p>
      </Link>

      <div className={`${TILE} reveal flex flex-col justify-between bg-white p-5 text-ink lg:col-span-3 lg:row-span-2`} style={{ "--i": 1 }}>
        <p className="font-display tnum text-[clamp(56px,6vw,88px)] leading-[0.85]">{equipment.length}</p>
        <p className="text-[16px] font-medium leading-snug">aparatın izahı demoda hazırdır</p>
      </div>

      <Link to="/schedule" className={`${TILE} reveal group col-span-2 flex flex-col bg-ink-2 p-5 transition-colors hover:bg-ink-3 lg:col-span-3 lg:row-span-5`} style={{ "--i": 3 }}>
        <h3 className="text-[20px] font-semibold leading-tight sm:text-[24px]">Həftəlik cədvəl</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-white/80">Fərdi, qrup və online dərslər bir təqvimdə. Üst-üstə düşən dərsi özü göstərir.</p>
        <ul className="mt-auto space-y-1 pt-6" data-ui aria-label="Bugünkü dərslərdən nümunə">
          {todayClasses.map((cls) => (
            <li key={cls.id} className="flex items-center gap-3 rounded-lg bg-ink px-3 py-2.5 text-[15px]">
              <span className="tnum font-semibold text-lime">{cls.start}</span>
              <span className="min-w-0 flex-1 truncate">{cls.title}</span>
            </li>
          ))}
        </ul>
      </Link>

      <Link to="/students/aysel" className={`${TILE} reveal group col-span-2 flex flex-col gap-4 bg-ink-2 p-5 transition-colors hover:bg-ink-3 sm:flex-row sm:items-end lg:col-span-6 lg:row-span-3`} style={{ "--i": 2 }}>
        <div className="sm:w-[46%]">
          <h3 className="text-[20px] font-semibold leading-tight sm:text-[24px]">Tələbə izləməsi</h3>
          <p className="mt-2 text-[16px] leading-relaxed text-white/80">Çəki, bədən ölçüləri, davamiyyət və ödəniş — hər tələbə üçün bir səhifədə.</p>
        </div>
        <div className="flex-1 rounded-xl bg-white p-4 text-ink" data-ui>
          <p className="flex items-baseline justify-between gap-2 text-[14px]">
            <span className="font-semibold">{aysel.name}</span>
            <span className="tnum text-muted">
              {String(series[0]).replace(".", ",")} → {String(series[series.length - 1]).replace(".", ",")} kq
            </span>
          </p>
          <svg viewBox="0 0 300 80" className="mt-2 h-[72px] w-full" preserveAspectRatio="none" role="img" aria-label="Ayselin 12 həftəlik çəki qrafiki">
            <polyline points={points} fill="none" stroke="#0e120f" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          </svg>
        </div>
      </Link>

      <Link to="/student-demo" className={`${TILE} reveal group col-span-2 flex flex-col justify-between gap-6 bg-ink-3 p-5 transition-colors hover:bg-ink-4 lg:col-span-3 lg:row-span-3`} style={{ "--i": 3 }}>
        <h3 className="flex items-start justify-between gap-3 text-[20px] font-semibold leading-tight sm:text-[24px]">
          Tələbənin telefonunda
          <ArrowUpRight size={20} className="flex-none text-lime transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </h3>
        <p className="text-[16px] leading-relaxed text-white/80">Bugünkü məşq, hər aparatın izahı və öz irəliləyişi — tətbiq yükləmədən.</p>
      </Link>
    </section>
  );
}

/* ---- How it works: the same exercise, one step further in each field ---- */

function MiniCard({ children, className = "" }) {
  return (
    <div data-ui className={`w-full max-w-[280px] rounded-2xl bg-white p-3 text-ink shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition-transform duration-200 group-hover:-translate-y-1.5 ${className}`}>
      {children}
    </div>
  );
}

function HowItWorks() {
  const item = getEquipment("leg-press");
  const fields = [
    {
      tone: "bg-ink-2 text-white",
      text: "Əvvəl zalındakı aparatları kitabxanada tapırsan.",
      card: (
        <MiniCard>
          <EquipmentImage item={item} showName={false} className="aspect-[16/10] w-full" />
          <div className="flex items-center justify-between gap-2 px-1 pt-2.5">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold">{item.short}</p>
              <p className="truncate text-[13px] text-muted">{item.muscles.primary.join(", ")}</p>
            </div>
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-lime">
              <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
            </span>
          </div>
        </MiniCard>
      ),
    },
    {
      tone: "bg-ink-4 text-white",
      text: "Sonra onlardan proqram qurursan.",
      card: (
        <MiniCard>
          <p className="px-1 text-[13px] text-muted">Gün 1 · 3 hərəkət</p>
          <ul className="mt-2 space-y-1.5">
            {["leg-press", "hyperextension", "medicine-ball"].map((id, index) => {
              const row = getEquipment(id);
              return (
                <li key={id} className={`flex items-center gap-2.5 rounded-xl p-1.5 pr-3 ${index === 0 ? "bg-lime-soft" : "bg-well"}`}>
                  <EquipmentImage item={row} showName={false} className="h-10 w-10 flex-none" rounded="rounded-lg" />
                  <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{row.short}</span>
                  <span className="tnum text-[13px] text-muted">
                    {row.defaults.sets} × {row.defaults.reps}
                  </span>
                </li>
              );
            })}
          </ul>
        </MiniCard>
      ),
    },
    {
      tone: "bg-lime text-ink",
      text: "Tələbə telefonunda açır və məşq edir.",
      card: (
        <MiniCard>
          <p className="flex items-center justify-between px-1 text-[13px] text-muted">
            Bugünkü məşq <span className="tnum font-medium text-ink">1/3 tamamlandı</span>
          </p>
          <div className="mt-2 flex items-center gap-2.5 rounded-xl bg-lime-soft p-1.5">
            <EquipmentImage item={item} showName={false} className="h-12 w-12 flex-none" rounded="rounded-lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold line-through decoration-ink/40">{item.short}</p>
              <p className="tnum text-[13px] text-muted">
                {item.defaults.sets} × {item.defaults.reps}
              </p>
            </div>
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ink text-lime">
              <Check size={17} strokeWidth={3} aria-hidden="true" />
            </span>
          </div>
          <p className="mt-2 rounded-xl bg-well px-3 py-2 text-[13px] leading-snug">1. {item.steps[0]}</p>
        </MiniCard>
      ),
    },
  ];

  return (
    <section id="nece-isleyir" className={`${TILE} grid scroll-mt-4 overflow-hidden lg:grid-cols-3`} aria-labelledby="how-title">
      {fields.map((field, index) => (
        <div key={field.text} className={`group reveal flex flex-col gap-10 p-6 sm:p-7 lg:min-h-[640px] ${field.tone}`} style={{ "--i": index }}>
          <div className={index === 0 ? "min-h-[64px]" : "hidden min-h-[64px] lg:block"}>
            {index === 0 && (
              <h2 id="how-title" className={H2}>
                Necə işləyir
              </h2>
            )}
          </div>
          <div className="flex flex-1 items-center justify-center">{field.card}</div>
          <p className="max-w-[340px] text-[22px] font-semibold leading-[1.2] tracking-[-0.01em] sm:text-[26px]">{field.text}</p>
        </div>
      ))}
    </section>
  );
}

/* ---- Library board: the live thing. Pick a machine, read how to use it. ---- */

function LibraryBoard() {
  const [openId, setOpenId] = useState(BOARD_IDS[3]);
  const rows = BOARD_IDS.map(getEquipment);

  return (
    <section aria-labelledby="board-title">
      <div className="reveal mb-2 flex flex-wrap items-end justify-between gap-4 px-3 pb-4 pt-2">
        <h2 id="board-title" className={H2}>
          Aparatı seç, izahı oxu
        </h2>
        <Link to="/equipment" className="flex items-center gap-1.5 text-[16px] font-medium text-lime hover:underline">
          Bütün kitabxana <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <ul className="space-y-1" data-ui>
        {rows.map((item, index) => {
          const open = item.id === openId;
          return (
            <li key={item.id} className={`reveal ${TILE} overflow-hidden transition-colors duration-300 ${open ? "bg-lime text-ink" : "bg-ink-2 hover:bg-ink-3"}`} style={{ "--i": index }}>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`board-${item.id}`}
                onClick={() => setOpenId(item.id)}
                className="grid h-16 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 text-left sm:h-[72px] sm:px-6 lg:grid-cols-[minmax(0,5fr)_2fr_3fr_auto]"
              >
                <span className="truncate text-[20px] font-semibold tracking-[-0.01em] sm:text-[26px]">{item.short}</span>
                <span className={`hidden truncate text-[16px] lg:block ${open ? "" : "text-white/70"}`}>{item.category}</span>
                <span className={`hidden truncate text-[16px] lg:block ${open ? "" : "text-white/70"}`}>{item.muscles.primary.join(", ")}</span>
                <span className={`w-[104px] rounded-md py-1.5 text-center text-[14px] font-semibold ${open ? "bg-ink text-white" : LEVEL_BLOCK[item.difficulty]}`}>{item.difficulty}</span>
              </button>
              {open && (
                <div id={`board-${item.id}`} className="page-in grid gap-5 px-4 pb-5 sm:px-6 sm:pb-6 md:grid-cols-[260px_minmax(0,1fr)]">
                  <EquipmentImage item={item} className="aspect-[4/3] w-full" rounded="rounded-xl" />
                  <div>
                    <ol className="space-y-2">
                      {item.steps.slice(0, 4).map((step, i) => (
                        <li key={step} className="flex gap-3 text-[16px] leading-snug sm:text-[17px]">
                          <span className="tnum flex h-6 w-6 flex-none items-center justify-center rounded-full bg-ink text-[13px] font-semibold text-lime" aria-hidden="true">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                    <Link to={`/equipment/${item.id}`} className="btn btn-dark mt-4">
                      Tam izaha bax <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ---- Preview strip ---- */

function PreviewStrip() {
  const screens = [
    { to: "/equipment", path: "/equipment", title: "Aparat kitabxanası", label: "Aparat kitabxanası ekranının görüntüsü", node: <Equipment /> },
    { to: "/students", path: "/students", title: "Tələbələr", label: "Tələbələr siyahısı ekranının görüntüsü", node: <Students /> },
    { to: "/schedule", path: "/schedule", title: "Cədvəl", label: "Həftəlik cədvəl ekranının görüntüsü", node: <Schedule /> },
  ];
  return (
    <section aria-labelledby="preview-title">
      <h2 id="preview-title" className={`${H2} reveal px-3 pb-6 pt-2`}>
        Paneldən görüntülər
      </h2>
      <ul className="grid gap-2 md:grid-cols-3">
        {screens.map((screen, index) => (
          <li key={screen.to} className="reveal" style={{ "--i": index }}>
            <Link to={screen.to} className={`${TILE} group block overflow-hidden bg-ink-2`}>
              <ScreenPreview activePath={screen.path} label={screen.label} ratio={0.72} className="max-md:aspect-auto! max-md:h-[300px]">
                {screen.node}
              </ScreenPreview>
              <p className="flex items-center justify-between px-5 py-4 text-[17px] font-semibold">
                {screen.title}
                <ArrowUpRight size={18} className="text-lime transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---- Pricing: the bigger plan is literally bigger ---- */

function Pricing() {
  const tones = ["bg-white text-ink", "bg-lime text-ink"];
  const strips = ["bg-[#dfe5d8] hover:bg-[#d3dbca]", "bg-[#a9d61c] hover:bg-[#9ccb0e]"];
  return (
    <section id="qiymet" className="grid scroll-mt-4 gap-2 md:grid-cols-12 md:items-end" aria-labelledby="pricing-title">
      <div className="flex flex-col gap-2 md:col-span-6">
        <div className="reveal px-3 pb-6 pt-2">
          <h2 id="pricing-title" className={H2}>
            Sadə qiymət
          </h2>
          <p className="mt-4 max-w-[380px] text-[17px] leading-relaxed text-white/80">İki plan, gizli ödəniş yoxdur. Rəqəmlər ilkindir və satışa çıxana qədər dəyişə bilər.</p>
        </div>
        <PlanTile plan={PLANS[0]} tone={tones[0]} strip={strips[0]} index={0} />
      </div>
      <div className="md:col-span-6">
        <PlanTile plan={PLANS[1]} tone={tones[1]} strip={strips[1]} index={1} tall />
      </div>
    </section>
  );
}

function PlanTile({ plan, tone, strip, index, tall = false }) {
  return (
    <article className={`${TILE} reveal flex flex-col overflow-hidden ${tone} ${tall ? "md:min-h-[500px]" : "md:min-h-[400px]"}`} style={{ "--i": index }}>
      <div className="flex-1 p-6 sm:p-7">
        <h3 className="text-[26px] font-bold leading-none">{plan.name}</h3>
        <div className="mt-6 flex items-baseline gap-2.5">
          <p className="font-display tnum text-[clamp(48px,5vw,72px)] leading-none">{plan.price}</p>
          <p className="text-[18px] font-medium">AZN / ay</p>
        </div>
        <p className="mt-2 text-[16px]">{plan.note}</p>
        <ul className="mt-6 space-y-2.5 text-[17px]">
          {plan.lines.map((line) => (
            <li key={line} className="flex gap-2.5">
              <Check size={18} strokeWidth={2.5} className="mt-1 flex-none" aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
      </div>
      <Link to="/dashboard" className={`flex h-16 items-center justify-between px-6 text-[17px] font-semibold transition-colors sm:px-7 ${strip}`}>
        {plan.name} planını demoda sına
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </article>
  );
}

/* ---- Final CTA ---- */

function FinalCta() {
  return (
    <section className="-mx-2 grid grid-cols-2 gap-2 overflow-hidden lg:grid-cols-12" aria-labelledby="cta-title">
      <div className={`reveal relative order-2 h-[120px] overflow-hidden rounded-r-[14px] lg:order-none lg:col-span-2 lg:h-[360px]`}>
        <EquipmentImage item={getEquipment("kettlebell")} rounded="rounded-none" className="absolute inset-0 h-full w-full" alt="Müxtəlif çəkili giryalar" />
      </div>
      <div className={`${TILE} reveal order-1 col-span-2 mx-2 flex items-center justify-between gap-8 bg-lime p-7 text-ink sm:p-10 lg:order-none lg:col-span-8 lg:mx-0 lg:h-[360px]`} style={{ "--i": 1 }}>
        <div className="min-w-0">
          <h2 id="cta-title" className={H2}>
            Öz gözünlə gör
          </h2>
          <p className="mt-4 max-w-[520px] text-[17px] leading-relaxed">Demo hazır məlumatla doludur: 8 tələbə, {equipment.length} aparat, bir həftəlik cədvəl. Kliklə, dəyiş, sına — heç nə xarab olmur.</p>
          <Link to="/dashboard" className="btn btn-dark mt-6 h-12 w-fit px-6 text-[16px]">
            Demonu bax <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <figure className="hidden w-[232px] flex-none rounded-2xl bg-white p-4 md:block" data-ui>
          <QRCodeSVG value={`${window.location.origin}/student-demo`} size={400} level="M" fgColor="#0e120f" className="h-auto w-full" title="Tələbə görünüşü üçün QR kod" />
          <figcaption className="mt-3 text-[14px] font-medium leading-snug">Telefonunla skan et — tələbənin gördüyünü gör.</figcaption>
        </figure>
      </div>
      <div className="reveal order-3 h-[120px] rounded-l-[14px] bg-ink-3 lg:order-none lg:col-span-2 lg:h-[360px]" style={{ "--i": 2 }} aria-hidden="true" />
    </section>
  );
}

/* ---- Footer: the name built from blocks ---- */

function Footer() {
  const letters = "FORMADA".split("");
  const blocks = [
    ["bg-ink-3 text-ink", 78],
    ["bg-lime text-ink", 100],
    ["bg-ink-4 text-ink", 64],
    ["bg-white text-ink", 88],
    ["bg-ink-3 text-ink", 70],
    ["bg-[#8fa58d] text-ink", 94],
    ["bg-lime text-ink", 60],
  ];
  return (
    <footer className="pb-4 pt-2">
      <div className="flex h-[22svh] min-h-[120px] items-end gap-1 lg:h-[34svh]" role="img" aria-label="Formada">
        {letters.map((letter, index) => (
          <span key={index} className={`font-display flex flex-1 items-end justify-center overflow-hidden rounded-[10px] text-[clamp(40px,11vw,170px)] leading-[0.8] ${blocks[index][0]}`} style={{ height: `${blocks[index][1]}%` }}>
            {letter}
          </span>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 px-3 text-[15px] lg:grid-cols-12">
        <nav aria-label="Demo səhifələri" className="lg:col-span-3">
          <h2 className="text-white/60">Müəllim paneli</h2>
          <ul className="mt-3 space-y-2">
            <li><Link to="/dashboard" className="hover:text-lime">İdarə paneli</Link></li>
            <li><Link to="/equipment" className="hover:text-lime">Aparat kitabxanası</Link></li>
            <li><Link to="/students" className="hover:text-lime">Tələbələr</Link></li>
            <li><Link to="/programs" className="hover:text-lime">Proqramlar</Link></li>
            <li><Link to="/schedule" className="hover:text-lime">Cədvəl</Link></li>
          </ul>
        </nav>
        <nav aria-label="Digər keçidlər" className="lg:col-span-3">
          <h2 className="text-white/60">Tələbə və səhifə</h2>
          <ul className="mt-3 space-y-2">
            <li><Link to="/student-demo" className="hover:text-lime">Tələbə görünüşü</Link></li>
            {SECTIONS.map((section) => (
              <li key={section.href}>
                <a href={section.href} className="hover:text-lime">{section.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-span-2 lg:col-span-6">
          <h2 className="text-white/60">Şəkillər haqqında</h2>
          <p className="mt-3 max-w-[520px] leading-relaxed text-white/80">Demodakı aparat şəkilləri açıq lisenziyalı mənbələrdən götürülüb və müəllimin öz zalının şəkilləri ilə əvəz olunacaq.</p>
          <details className="mt-3 max-w-[560px] text-[14px] text-white/70">
            <summary className="cursor-pointer text-white hover:text-lime">Şəkil müəllifləri və lisenziyalar ({credits.length})</summary>
            <ul className="mt-3 space-y-1.5 leading-snug">
              {credits.map((credit) => (
                <li key={credit.file}>
                  <a href={credit.page} target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-2 hover:text-lime">
                    {credit.title}
                  </a>
                  {credit.creator ? ` — ${credit.creator}` : ""}, {credit.license}, {credit.via}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 px-3 text-[14px] text-white/70">
        <p className="flex items-center gap-2.5">
          <LogoMark className="h-4 w-auto text-lime" /> © {new Date().getFullYear()} Formada · Bakı
        </p>
        <Link to="/dashboard" className="btn btn-accent btn-sm">
          Demonu bax
        </Link>
      </div>
    </footer>
  );
}

export default function Landing() {
  const root = useRef(null);
  useReveal(root);
  return (
    <div ref={root} className="on-dark min-h-dvh overflow-x-clip bg-ink text-white">
      <main className="mx-auto flex max-w-[1680px] flex-col gap-[clamp(88px,11vw,168px)] p-2">
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <LibraryBoard />
        <PreviewStrip />
        <Pricing />
        <FinalCta />
      </main>
      <div className="mx-auto mt-[clamp(88px,11vw,168px)] max-w-[1680px] px-2">
        <Footer />
      </div>
    </div>
  );
}
