# Formada — fitnes müəllimləri üçün platforma (vizual demo)

Backend yoxdur: bütün məlumat `src/data/*.js` fayllarındadır, vəziyyət React Context-də saxlanılır və səhifə yenilənəndə sıfırlanır.

## İşə salmaq

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ qovluğuna yığır
npm run preview  # yığılmış versiyaya baxmaq
```

Telefonda göstərmək üçün: `npm run dev -- --host` və terminalda çıxan şəbəkə ünvanını aç. QR kodlar da həmin ünvanı göstərəcək.

## Səhifələr

| Ünvan | Səhifə |
| --- | --- |
| `/` | Tanıtım səhifəsi |
| `/dashboard` | İdarə paneli |
| `/equipment`, `/equipment/:id` | Aparat kitabxanası və aparatın izahı |
| `/students`, `/students/:id` | Tələbələr və tələbə səhifəsi |
| `/programs`, `/programs/new` | Proqramlar və proqram qurucusu |
| `/schedule` | Həftəlik cədvəl |
| `/student-demo` | Tələbə görünüşü (telefon çərçivəsində) |

## Nəyi harada dəyişməli

- Aparatlar və izahlar: `src/data/equipment.js`
- Tələbələr, çəki və ölçülər: `src/data/students.js`, `src/data/progress.js`
- Proqram şablonları: `src/data/programs.js`
- Dərslər: `src/data/schedule.js`
- Rənglər və şriftlər: `src/index.css` (`@theme` bloku)
- Şəkillər: bax `README_IMAGES.md`

Davamiyyət faizi, borc, növbəti dərs və KPI rəqəmləri əl ilə yazılmayıb — `src/data/selectors.js` onları yuxarıdakı fayllardan hesablayır.

## Satışdan əvvəl dəqiqləşdirilməli nümunə məlumatlar

- Məhsulun adı "Formada" və loqo
- Müəllimin adı (`src/components/Header.jsx`, "Fuad Rzayev")
- Qiymətlər: Starter 29 AZN, Pro 59 AZN (`src/pages/Landing.jsx`)
- Tələbə adları, telefon nömrələri və ödəniş məbləğləri
