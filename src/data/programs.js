// Four reusable templates and two programs written for specific students.
// Each exercise points at an equipment id; rest is in seconds.

const ex = (equipmentId, sets, reps, rest, note = "") => ({ equipmentId, sets, reps, rest, note });

export const programs = [
  {
    id: "beginner-3",
    name: "Başlanğıc 3 gün",
    description: "Zala yeni gələnlər üçün bütün bədən proqramı. Yalnız aparatlar, sadə texnika.",
    level: "Başlanğıc",
    weeks: 6,
    isTemplate: true,
    studentIds: ["elvin", "gunel"],
    days: [
      { name: "Gün 1", exercises: [ex("treadmill", 1, "10 dəq", 0, "İsinmə, sürətli yeriş"), ex("leg-press", 3, "12", 90), ex("chest-press", 3, "12", 75), ex("lat-pulldown", 3, "12", 75), ex("medicine-ball", 2, "12", 45)] },
      { name: "Gün 2", exercises: [ex("rowing-machine", 3, "500 m", 60, "Rahat templə"), ex("leg-extension", 3, "15", 60), ex("seated-row", 3, "12", 75), ex("shoulder-press-machine", 3, "10", 90), ex("resistance-band", 2, "15", 45)] },
      { name: "Gün 3", exercises: [ex("treadmill", 1, "10 dəq", 0, "İsinmə"), ex("leg-press", 3, "12", 90), ex("dumbbells", 3, "12", 60, "Biseps bükmə"), ex("hyperextension", 3, "12", 60), ex("medicine-ball", 3, "12", 45)] },
    ],
  },
  {
    id: "glute-focus",
    name: "Glüt fokus 4 həftə",
    description: "Həftədə 3 gün, vurğu ombada və arxa budda. Hər həftə çəkini 2,5 kq artır.",
    level: "Orta",
    weeks: 4,
    isTemplate: true,
    studentIds: ["nigar"],
    days: [
      { name: "Gün 1", exercises: [ex("smith-machine", 4, "10", 120, "Ayaqlar irəlidə"), ex("leg-press", 4, "12", 90, "Ayaqlar platformanın yuxarısında"), ex("hyperextension", 3, "15", 60, "Ombanı yuxarıda sıx"), ex("resistance-band", 3, "20", 45, "Yan addımlar")] },
      { name: "Gün 2", exercises: [ex("kettlebell", 4, "15", 60, "Yelləmə"), ex("cable-crossover", 3, "15", 60, "Aşağı blokdan ayağı arxaya aparma"), ex("leg-extension", 3, "15", 60), ex("medicine-ball", 3, "16", 45)] },
      { name: "Gün 3", exercises: [ex("leg-press", 4, "15", 90, "Tək ayaqla"), ex("smith-machine", 3, "12", 90, "Geri addım"), ex("kettlebell", 3, "12", 60), ex("treadmill", 1, "15 dəq", 0, "6% maillik, sürətli yeriş")] },
    ],
  },
  {
    id: "back-health",
    name: "Bel sağlamlığı",
    description: "Oturaq iş rejimi üçün. Bel və kürəyi gücləndirir, onurğaya ox yükü vermir.",
    level: "Başlanğıc",
    weeks: 8,
    isTemplate: true,
    studentIds: ["leyla", "kamran"],
    days: [
      { name: "Gün 1", exercises: [ex("rowing-machine", 2, "500 m", 60, "Yüngül müqavimət"), ex("hyperextension", 3, "12", 60, "Yarım amplituda"), ex("seated-row", 3, "12", 75), ex("resistance-band", 3, "15", 45, "Bantı yanlara dartma")] },
      { name: "Gün 2", exercises: [ex("treadmill", 1, "12 dəq", 0, "Mailli yeriş"), ex("lat-pulldown", 3, "12", 75, "Yüngül çəki, tam nəzarət"), ex("leg-press", 3, "12", 90, "Beli dayaqdan ayırma"), ex("medicine-ball", 2, "12", 45, "Dabanlar yerdə")] },
    ],
  },
  {
    id: "fat-burn-circuit",
    name: "Yağ yandırma dövrəsi",
    description: "Həftədə 2 gün dairəvi məşq. Hərəkətlər arasında fasilə qısa, dövrələr arasında 2 dəqiqə.",
    level: "Orta",
    weeks: 6,
    isTemplate: true,
    studentIds: [],
    days: [
      { name: "Gün 1", exercises: [ex("rowing-machine", 4, "250 m", 30), ex("kettlebell", 4, "15", 30), ex("chest-press", 4, "12", 30), ex("medicine-ball", 4, "16", 30), ex("treadmill", 1, "10 dəq", 0, "Soyuma")] },
      { name: "Gün 2", exercises: [ex("treadmill", 6, "1 dəq sürətli", 60, "İnterval"), ex("leg-press", 3, "15", 45), ex("seated-row", 3, "15", 45), ex("dumbbells", 3, "15", 45, "Çiyin presi")] },
    ],
  },
  {
    id: "aysel-fat-loss",
    name: "Aysel — arıqlama, 2-ci mərhələ",
    description: "Həftədə 3 gün. Diz zədəsinə görə dərin çömbəlmə yoxdur.",
    level: "Orta",
    weeks: 6,
    isTemplate: false,
    studentIds: ["aysel"],
    days: [
      { name: "Gün 1", exercises: [ex("treadmill", 1, "8 dəq", 0, "İsinmə, 5 km/saat"), ex("leg-press", 4, "12", 90, "Dizi 90°-dən çox bükmə"), ex("hyperextension", 3, "15", 60), ex("leg-extension", 3, "15", 60, "Yüngül çəki"), ex("medicine-ball", 3, "16", 45)] },
      { name: "Gün 2", exercises: [ex("rowing-machine", 3, "500 m", 60), ex("lat-pulldown", 3, "12", 75), ex("chest-press", 3, "12", 75), ex("seated-row", 3, "12", 75), ex("dumbbells", 3, "12", 60, "Yanlara qaldırma, 4 kq")] },
      { name: "Gün 3", exercises: [ex("treadmill", 1, "25 dəq", 0, "5% maillik, sürətli yeriş"), ex("kettlebell", 3, "15", 60, "8 kq"), ex("resistance-band", 3, "20", 45), ex("medicine-ball", 3, "16", 45)] },
    ],
  },
  {
    id: "resad-mass",
    name: "Kütlə — 4 günlük bölgü",
    description: "Rəşad və Tural üçün. Əsas hərəkətlərdə 6-10 təkrar, hər həftə irəliləyiş.",
    level: "İrəli",
    weeks: 8,
    isTemplate: false,
    studentIds: ["resad", "tural"],
    days: [
      { name: "Gün 1", exercises: [ex("barbell-bench", 4, "6-8", 120, "Sığorta ilə"), ex("chest-press", 3, "10", 90), ex("cable-crossover", 3, "12", 60), ex("dumbbells", 3, "12", 60, "Triseps üçün başüstü açma")] },
      { name: "Gün 2", exercises: [ex("lat-pulldown", 4, "8-10", 90), ex("seated-row", 4, "10", 90), ex("hyperextension", 3, "12", 60, "10 kq disklə"), ex("dumbbells", 4, "10", 60, "Biseps bükmə")] },
      { name: "Gün 3", exercises: [ex("smith-machine", 4, "8", 120, "Çömbəlmə"), ex("leg-press", 4, "10", 120), ex("leg-extension", 3, "12", 60), ex("kettlebell", 3, "15", 60)] },
      { name: "Gün 4", exercises: [ex("shoulder-press-machine", 4, "8-10", 90), ex("dumbbells", 4, "12", 60, "Yanlara qaldırma"), ex("resistance-band", 3, "15", 45, "Arxa çiyin"), ex("rowing-machine", 3, "500 m", 60)] },
    ],
  },
];
