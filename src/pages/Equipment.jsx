import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Plus, Search, X } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import EquipmentImage from "../components/EquipmentImage.jsx";
import Badge, { difficultyTone } from "../components/Badge.jsx";
import { Segmented } from "../components/Tabs.jsx";
import { draftExerciseCount, useDemo } from "../context/DemoContext.jsx";
import { useHeading } from "../context/PreviewContext.jsx";
import { CATEGORIES, MUSCLE_GROUPS, equipment } from "../data/equipment.js";

const ALL = "Hamısı";
const normalize = (text) => text.toLocaleLowerCase("az");

function EquipmentCard({ item, inDraft, onAdd }) {
  const Title = useHeading("h2");
  return (
    <li className="group relative">
      <Link to={`/equipment/${item.id}`} className="block rounded-[14px]">
        <div className="overflow-hidden rounded-[14px]">
          <EquipmentImage item={item} rounded="rounded-[14px]" className="aspect-[4/3] w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
        </div>
        <div className="px-0.5 pt-2.5">
          <Title className="text-[15px] font-semibold leading-snug">{item.name}</Title>
          <p className="mt-0.5 line-clamp-1 text-[13px] text-muted">{[...item.muscles.primary, ...item.muscles.secondary].join(", ")}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge>{item.category}</Badge>
            <Badge tone={difficultyTone(item.difficulty)}>{item.difficulty}</Badge>
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => onAdd(item)}
        aria-label={`${item.short} — proqrama əlavə et`}
        title="Proqrama əlavə et"
        className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full shadow-[0_2px_8px_rgba(14,18,15,0.25)] transition-transform active:scale-90 ${
          inDraft ? "bg-ink text-lime" : "bg-lime text-ink hover:scale-105"
        }`}
      >
        {inDraft ? <Check size={17} strokeWidth={2.5} aria-hidden="true" /> : <Plus size={18} strokeWidth={2.5} aria-hidden="true" />}
      </button>
    </li>
  );
}

export default function Equipment() {
  const { draft, addToDraft, toast } = useDemo();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState(ALL);
  const [category, setCategory] = useState(ALL);

  const draftIds = useMemo(() => new Set(draft.days.flatMap((day) => day.exercises.map((exercise) => exercise.equipmentId))), [draft]);
  const draftCount = draftExerciseCount(draft);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return equipment.filter((item) => {
      if (group !== ALL && !item.groups.includes(group)) return false;
      if (category !== ALL && item.category !== category) return false;
      if (!q) return true;
      const haystack = normalize([item.name, item.category, ...item.groups, ...item.muscles.primary, ...item.muscles.secondary].join(" "));
      return haystack.includes(q);
    });
  }, [query, group, category]);

  const filtered = query || group !== ALL || category !== ALL;
  const reset = () => {
    setQuery("");
    setGroup(ALL);
    setCategory(ALL);
  };

  const handleAdd = (item) => {
    addToDraft(item.id);
    toast(`${item.short} proqram qaralamasına əlavə edildi`, { action: { label: "Qaralamaya bax", to: "/programs/new" } });
  };

  return (
    <>
      <PageHeader title="Aparat kitabxanası" subtitle={`${equipment.length} aparat və ləvazimat — hər birinin şəkli və istifadə qaydası ilə`}>
        <Link to="/programs/new" className={`btn ${draftCount ? "btn-accent" : "btn-ghost"}`}>
          {draftCount ? `Qaralama: ${draftCount} hərəkət` : "Proqram qur"}
        </Link>
      </PageHeader>

      <div className="space-y-3">
        <div className="relative max-w-[420px]">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Aparat və ya əzələ axtar"
            aria-label="Aparat və ya əzələ axtar"
            className="field pl-9"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="w-[52px] flex-none text-[13px] text-muted">Əzələ</span>
          <Segmented label="Əzələ qrupu" options={[ALL, ...MUSCLE_GROUPS]} value={group} onChange={setGroup} className="-mr-4 min-w-0 flex-1 pr-4 sm:mr-0 sm:pr-0" />
        </div>
        <div className="flex items-center gap-3">
          <span className="w-[52px] flex-none text-[13px] text-muted">Növ</span>
          <Segmented label="Aparatın növü" options={[ALL, ...CATEGORIES]} value={category} onChange={setCategory} className="-mr-4 min-w-0 flex-1 pr-4 sm:mr-0 sm:pr-0" />
        </div>
      </div>

      <div className="mb-3 mt-5 flex min-h-8 items-center justify-between gap-3">
        <p className="tnum text-[14px] text-muted" aria-live="polite">
          {results.length} nəticə
        </p>
        {filtered && (
          <button type="button" onClick={reset} className="btn btn-ghost btn-sm">
            <X size={14} aria-hidden="true" /> Filtrləri sıfırla
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 xl:grid-cols-4">
          {results.map((item) => (
            <EquipmentCard key={item.id} item={item} inDraft={draftIds.has(item.id)} onAdd={handleAdd} />
          ))}
        </ul>
      ) : (
        <div className="rounded-[14px] bg-well px-5 py-12 text-center">
          <p className="text-[16px] font-semibold">Bu filtrlərə uyğun aparat tapılmadı</p>
          <p className="mt-1 text-[14px] text-muted">Axtarış sözünü qısalt və ya başqa əzələ qrupu seç.</p>
          <button type="button" onClick={reset} className="btn btn-dark mt-4">
            Bütün aparatları göstər
          </button>
        </div>
      )}
    </>
  );
}
