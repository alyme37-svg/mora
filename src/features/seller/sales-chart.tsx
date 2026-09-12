import { formatMoney } from "@/lib/money";
import type { SellerAnalyticsPoint } from "@/types/marketplace";

export function SalesChart({ points }: { points: SellerAnalyticsPoint[] }) {
  const max = Math.max(...points.map((point) => point.revenue.amount), 1);
  const width = 640;
  const height = 180;
  const inset = 12;
  const coordinates = points.map((point, index) => ({
    x: inset + (index * (width - inset * 2)) / Math.max(points.length - 1, 1),
    y: height - inset - (point.revenue.amount / max) * (height - inset * 2),
    point,
  }));
  const polyline = coordinates.map(({ x, y }) => `${x},${y}`).join(" ");

  return (
    <figure className="min-w-0 max-w-full overflow-hidden">
      <div
        className="relative mt-6 h-52 w-full max-w-full overflow-hidden sm:h-60"
        role="img"
        aria-label={`Sales increased from ${points[0] ? formatMoney(points[0].revenue) : "$0"} to ${points.at(-1) ? formatMoney(points.at(-1)!.revenue) : "$0"} across six months.`}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="block size-full max-w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1="0"
              x2={width}
              y1={height * ratio}
              y2={height * ratio}
              stroke="var(--mora-border)"
              strokeWidth="1"
            />
          ))}
          <polyline
            points={polyline}
            fill="none"
            stroke="var(--mora-caramel)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
          {coordinates.map(({ x, y, point }) => (
            <circle
              key={point.month}
              cx={x}
              cy={y}
              r="4"
              fill="var(--mora-surface)"
              stroke="var(--mora-walnut)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>
      <figcaption className="mt-3 grid grid-cols-6 text-center text-[0.625rem] font-medium text-muted-foreground">
        {points.map((point) => (
          <span key={point.month}>
            {new Intl.DateTimeFormat("en", { month: "short" }).format(
              new Date(`${point.month}-01T00:00:00`),
            )}
          </span>
        ))}
      </figcaption>
      <table className="sr-only">
        <caption>Monthly seller analytics</caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Sales</th>
            <th>Orders</th>
            <th>Views</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.month}>
              <td>{point.month}</td>
              <td>{formatMoney(point.revenue)}</td>
              <td>{point.orders}</td>
              <td>{point.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
