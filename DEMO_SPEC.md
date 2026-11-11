# Fitness Teacher Platform: Visual Demo Spec

## 1. Goal
Build a **visual, clickable demo** (no backend) of a platform for fitness instructors in Azerbaijan.
The demo is shown to instructors to convince them. It must feel like a real product.

**Core value to show:**
1. Equipment library with real photos and how-to instructions (instructor stops re-explaining machines).
2. Personal workout programs built from that library and sent to students.
3. Student tracking (weight, measurements, attendance).
4. Weekly class schedule.

## 2. Tech Stack
- Vite + React (JSX), React Router
- Tailwind CSS
- Recharts (charts), lucide-react (icons)
- **No Firebase, no API.** All data is local mock data in `/src/data/*.js`. State lives in React state / Context (resets on refresh, fine for demo).
- Mobile-first, fully responsive. Student views must look great on a phone.

## 3. UI Language and Tone
- **All UI text in Azerbaijani.** Code, comments, variable names in English.
- Use correct Azerbaijani letters (ə, ı, ö, ü, ğ, ş, ç).
- Currency: AZN. Date format: DD.MM.YYYY. Week starts Monday.

## 4. Design Direction
- Modern, clean, premium. Not a generic template look.
- Dark hero + light app surface. One strong accent color (e.g. vivid lime `#C6F432` or coral `#FF5A5F`; pick one and use it consistently).
- Font pairing: a bold display font for headings + clean sans for body (Google Fonts).
- Rounded cards, generous spacing, subtle motion (hover, page transitions). No clutter.
- Every screen needs realistic empty/loading-free states (demo always has data).

## 5. Roles and Navigation
Two views, switchable via a "Demo rejimi" toggle in the header (no login needed):
- **Müəllim paneli** (instructor): Dashboard, Aparat kitabxanası, Tələbələr, Proqramlar, Cədvəl.
- **Tələbə görünüşü** (student, phone frame): Bugünkü məşq, Proqramım, Mənim irəliləyişim.

Landing page (`/`) explains the product and has a "Demonu bax" button into the instructor panel.

## 6. Pages and Features

### 6.1 Landing Page `/`
Sections: Hero (headline + CTA + dashboard mockup), Problem (3 pain points: repeating machine explanations, messy WhatsApp/Excel, forgotten schedule), Features (4 cards), "Necə işləyir" (3 steps), Screenshot/preview strip, Pricing teaser (2 plans: Starter, Pro; placeholder numbers), Final CTA, Footer.

### 6.2 Aparat kitabxanası (Equipment Library) `/equipment` — **MOST IMPORTANT PAGE**
- Grid of equipment cards: **real photo**, name (AZ), category badge, target muscles.
- Filters: muscle group (Sinə, Kürək, Ayaq, Qol, Çiyin, Qarın, Kardio), type (Aparat, Sərbəst çəki, Kardio, Bant/Aksesuar). Search box.
- **Detail page/modal** `/equipment/:id`:
  - Large photo (gallery of 1-3 images supported)
  - "Hansı əzələlər işləyir" (primary + secondary, text chips)
  - **"Necə istifadə etməli"**: numbered steps (setup, movement, breathing)
  - **"Tez-tez edilən səhvlər"** list
  - **"Tənzimləmə"**: seat/pad/weight adjustment tips
  - Difficulty (Başlanğıc / Orta / İrəli), suggested sets/reps range
  - Optional video placeholder block ("Video izah tezliklə")
  - Button: **"Proqrama əlavə et"** (adds to program builder draft)
- Also a **"QR kod"** button that shows a mock QR for this machine (idea: instructor sticks QR on machine, student scans and sees instructions).

### 6.3 Tələbələr (Students) `/students`
- List/table: avatar, name, goal (Arıqlama / Kütlə / Forma / Postural düzəliş), current weight, attendance % (last 30 days), payment status badge (Ödənilib / Gecikir), next class.
- Search + filter by goal and payment status.
- **Student detail** `/students/:id` tabs:
  - **Ümumi**: profile, goal, notes, health notes field (e.g. "Bel nahiyəsində həssaslıq"), contact buttons (WhatsApp link mock).
  - **İrəliləyiş**: Recharts line chart for weight over 12 weeks, body measurements table (qol, bel, bud, sinə), before/after photo placeholders.
  - **Davamiyyət**: monthly calendar heatmap (attended / missed / upcoming).
  - **Proqram**: currently assigned program + "Yeni proqram təyin et".
  - **Ödəniş**: monthly payment status list.

### 6.4 Proqramlar (Program Builder) `/programs`
- List of programs/templates (e.g. "Başlanğıc 3 gün", "Glüt fokus 4 həftə", "Bel sağlamlığı").
- **Builder** `/programs/new`:
  - Pick days (Gün 1, Gün 2...). Add exercises from library via searchable picker (shows photo thumbnail).
  - Per exercise: sets, reps, rest, note. Reorder with up/down buttons (drag-drop optional).
  - Assign to one or multiple students.
  - **"Tələbəyə göndər"** button → success toast + shows the student phone preview of the program.
- Templates can be duplicated.

### 6.5 Cədvəl (Schedule) `/schedule`
- Weekly calendar grid (Mon-Sun, hourly slots), class blocks colored by type (Fərdi, Qrup, Online).
- Click block → drawer with students, notes, "Ləğv et / Köçür" buttons (visual only).
- "Yeni dərs əlavə et" modal (student select, day, time, duration, repeat weekly toggle).
- Conflict warning visual when two classes overlap.
- Today highlighted; "Bu gün: 4 dərs" summary at top.

### 6.6 Dashboard `/dashboard`
- KPI cards: Aktiv tələbə, Bu həftə dərs sayı, Orta davamiyyət, Gecikən ödəniş.
- Today's classes list, "Diqqət tələb edənlər" (students who missed 2+ classes or payment late).
- Small chart: weekly attendance trend.

### 6.7 Tələbə görünüşü (Student phone view) `/student-demo`
Rendered inside a centered phone frame on desktop.
- **Bugünkü məşq**: list of today's exercises with photo, sets × reps, checkbox to mark done, tap exercise → same how-to detail as library (shortened).
- **Proqramım**: full program by day.
- **İrəliləyişim**: weight chart + attendance streak.
- Next class card + "Çəkimi yenilə" form (visual only).

## 7. Mock Data (create in `/src/data`)
- `equipment.js`: **at least 14 items** across all categories. Schema:
```js
{
  id: "leg-press",
  name: "Ayaq presi (Leg Press)",
  category: "Aparat",
  muscles: { primary: ["Dördbaşlı bud", "Gluteus"], secondary: ["Arxa bud"] },
  difficulty: "Başlanğıc",
  suggested: "3-4 set × 10-12 təkrar",
  images: ["/equipment/leg-press-1.jpg"],
  steps: ["Oturacağı elə tənzimlə ki...", "..."],
  mistakes: ["Dizləri tam kilidləmə", "..."],
  adjustments: ["Kürək dayağını belinə uyğun sıx", "..."]
}
```
- `students.js`: 8 students, realistic Azerbaijani names, mixed goals, mixed payment/attendance.
- `programs.js`: 4 templates + 2 assigned programs.
- `schedule.js`: ~14 classes across the week.
- `progress.js`: 12-week weight/measurement series per student.
- Write all instructional text in natural Azerbaijani. Keep each step short and practical.

## 8. Images
- Real equipment photos will be dropped into `/public/equipment/` by the owner, named `<id>-1.jpg`, `<id>-2.jpg`.
- Build an `<EquipmentImage>` component with: lazy loading, `object-cover`, rounded corners, and a **graceful fallback** (neutral card with dumbbell icon + machine name) if the file is missing.
- Also include `/public/students/` for avatar photos with initials fallback.
- Generate a `README_IMAGES.md` listing every expected filename so the owner knows what to photograph.

## 9. Suggested Folder Structure
```
src/
  components/ (Layout, Sidebar, Header, Card, Badge, Modal, Drawer, Toast, EquipmentImage, PhoneFrame, charts/)
  pages/ (Landing, Dashboard, Equipment, EquipmentDetail, Students, StudentDetail, Programs, ProgramBuilder, Schedule, StudentDemo)
  data/
  context/ (DemoContext: role toggle, draft program, toasts)
  hooks/
  App.jsx, main.jsx, index.css
public/equipment/, public/students/
```

## 10. Quality Requirements
- Every button and tab must do something visible (open modal, change state, show toast). No dead buttons.
- Responsive at 360px, 768px, 1280px.
- Accessible: semantic HTML, alt texts in Azerbaijani, focus states, sufficient contrast.
- Smooth, consistent spacing and typography scale. No lorem ipsum anywhere.
- Performance: lazy-load images, route-level code splitting.
- Clean, readable code with small reusable components.

## 11. Build Order
1. Project setup, theme tokens, layout, routing, DemoContext.
2. Mock data files + `EquipmentImage` + `README_IMAGES.md`.
3. Equipment library + detail (highest priority, polish this first).
4. Program builder + student phone view.
5. Students + detail + charts.
6. Schedule + Dashboard.
7. Landing page.
8. Final polish pass: transitions, empty states, mobile check.

## 12. Out of Scope (for this demo)
Authentication, real database, payments, notifications, AI features. Mention nothing about these in the UI except as a small "Tezliklə" badge where it supports the pitch (e.g. "AI təhlil — tezliklə").
