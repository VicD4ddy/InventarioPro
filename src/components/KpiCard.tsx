interface SparklineProps {
    color?: string;
    points?: number[];
}

function Sparkline({ color = "#3b82f6", points = [30, 45, 35, 60, 50, 70, 65, 80] }: SparklineProps) {
    const width = 120;
    const height = 40;
    const paddingX = 4;
    const paddingY = 4;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;

    const minVal = Math.min(...points);
    const maxVal = Math.max(...points);
    const range = maxVal - minVal || 1;

    const svgPoints = points.map((val, i) => {
        const x = paddingX + (i / (points.length - 1)) * chartWidth;
        const y = paddingY + chartHeight - ((val - minVal) / range) * chartHeight;
        return `${x},${y}`;
    });

    const polyline = svgPoints.join(" ");
    const firstPoint = svgPoints[0];
    const lastPoint = svgPoints[svgPoints.length - 1];
    const [lx, ly] = lastPoint.split(",");
    const [fx, ,] = firstPoint.split(",");

    const fillPath = `M ${fx},${paddingY + chartHeight} L ${polyline.replace(/,/g, " ")} L ${lx},${parseFloat(ly) + chartHeight} Z`;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
            {/* Gradient fill */}
            <defs>
                <linearGradient id={`fill-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d={`M ${svgPoints.map((p) => p.replace(",", " ")).join(" L ")} L ${lx} ${paddingY + chartHeight} L ${fx} ${paddingY + chartHeight} Z`}
                fill={`url(#fill-${color.replace("#", "")})`}
            />
            <polyline
                points={polyline}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

import InfoTooltip from "./InfoTooltip";

interface KpiCardProps {
    title: string;
    value: string;
    badge?: React.ReactNode;
    subtext?: string;
    icon?: React.ReactNode;
    iconBg?: string;
    sparklineColor?: string;
    sparklinePoints?: number[];
    alert?: boolean;
    tooltipText?: string;
}

export default function KpiCard({
    title,
    value,
    badge,
    subtext,
    icon,
    iconBg = "bg-blue-50",
    sparklineColor = "#3b82f6",
    sparklinePoints,
    alert = false,
    tooltipText,
}: KpiCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center">
                    <span className="text-sm font-medium text-slate-500">{title}</span>
                    {tooltipText && <InfoTooltip text={tooltipText} position="bottom" />}
                </div>
                {icon && (
                    <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center`}>
                        {icon}
                    </div>
                )}
            </div>

            {/* Value */}
            <div className="flex items-end justify-between">
                <div className="flex flex-col gap-1">
                    <span
                        className={`text-3xl font-bold tracking-tight ${alert ? "text-slate-800" : "text-slate-900"
                            }`}
                    >
                        {value}
                    </span>
                    {badge && <div className="mt-1">{badge}</div>}
                    {subtext && (
                        <span className="text-xs text-slate-400 mt-1">{subtext}</span>
                    )}
                </div>
                {/* Sparkline */}
                <div className="opacity-90">
                    <Sparkline color={sparklineColor} points={sparklinePoints} />
                </div>
            </div>
        </div>
    );
}
