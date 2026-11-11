import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function AttendanceTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const week = payload[0].payload;
  return (
    <div className="rounded-lg bg-sheet px-2.5 py-1.5 text-[13px] text-ink shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
      <span className="text-muted">{week.label} həftəsi: </span>
      <span className="tnum font-semibold">
        {week.rate}% ({week.attended}/{week.total})
      </span>
    </div>
  );
}

// Weekly attendance on the dark card: lime columns from zero, the latest
// week at full strength.
export default function AttendanceChart({ data, height = 200 }) {
  const last = data.length - 1;
  return (
    <div style={{ height }} role="img" aria-label={`Həftəlik davamiyyət, son həftə ${data[last]?.rate ?? 0}%`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: -18 }} barCategoryGap="28%">
          <CartesianGrid vertical={false} stroke="#2a322b" />
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: "#4a554b" }} tick={{ fontSize: 12, fill: "#aab3a9" }} tickMargin={8} />
          <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#aab3a9" }} width={56} />
          <Tooltip content={<AttendanceTooltip />} cursor={{ fill: "rgba(255,255,255,0.06)" }} />
          <Bar dataKey="rate" radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {data.map((week, index) => (
              <Cell key={week.label} fill={index === last ? "#c6f432" : "#6f8a1f"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
