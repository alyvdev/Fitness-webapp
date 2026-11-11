import { useState } from "react";
import { initials } from "../data/students.js";

// Student photo from /public/students with an initials fallback in the
// student's own pale tint.
export default function Avatar({ student, size = 36, className = "" }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={`relative inline-flex flex-none items-center justify-center overflow-hidden rounded-full font-semibold ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(11, Math.round(size * 0.36)),
        background: `hsl(${student.hue} 62% 90%)`,
        color: `hsl(${student.hue} 48% 26%)`,
      }}
    >
      <span aria-hidden="true">{initials(student.name)}</span>
      {!failed && (
        <img
          src={student.avatar}
          alt={student.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </span>
  );
}

export function AvatarStack({ students, size = 28, max = 4 }) {
  const shown = students.slice(0, max);
  const rest = students.length - shown.length;
  return (
    <span className="inline-flex items-center">
      {shown.map((student, index) => (
        <Avatar key={student.id} student={student} size={size} className={`ring-2 ring-sheet ${index ? "-ml-2" : ""}`} />
      ))}
      {rest > 0 && <span className="ml-1.5 text-[13px] text-muted">+{rest}</span>}
    </span>
  );
}
