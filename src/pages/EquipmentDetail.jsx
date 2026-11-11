import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Play, Plus, Printer, QrCode } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import EquipmentImage from "../components/EquipmentImage.jsx";
import ExerciseGuide, { MuscleChips } from "../components/ExerciseGuide.jsx";
import Badge, { difficultyTone } from "../components/Badge.jsx";
import Modal from "../components/Modal.jsx";
import { LogoMark } from "../components/Logo.jsx";
import { useDemo } from "../context/DemoContext.jsx";
import { DIFFICULTIES, equipment, getEquipment } from "../data/equipment.js";

function Gallery({ item }) {
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [item.id]);
  return (
    <div>
      <EquipmentImage item={item} index={index} eager rounded="rounded-[16px]" className="aspect-[4/3] w-full" />
      {item.images.length > 1 && (
        <div className="mt-2.5 flex gap-2.5" role="group" aria-label="Şəkil qalereyası">
          {item.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}-ci şəkil`}
              aria-pressed={i === index}
              className={`rounded-xl transition-opacity ${i === index ? "ring-2 ring-ink ring-offset-2" : "opacity-70 hover:opacity-100"}`}
            >
              <EquipmentImage item={item} index={i} showName={false} className="h-16 w-[88px]" alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DifficultyMeter({ value }) {
  const level = DIFFICULTIES.indexOf(value) + 1;
  return (
    <span className="flex gap-1" aria-hidden="true">
      {DIFFICULTIES.map((name, index) => (
        <span key={name} className={`h-1.5 w-6 rounded-full ${index < level ? "bg-ink" : "bg-active"}`} />
      ))}
    </span>
  );
}

export default function EquipmentDetail() {
  const { id } = useParams();
  const item = getEquipment(id);
  const { addToDraft, toast } = useDemo();
  const [qrOpen, setQrOpen] = useState(false);

  if (!item) return <Navigate to="/equipment" replace />;

  const url = `${window.location.origin}/equipment/${item.id}`;
  const related = equipment.filter((other) => other.id !== item.id && other.groups.includes(item.groups[0])).slice(0, 3);

  const handleAdd = () => {
    addToDraft(item.id);
    toast(`${item.short} proqram qaralamasına əlavə edildi`, { action: { label: "Qaralamaya bax", to: "/programs/new" } });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast("Link kopyalandı");
    } catch {
      toast("Linki kopyalamaq alınmadı, ünvan sətrindən götür", { tone: "warn" });
    }
  };

  return (
    <>
      <PageHeader title={item.name} back={{ to: "/equipment", label: "Aparat kitabxanası" }} />

      <div className="grid gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="lg:col-start-1 lg:row-start-1">
          <Gallery item={item} />
        </div>

        <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="space-y-5 lg:sticky lg:top-[68px]">
            <div className="flex flex-wrap gap-1.5">
              <Badge>{item.category}</Badge>
              {item.groups.map((group) => (
                <Badge key={group}>{group}</Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={handleAdd} className="btn btn-accent h-11 flex-1">
                <Plus size={17} strokeWidth={2.5} aria-hidden="true" /> Proqrama əlavə et
              </button>
              <button type="button" onClick={() => setQrOpen(true)} className="btn btn-ghost h-11">
                <QrCode size={17} aria-hidden="true" /> QR kod
              </button>
            </div>

            <section aria-labelledby="muscles-title">
              <h2 id="muscles-title" className="text-[15px] font-semibold">
                Hansı əzələlər işləyir
              </h2>
              <MuscleChips muscles={item.muscles} className="mt-2.5" />
              <p className="mt-2 flex items-center gap-3 text-[13px] text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-lime" aria-hidden="true" /> Əsas
                </span>
                {item.muscles.secondary.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-active" aria-hidden="true" /> Köməkçi
                  </span>
                )}
              </p>
            </section>

            <dl className="divide-y divide-line rounded-[14px] border border-line">
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <dt className="text-[14px] text-muted">Çətinlik</dt>
                <dd className="flex items-center gap-2.5 text-[14px] font-medium">
                  <DifficultyMeter value={item.difficulty} />
                  <Badge tone={difficultyTone(item.difficulty)}>{item.difficulty}</Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <dt className="text-[14px] text-muted">Tövsiyə</dt>
                <dd className="tnum text-right text-[14px] font-medium">{item.suggested}</dd>
              </div>
            </dl>

            <div className="on-dark flex aspect-video flex-col items-center justify-center gap-2 rounded-[14px] bg-ink text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                <Play size={18} className="translate-x-px" aria-hidden="true" />
              </span>
              <p className="text-[14px] font-medium">Video izah tezliklə</p>
            </div>
          </div>
        </aside>

        <div className="lg:col-start-1 lg:row-start-2">
          <ExerciseGuide item={item} />

          {related.length > 0 && (
            <section className="mt-10" aria-labelledby="related-title">
              <h2 id="related-title" className="text-[17px] font-semibold">
                Eyni əzələ qrupu üçün
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                {related.map((other) => (
                  <li key={other.id}>
                    <Link to={`/equipment/${other.id}`} className="flex items-center gap-3 rounded-xl bg-well p-2 transition-colors hover:bg-active">
                      <EquipmentImage item={other} showName={false} className="h-12 w-12 flex-none" rounded="rounded-lg" />
                      <span className="min-w-0 text-[14px] font-medium leading-tight">{other.short}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <Modal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        title="Aparat üçün QR kod"
        description="Çap et, aparatın üstünə yapışdır. Tələbə telefonu ilə skan edir və bu izahı görür."
        size="sm"
        footer={
          <>
            <button type="button" onClick={copyLink} className="btn btn-ghost flex-1">
              <Copy size={15} aria-hidden="true" /> Linki kopyala
            </button>
            <button
              type="button"
              onClick={() => {
                setQrOpen(false);
                toast(`${item.short} üçün stiker çapa göndərildi (demo)`);
              }}
              className="btn btn-dark flex-1"
            >
              <Printer size={15} aria-hidden="true" /> Çap et
            </button>
          </>
        }
      >
        <div className="rounded-[18px] bg-lime p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[16px] font-semibold leading-tight">{item.short}</p>
            <LogoMark className="h-4 w-auto flex-none" />
          </div>
          <div className="mt-3 rounded-xl bg-white p-4">
            <QRCodeSVG value={url} size={512} level="M" fgColor="#0e120f" className="h-auto w-full" title={`${item.short} — QR kod`} />
          </div>
          <p className="mt-3 text-[14px] font-medium">Skan et — necə istifadə etməli, 1 dəqiqəyə öyrən.</p>
        </div>
      </Modal>
    </>
  );
}
