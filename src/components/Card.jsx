import { useHeading } from "../context/PreviewContext.jsx";

// White panel with an optional header row (title on the left, action on the right).
export default function Card({ title, action, children, className = "", bodyClassName, as: Tag = "section" }) {
  const hasHeader = Boolean(title || action);
  const Title = useHeading("h2");
  return (
    <Tag className={`card ${className}`}>
      {hasHeader && (
        <header className="flex min-h-[52px] items-center justify-between gap-3 px-4 pt-1 sm:px-5">
          <Title className="text-[15px] font-semibold">{title}</Title>
          {action}
        </header>
      )}
      <div className={bodyClassName ?? `px-4 pb-4 sm:px-5 sm:pb-5 ${hasHeader ? "" : "pt-4 sm:pt-5"}`}>{children}</div>
    </Tag>
  );
}
