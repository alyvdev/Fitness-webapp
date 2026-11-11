// Date helpers and derived figures. Every number shown twice in the UI
// (attendance %, debt, next class, class counts) is computed here, once.

import { schedule as baseSchedule, DAY_NAMES } from "./schedule.js";
import { students } from "./students.js";

export const MONTHS = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];

const pad = (n) => String(n).padStart(2, "0");

export const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
export const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};
// Monday = 0 … Sunday = 6
export const weekdayIndex = (date) => (date.getDay() + 6) % 7;
export const startOfWeek = (date) => addDays(date, -weekdayIndex(date));
export const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const formatDate = (date) => `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
export const formatDayMonth = (date) => `${pad(date.getDate())}.${pad(date.getMonth() + 1)}`;

export const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
export const fromMinutes = (minutes) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
export const endTime = (cls) => fromMinutes(toMinutes(cls.start) + cls.duration);

export const formatKg = (n) => n.toFixed(1).replace(".", ",");
export const formatCm = (n) => String(n).replace(".", ",");
export const formatSigned = (n, digits = 1) => {
  const fixed = Math.abs(n).toFixed(digits).replace(".", ",");
  if (Number(n.toFixed(digits)) === 0) return fixed;
  return `${n > 0 ? "+" : "−"}${fixed}`;
};
export const formatRest = (seconds) => {
  if (!seconds) return "fasiləsiz";
  if (seconds < 60) return `${seconds} san`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s ? `${m} dəq ${s} san` : `${m} dəq`;
};

export const classesOn = (classes, day) =>
  classes.filter((cls) => cls.day === day).sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

// Ids of classes that overlap another class on the same day.
export const findConflicts = (classes) => {
  const ids = new Set();
  for (let i = 0; i < classes.length; i += 1) {
    for (let j = i + 1; j < classes.length; j += 1) {
      const a = classes[i];
      const b = classes[j];
      if (a.day !== b.day) continue;
      const aStart = toMinutes(a.start);
      const bStart = toMinutes(b.start);
      if (aStart < bStart + b.duration && bStart < aStart + a.duration) {
        ids.add(a.id);
        ids.add(b.id);
      }
    }
  }
  return ids;
};

// Past sessions, newest first. History always reads the base schedule so that
// classes added or cancelled during the demo do not rewrite the past.
export const getSessions = (studentId, days = 30) => {
  const student = students.find((s) => s.id === studentId);
  const missed = new Set(student?.missedSessions ?? []);
  const now = today();
  const sessions = [];
  for (let back = 1; back <= days; back += 1) {
    const date = addDays(now, -back);
    const day = weekdayIndex(date);
    baseSchedule
      .filter((cls) => cls.day === day && cls.studentIds.includes(studentId))
      .forEach((cls) => {
        sessions.push({ date, cls, attended: !missed.has(sessions.length + 1) });
      });
  }
  return sessions;
};

export const attendanceRate = (sessions) =>
  sessions.length ? Math.round((sessions.filter((s) => s.attended).length / sessions.length) * 100) : 0;

export const attendanceSummary = (studentId) => {
  const sessions = getSessions(studentId, 30);
  const attended = sessions.filter((s) => s.attended).length;
  let streak = 0;
  for (const session of sessions) {
    if (!session.attended) break;
    streak += 1;
  }
  return { total: sessions.length, attended, missed: sessions.length - attended, rate: attendanceRate(sessions), streak };
};

// Status of every day in a month for one student: attended, missed, upcoming or null.
export const getMonthCalendar = (studentId, classes, monthDate) => {
  const now = today();
  const past = getSessions(studentId, 70);
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const count = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let d = 1; d <= count; d += 1) {
    const date = new Date(year, month, d);
    let status = null;
    if (date < now) {
      const session = past.find((s) => sameDay(s.date, date));
      if (session) status = session.attended ? "attended" : "missed";
    } else if (classes.some((cls) => cls.day === weekdayIndex(date) && cls.studentIds.includes(studentId))) {
      status = "upcoming";
    }
    days.push({ date, status, isToday: sameDay(date, now) });
  }
  return days;
};

// Next class for a student, looking up to a week ahead.
export const nextClass = (studentId, classes) => {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const base = today();
  for (let ahead = 0; ahead < 8; ahead += 1) {
    const date = addDays(base, ahead);
    const found = classesOn(classes, weekdayIndex(date)).find(
      (cls) => cls.studentIds.includes(studentId) && (ahead > 0 || toMinutes(cls.start) > nowMinutes),
    );
    if (found) {
      const dayLabel = ahead === 0 ? "Bu gün" : ahead === 1 ? "Sabah" : DAY_NAMES[found.day];
      return { cls: found, date, label: `${dayLabel}, ${found.start}` };
    }
  }
  return null;
};

// Share of attended sessions across all students for the last `weeks` full weeks.
export const weeklyAttendanceTrend = (weeks = 8) => {
  const thisMonday = startOfWeek(today());
  const all = students.flatMap((student) => getSessions(student.id, weeks * 7 + 7));
  const trend = [];
  for (let w = weeks; w >= 1; w -= 1) {
    const from = addDays(thisMonday, -7 * w);
    const to = addDays(from, 7);
    const inWeek = all.filter((s) => s.date >= from && s.date < to);
    trend.push({
      label: formatDayMonth(from),
      rate: attendanceRate(inWeek),
      attended: inWeek.filter((s) => s.attended).length,
      total: inWeek.length,
    });
  }
  return trend;
};

export const paymentStatus = (student) => (student.unpaidMonths > 0 ? "Gecikir" : "Ödənilib");
export const debt = (student) => student.fee * student.unpaidMonths;

// Last six months, newest first. The most recent `unpaidMonths` are overdue.
export const paymentHistory = (student) => {
  const now = today();
  return Array.from({ length: 6 }, (_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const paid = i >= student.unpaidMonths;
    const paidOn = new Date(month.getFullYear(), month.getMonth(), 2 + (student.name.length % 5));
    return {
      key: `${month.getFullYear()}-${month.getMonth()}`,
      label: `${MONTHS[month.getMonth()]} ${month.getFullYear()}`,
      amount: student.fee,
      status: paid ? "Ödənilib" : "Gecikir",
      paidOn: paid && paidOn <= now ? formatDate(paidOn) : paid ? formatDate(month) : null,
    };
  });
};
