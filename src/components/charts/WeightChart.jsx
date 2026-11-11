import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatKg } from "../../data/selectors.js";

function WeightTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-line bg-sheet px-2.5 py-1.5 text-[13px] shadow-[0_8px_24px_rgba(14,18,15,0.12)]">
      <span className="text-muted">{point.label}: </span>
      <span className="tnum font-semibold">{formatKg(point.kg)} kq</span>
    </div>
  );
}

// One line, one question: is the weight moving? Straight segments, a few
// horizontal gridlines, the latest reading marked.
export default function WeightChart({ weights, height = 220, compact = false }) {
  const data = weights.map((kg, index) => ({ index, kg, week: `H${index + 1}`, label: `${index + 1}-ci həftə` }));
  const min = Math.floor(Math.min(...weights) - 0.5);
  const max = Math.ceil(Math.max(...weights) + 0.5);
  const step = Math.max(1, Math.ceil((max - min) / 4));
  const ticks = [];
  for (let t = min; t <= max + step - 1; t += step) ticks.push(t);
  const last = data.length - 1;

  return (
    <div style={{ height }} role="img" aria-label={`Çəki qrafiki: ${formatKg(weights[0])} kq-dan ${formatKg(weights[last])} kq-a`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: compact ? -22 : -14 }}>
          <CartesianGrid vertical={false} stroke="#e6e9e2" />
          <XAxis dataKey="week" tickLine={false} axisLine={{ stroke: "#c9cec4" }} tick={{ fontSize: 12, fill: "#5b635c" }} interval={compact ? 2 : 0} tickMargin={8} />
          <YAxis domain={[ticks[0], ticks[ticks.length - 1]]} ticks={ticks} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#5b635c" }} />
          <Tooltip content={<WeightTooltip />} cursor={{ stroke: "#c9cec4" }} />
          <Line
            type="linear"
            dataKey="kg"
            stroke="#0e120f"
            strokeWidth={2}
            isAnimationActive={false}
            dot={({ cx, cy, index }) =>
              index === last ? <circle key={index} cx={cx} cy={cy} r={5} fill="#c6f432" stroke="#0e120f" strokeWidth={2} /> : <g key={index} />
            }
            activeDot={{ r: 4, fill: "#0e120f", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
