import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Copy, Pencil, Plus } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import Tabs from "../components/Tabs.jsx";
import Badge from "../components/Badge.jsx";
import EquipmentImage from "../components/EquipmentImage.jsx";
import { AvatarStack } from "../components/Avatar.jsx";
import { draftExerciseCount, useDemo } from "../context/DemoContext.jsx";
import { getEquipment } from "../data/equipment.js";

const exerciseCount = (program) => program.days.reduce((sum, day) => sum + day.exercises.length, 0);

function ProgramCard({ program, students, onEdit, onDuplicate }) {
  const thumbs = [...new Set(program.days.flatMap((day) => day.exercises.map((exercise) => exercise.equipmentId)))].slice(0, 5).map(getEquipment);
  const assigned = students.filter((student) => program.studentIds.includes(student.id));

  return (
    <li className="card flex flex-col p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[17px] font-semibold leading-snug">{program.name}</h2>
        <Badge>{program.level}</Badge>
      </div>
      <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{program.description}</p>

      <div className="mt-4 flex gap-1.5">
        {thumbs.map((item) => (
          <EquipmentImage key={item.id} item={item} showName={false} className="h-12 w-12 flex-none" rounded="rounded-lg" alt={item.short} />
        ))}
      </div>

      <p className="tnum mt-3 text-[13px] text-muted">
        {program.days.length} gün · {exerciseCount(program)} hərəkət · {program.weeks} həftə
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <div className="flex min-h-7 items-center gap-2 text-[13px] text-muted">
          {assigned.length ? (
            <>
              <AvatarStack students={assigned} />
              <span>{assigned.length} tələbə</span>
            </>
          ) : (
            <span>Hələ heç kimə təyin edilməyib</span>
          )}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => onDuplicate(program)} className="btn btn-ghost btn-sm">
            <Copy size={14} aria-hidden="true" /> Surətini çıxar
          </button>
          <button type="button" onClick={() => onEdit(program)} className="btn btn-dark btn-sm">
            <Pencil size={14} aria-hidden="true" /> Aç
          </button>
        </div>
      </div>
    </li>
  );
}

export default function Programs() {
  const { programs, students, draft, loadDraft, resetDraft, duplicateProgram, toast } = useDemo();
  const navigate = useNavigate();
  const [tab, setTab] = useState("templates");

  const templates = programs.filter((program) => program.isTemplate);
  const personal = programs.filter((program) => !program.isTemplate);
  const list = tab === "templates" ? templates : personal;
  const draftCount = draftExerciseCount(draft);
  const hasFreshDraft = draftCount > 0 && !draft.sourceId;

  const startNew = () => {
    if (!hasFreshDraft) resetDraft();
    navigate("/programs/new");
  };
  const edit = (program) => {
    loadDraft(program);
    navigate("/programs/new");
  };
  const duplicate = (program) => {
    duplicateProgram(program.id);
    toast(`"${program.name}" proqramının surəti yaradıldı`);
  };

  return (
    <>
      <PageHeader title="Proqramlar" subtitle={`${templates.length} şablon · ${personal.length} fərdi proqram`}>
        <button type="button" onClick={startNew} className="btn btn-accent">
          <Plus size={17} strokeWidth={2.5} aria-hidden="true" /> Yeni proqram
        </button>
      </PageHeader>

      {hasFreshDraft && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[14px] bg-lime-soft px-4 py-3">
          <p className="text-[14px]">
            <span className="font-semibold">Yarımçıq qaralama var:</span> {draft.name || "Adsız proqram"}, {draftCount} hərəkət.
          </p>
          <Link to="/programs/new" className="btn btn-dark btn-sm">
            Davam et
          </Link>
        </div>
      )}

      <Tabs
        label="Proqram növləri"
        value={tab}
        onChange={setTab}
        className="mb-5"
        tabs={[
          { id: "templates", label: "Şablonlar", count: templates.length },
          { id: "personal", label: "Fərdi proqramlar", count: personal.length },
        ]}
      />

      <ul className="grid gap-4 lg:grid-cols-2">
        {list.map((program) => (
          <ProgramCard key={program.id} program={program} students={students} onEdit={edit} onDuplicate={duplicate} />
        ))}
      </ul>
    </>
  );
}
