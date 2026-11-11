# Şəkillər üçün bələdçi

Demo şəkilləri `public/` qovluğundan oxuyur. Fayl yoxdursa, sayt xəta vermir:
aparat üçün hantel ikonu və aparatın adı, tələbə üçün ad-soyadın baş hərfləri göstərilir.

## Necə çəkməli

- Format: **JPG**, üfüqi (4:3), ən azı 1200 px en. Fayl 500 KB-dan böyük olmasın.
- Aparat bütöv görünsün, arxa fon sakit olsun, işıq yandan düşsün.
- 1-ci şəkil: aparatın ümumi görünüşü. 2-ci şəkil (istəyə görə): tənzimləmə yeri və ya hərəkətin başlanğıc mövqeyi.
- Faylın adı aşağıdakı cədvəldəki kimi olmalıdır (kiçik hərflə, boşluqsuz).
- 3-cü şəkil əlavə etmək üçün faylı `<id>-3.jpg` adlandır və `src/data/equipment.js` faylında həmin aparatın `images` siyahısına yaz.

## Aparatlar — `public/equipment/`

"Hazırda" sütunu: **demo şəkli** = açıq lisenziyalı müvəqqəti şəkil var (öz şəklinlə əvəz et), **yoxdur** = fayl hələ yoxdur.

| Aparat | Fayl | Hazırda |
| --- | --- | --- |
| Ayaq presi (Leg Press) | `leg-press-1.jpg` | demo şəkli |
| Ayaq presi (Leg Press) | `leg-press-2.jpg` | demo şəkli |
| Yuxarıdan dartma (Lat Pulldown) | `lat-pulldown-1.jpg` | demo şəkli |
| Yuxarıdan dartma (Lat Pulldown) | `lat-pulldown-2.jpg` | demo şəkli |
| Sinə presi aparatı (Chest Press) | `chest-press-1.jpg` | demo şəkli |
| Sinə presi aparatı (Chest Press) | `chest-press-2.jpg` | yoxdur (istəyə görə) |
| Oturaraq dartma (Seated Row) | `seated-row-1.jpg` | demo şəkli |
| Oturaraq dartma (Seated Row) | `seated-row-2.jpg` | yoxdur (istəyə görə) |
| Diz açma aparatı (Leg Extension) | `leg-extension-1.jpg` | **yoxdur** |
| Diz açma aparatı (Leg Extension) | `leg-extension-2.jpg` | yoxdur (istəyə görə) |
| Çiyin presi aparatı (Shoulder Press) | `shoulder-press-machine-1.jpg` | demo şəkli |
| Çiyin presi aparatı (Shoulder Press) | `shoulder-press-machine-2.jpg` | yoxdur (istəyə görə) |
| Krossover (Cable Crossover) | `cable-crossover-1.jpg` | demo şəkli |
| Krossover (Cable Crossover) | `cable-crossover-2.jpg` | demo şəkli |
| Smit aparatı (Smith Machine) | `smith-machine-1.jpg` | demo şəkli |
| Smit aparatı (Smith Machine) | `smith-machine-2.jpg` | yoxdur (istəyə görə) |
| Hiperekstenziya skamyası | `hyperextension-1.jpg` | demo şəkli |
| Hiperekstenziya skamyası | `hyperextension-2.jpg` | yoxdur (istəyə görə) |
| Hantellər (Dumbbells) | `dumbbells-1.jpg` | demo şəkli |
| Hantellər (Dumbbells) | `dumbbells-2.jpg` | yoxdur (istəyə görə) |
| Ştanqla sinə presi (Bench Press) | `barbell-bench-1.jpg` | demo şəkli |
| Ştanqla sinə presi (Bench Press) | `barbell-bench-2.jpg` | yoxdur (istəyə görə) |
| Girya (Kettlebell) | `kettlebell-1.jpg` | demo şəkli |
| Girya (Kettlebell) | `kettlebell-2.jpg` | yoxdur (istəyə görə) |
| Qaçış zolağı (Treadmill) | `treadmill-1.jpg` | demo şəkli |
| Qaçış zolağı (Treadmill) | `treadmill-2.jpg` | demo şəkli |
| Avarçəkmə trenajoru (Rowing) | `rowing-machine-1.jpg` | demo şəkli |
| Avarçəkmə trenajoru (Rowing) | `rowing-machine-2.jpg` | yoxdur (istəyə görə) |
| Rezin bant (Resistance Band) | `resistance-band-1.jpg` | demo şəkli |
| Rezin bant (Resistance Band) | `resistance-band-2.jpg` | yoxdur (istəyə görə) |
| Tibb topu (Medicine Ball) | `medicine-ball-1.jpg` | demo şəkli |
| Tibb topu (Medicine Ball) | `medicine-ball-2.jpg` | yoxdur (istəyə görə) |

## Tələbələr — `public/students/`

Kvadrat şəkil, ən azı 200 × 200 px. Hamısı istəyə görədir.

| Tələbə | Fayl | Hazırda |
| --- | --- | --- |
| Aysel Məmmədova | `aysel.jpg` | yoxdur (baş hərflər göstərilir) |
| Rəşad Əliyev | `resad.jpg` | yoxdur (baş hərflər göstərilir) |
| Nigar Hüseynova | `nigar.jpg` | yoxdur (baş hərflər göstərilir) |
| Tural Quliyev | `tural.jpg` | yoxdur (baş hərflər göstərilir) |
| Leyla Kərimova | `leyla.jpg` | yoxdur (baş hərflər göstərilir) |
| Elvin Babayev | `elvin.jpg` | yoxdur (baş hərflər göstərilir) |
| Günel İsmayılova | `gunel.jpg` | yoxdur (baş hərflər göstərilir) |
| Kamran Həsənov | `kamran.jpg` | yoxdur (baş hərflər göstərilir) |

## Müvəqqəti demo şəkillərinin mənbələri

Bu şəkillər açıq lisenziya ilə götürülüb və saytın aşağı hissəsində müəllifləri göstərilir.
Öz şəklini eyni adla üstünə yazanda uyğun sətri `src/data/imageCredits.json` faylından sil.

| Fayl | Ad | Müəllif | Lisenziya | Mənbə |
| --- | --- | --- | --- | --- |
| `leg-press-1.jpg` | Gym Leg Press Machine | Aliva Sahoo | CC BY-SA 4.0 | https://commons.wikimedia.org/w/index.php?curid=179972404 |
| `leg-press-2.jpg` | Young man using a leg press machine at the gym | Nenad Stojkovic | CC BY 2.0 | https://commons.wikimedia.org/w/index.php?curid=116285536 |
| `lat-pulldown-1.jpg` | Lat pulldown machine 20180112 | Santeri Viinamäki | CC BY-SA 4.0 | https://commons.wikimedia.org/w/index.php?curid=65498355 |
| `lat-pulldown-2.jpg` | Diverging Lat Pulldown Machine | Teddyhtsai | CC0 | https://commons.wikimedia.org/w/index.php?curid=154006601 |
| `chest-press-1.jpg` | Girl doing chest press machine exercise | Tyler Read | CC BY 2.0 | https://commons.wikimedia.org/w/index.php?curid=141589584 |
| `seated-row-1.jpg` | Marian-Rows | Abooyeah | CC BY-SA 4.0 | https://commons.wikimedia.org/w/index.php?curid=170736777 |
| `hyperextension-1.jpg` | Athlete blonde girl doing leg and body exercise on machine | Nenad Stojkovic | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Athlete_blonde_girl_doing_leg_and_body_exercise_on_machine.jpg |
| `shoulder-press-machine-1.jpg` | Shoulder Press | Aliva Sahoo | CC BY-SA 4.0 | https://commons.wikimedia.org/w/index.php?curid=179972401 |
| `cable-crossover-1.jpg` | A dual-pulley cable crossover machine in a sunlit gym with a barbell and weights on a green floor. | Rashed Hossain | CC0 | https://wordpress.org/photos/photo/7986a27d89/ |
| `cable-crossover-2.jpg` | Chest flies with cable machine - cable crossover flies | Nenad Stojkovic | CC BY 2.0 | https://commons.wikimedia.org/w/index.php?curid=91921987 |
| `smith-machine-1.jpg` | A gym with a Smith machine, weights, and exercise equipment. | Rashed Hossain | CC0 | https://wordpress.org/photos/photo/3586a27d82/ |
| `dumbbells-1.jpg` | Dumbbells rack gym | — | CC0 | https://www.rawpixel.com/image/6025334/photo-image-public-domain-free-sport |
| `barbell-bench-1.jpg` | Bench Press | Aditya Oberai | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Bench_Press.jpg |
| `kettlebell-1.jpg` | Competition kettlebells 8-24 kilos | Knuckles | CC BY-SA 3.0 | https://commons.wikimedia.org/w/index.php?curid=33712983 |
| `treadmill-1.jpg` | Treadmills in Cobra Gym 24 Hour Fitness | Cobragym1 | CC BY-SA 3.0 | https://commons.wikimedia.org/w/index.php?curid=31572769 |
| `treadmill-2.jpg` | Young blonde woman running on a treadmill in the gym | Nenad Stojkovic | CC BY 2.0 | https://commons.wikimedia.org/w/index.php?curid=138406888 |
| `rowing-machine-1.jpg` | Concept 2 Indoor Rowers | — | public domain | https://commons.wikimedia.org/wiki/File:Concept_2_Indoor_Rowers.JPG |
| `resistance-band-1.jpg` | Resistant bands | Vis M | CC BY-SA 4.0 | https://commons.wikimedia.org/w/index.php?curid=133007549 |
| `medicine-ball-1.jpg` | Free swiss balls image | — | CC0 | https://www.rawpixel.com/image/5924275/photo-image-public-domain-yoga-free |
