// Phone bezel for the student view. On a real phone (below `sm`) the frame
// disappears and the content fills the screen, unless `always` is set.
export default function PhoneFrame({ children, always = false, className = "" }) {
  const frame = always
    ? "h-[700px] w-[348px] rounded-[44px] bg-ink p-[10px]"
    : "h-[calc(100dvh-48px)] w-full sm:h-[min(780px,calc(100dvh-96px))] sm:w-[384px] sm:rounded-[46px] sm:bg-ink sm:p-[11px]";
  const screen = always ? "rounded-[34px]" : "sm:rounded-[36px]";
  return (
    <div className={`relative mx-auto flex-none ${frame} ${className}`}>
      <div className={`relative flex h-full flex-col overflow-hidden bg-sheet ${screen}`}>
        <div
          className={`pointer-events-none absolute left-1/2 top-2 z-20 h-[22px] w-[92px] -translate-x-1/2 rounded-full bg-ink ${always ? "" : "hidden sm:block"}`}
          aria-hidden="true"
        />
        {children}
      </div>
    </div>
  );
}
