// Weekly classes. `day` is 0 (Monday) to 6 (Sunday), `start` is "HH:MM",
// `duration` is in minutes. Thursday 18:00 and 18:30 overlap on purpose so the
// conflict warning can be shown.

export const CLASS_TYPES = ["Fərdi", "Qrup", "Online"];
export const DAY_NAMES = ["Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə", "Bazar"];
export const DAY_SHORT = ["B.e.", "Ç.a.", "Ç.", "C.a.", "C.", "Ş.", "B."];

export const schedule = [
  { id: "c1", day: 0, start: "08:00", duration: 60, type: "Fərdi", title: "Aysel — ayaq günü", studentIds: ["aysel"], note: "Diz üçün isinməni uzat." },
  { id: "c2", day: 0, start: "10:00", duration: 60, type: "Fərdi", title: "Leyla — bel sağlamlığı", studentIds: ["leyla"], note: "Hiperekstenziyada amplitudanı yarıya endir." },
  { id: "c3", day: 0, start: "18:00", duration: 60, type: "Qrup", title: "Axşam qrupu — bütün bədən", studentIds: ["nigar", "gunel", "kamran"], note: "Dairəvi məşq, 3 dövrə." },
  { id: "c4", day: 0, start: "19:30", duration: 60, type: "Fərdi", title: "Tural — sinə və triseps", studentIds: ["tural"], note: "Ştanq presində 82,5 kq sınaq." },
  { id: "c5", day: 1, start: "09:00", duration: 60, type: "Fərdi", title: "Rəşad — kürək və biseps", studentIds: ["resad"], note: "" },
  { id: "c6", day: 1, start: "19:00", duration: 45, type: "Online", title: "Elvin — evdə kardio", studentIds: ["elvin"], note: "Nəbzi 150-dən yuxarı qaldırma." },
  { id: "c7", day: 2, start: "08:00", duration: 60, type: "Fərdi", title: "Aysel — yuxarı bədən", studentIds: ["aysel"], note: "" },
  { id: "c8", day: 2, start: "18:00", duration: 60, type: "Qrup", title: "Axşam qrupu — glüt və qarın", studentIds: ["nigar", "gunel", "kamran"], note: "Bantları gətirməyi unutma." },
  { id: "c9", day: 2, start: "19:30", duration: 60, type: "Fərdi", title: "Tural — ayaq günü", studentIds: ["tural"], note: "" },
  { id: "c10", day: 3, start: "09:00", duration: 60, type: "Fərdi", title: "Rəşad — sinə və çiyin", studentIds: ["resad"], note: "" },
  { id: "c11", day: 3, start: "18:00", duration: 60, type: "Fərdi", title: "Leyla — postura", studentIds: ["leyla"], note: "Bant məşqlərini evə tapşır." },
  { id: "c12", day: 3, start: "18:30", duration: 45, type: "Online", title: "Elvin — güc məşqi", studentIds: ["elvin"], note: "Vaxtı Leyla ilə üst-üstə düşür, köçürmək lazımdır." },
  { id: "c13", day: 4, start: "08:00", duration: 60, type: "Fərdi", title: "Aysel — kardio və qarın", studentIds: ["aysel"], note: "" },
  { id: "c14", day: 4, start: "18:00", duration: 60, type: "Qrup", title: "Axşam qrupu — güc", studentIds: ["nigar", "gunel", "kamran"], note: "" },
  { id: "c15", day: 5, start: "11:00", duration: 60, type: "Fərdi", title: "Rəşad — ayaq günü", studentIds: ["resad"], note: "" },
  { id: "c16", day: 5, start: "12:30", duration: 60, type: "Fərdi", title: "Tural — kürək və çiyin", studentIds: ["tural"], note: "Sol çiyinə diqqət." },
  { id: "c17", day: 6, start: "11:00", duration: 45, type: "Online", title: "Elvin — həftəlik yoxlama", studentIds: ["elvin"], note: "Çəki və qidalanma hesabatı." },
];
