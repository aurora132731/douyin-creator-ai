import { useId, useMemo } from "react";
import type { DiagnosisDimension } from "../types";

interface Props {
  dimensions: DiagnosisDimension[];
  workTitle?: string;
  className?: string;
}

const CHART_SIZE = 260;
const CENTER = CHART_SIZE / 2;
const MAX_R = 88;

type Vertex = DiagnosisDimension & { angle: number };

function DimensionLabel({
  dim,
  align,
}: {
  dim: Vertex;
  align: "top" | "bottom" | "left" | "right";
}) {
  const isGood = dim.status === "good";
  const gap = dim.radarScore - dim.radarPeerScore;
  const alignClass =
    align === "top" || align === "bottom"
      ? "items-center text-center"
      : align === "left"
        ? "items-end text-right"
        : "items-start text-left";

  return (
    <div className={`flex w-[108px] shrink-0 flex-col gap-0.5 sm:w-[120px] ${alignClass}`}>
      <span className="text-xs font-semibold text-fg">{dim.title}</span>
      <span className="text-lg font-bold leading-none text-douyin-pink">{dim.radarScore}</span>
      <span className="text-[10px] text-fg-muted">
        同类 {dim.radarPeerScore}
        <span className={gap >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
          {" "}
          ({gap >= 0 ? "+" : ""}
          {gap})
        </span>
      </span>
      <span
        className={`mt-0.5 inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ${
          isGood
            ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400"
            : "bg-amber-500/12 text-amber-700 dark:text-amber-400"
        } ${align === "top" || align === "bottom" ? "mx-auto" : ""}`}
      >
        {isGood ? "较好" : "待提升"}
      </span>
    </div>
  );
}

/** 四段漏斗雷达 · 双图层 + 轴外标签（主题随 CSS 变量自动切换） */
export function DiagnosisRadar({ dimensions, workTitle, className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const angleStep = (Math.PI * 2) / dimensions.length;

  const vertices: Vertex[] = useMemo(
    () =>
      dimensions.map((d, i) => ({
        ...d,
        angle: -Math.PI / 2 + i * angleStep,
      })),
    [dimensions, angleStep]
  );

  const top = vertices[0];
  const right = vertices[1];
  const bottom = vertices[2];
  const left = vertices[3];

  const toPoint = (score: number, angle: number) => {
    const rad = (score / 100) * MAX_R;
    return {
      x: CENTER + rad * Math.cos(angle),
      y: CENTER + rad * Math.sin(angle),
    };
  };

  const selfPolygon = vertices
    .map((v) => {
      const p = toPoint(v.radarScore, v.angle);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const peerPolygon = vertices
    .map((v) => {
      const p = toPoint(v.radarPeerScore, v.angle);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const compositeScore = Math.round(
    vertices.reduce((s, v) => s + v.radarScore, 0) / vertices.length
  );
  const peerComposite = Math.round(
    vertices.reduce((s, v) => s + v.radarPeerScore, 0) / vertices.length
  );
  const vsPeer = compositeScore - peerComposite;
  const gradeLabel =
    compositeScore >= 75 ? "表现良好" : compositeScore >= 55 ? "有待提升" : "建议优化";

  return (
    <div className={`w-full ${className}`}>
      <div
        className="relative mx-auto max-w-[420px] rounded-2xl border border-line px-3 py-4 sm:px-4"
        style={{ background: "var(--radar-panel)", boxShadow: "var(--shadow-card)" }}
      >
        <p className="mb-3 text-center text-[11px] text-fg-muted">
          四段漏斗雷达 · 本篇 vs 同类均值
        </p>

        <div className="mx-auto mb-4 flex w-fit items-center gap-3 rounded-full border border-line bg-card px-4 py-2 shadow-sm">
          <span className="text-2xl font-bold tabular-nums text-douyin-pink">{compositeScore}</span>
          <div className="text-left">
            <p className="text-xs font-medium text-fg">综合分</p>
            <p className="text-[11px] text-douyin-pink">{gradeLabel}</p>
            <p className="text-[10px] text-fg-muted">
              同类 {peerComposite} ({vsPeer >= 0 ? "+" : ""}
              {vsPeer})
            </p>
          </div>
        </div>

        <div className="mb-2 flex justify-center">
          <DimensionLabel dim={top} align="top" />
        </div>

        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <DimensionLabel dim={left} align="left" />
          <svg
            viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
            className="h-[220px] w-[220px] shrink-0 sm:h-[260px] sm:w-[260px]"
            aria-label="作品四维度雷达图"
          >
            <defs>
              <linearGradient id={`${uid}-selfFill`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B8A" stopOpacity="0.42" />
                <stop offset="100%" stopColor="#FE2C55" stopOpacity="0.22" />
              </linearGradient>
            </defs>

            {gridLevels.map((level, li) => (
              <polygon
                key={level}
                points={vertices
                  .map((v) => {
                    const p = toPoint(100 * level, v.angle);
                    return `${p.x},${p.y}`;
                  })
                  .join(" ")}
                fill={li === gridLevels.length - 1 ? "var(--radar-axis)" : "none"}
                fillOpacity={li === gridLevels.length - 1 ? 0.35 : 0}
                stroke="var(--radar-grid)"
                strokeWidth="1"
                strokeDasharray={li < gridLevels.length - 1 ? "3 3" : undefined}
              />
            ))}

            {vertices.map((v) => {
              const end = toPoint(100, v.angle);
              return (
                <line
                  key={v.id}
                  x1={CENTER}
                  y1={CENTER}
                  x2={end.x}
                  y2={end.y}
                  stroke="var(--radar-axis)"
                  strokeWidth="1"
                />
              );
            })}

            {[20, 40, 60, 80, 100].map((score) => {
              const p = toPoint(score, -Math.PI / 2);
              return (
                <text
                  key={score}
                  x={p.x}
                  y={p.y - 5}
                  textAnchor="middle"
                  fill="var(--radar-scale)"
                  fontSize="9"
                >
                  {score}
                </text>
              );
            })}

            <polygon
              points={peerPolygon}
              fill="var(--radar-peer-fill)"
              stroke="var(--radar-peer-stroke)"
              strokeWidth="2"
              strokeDasharray="6 4"
              strokeLinejoin="round"
            />

            <polygon
              points={selfPolygon}
              fill={`url(#${uid}-selfFill)`}
              stroke="#FE2C55"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {vertices.map((v) => {
              const self = toPoint(v.radarScore, v.angle);
              const peer = toPoint(v.radarPeerScore, v.angle);
              return (
                <g key={`dots-${v.id}`}>
                  <circle cx={peer.x} cy={peer.y} r="3.5" fill="var(--radar-peer-stroke)" />
                  <circle cx={self.x} cy={self.y} r="4.5" fill="#FE2C55" stroke="var(--bg-card)" strokeWidth="2" />
                </g>
              );
            })}

            <circle cx={CENTER} cy={CENTER} r="2" fill="var(--radar-grid)" />
          </svg>
          <DimensionLabel dim={right} align="right" />
        </div>

        <div className="mt-2 flex justify-center">
          <DimensionLabel dim={bottom} align="bottom" />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 px-2 text-[11px] text-fg-muted">
          <span className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-6 rounded-sm bg-gradient-to-r from-[#FF6B8A] to-[#FE2C55]" />
            <span>
              本篇作品
              {workTitle ? (
                <span className="ml-1 font-medium text-fg">
                  · {workTitle.length > 12 ? `${workTitle.slice(0, 12)}…` : workTitle}
                </span>
              ) : null}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-0 w-6 border-t-2 border-dashed"
              style={{ borderColor: "var(--radar-peer-stroke)" }}
            />
            同类创作者均值
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {vertices.map((v) => {
          const gap = v.radarScore - v.radarPeerScore;
          const isGood = v.status === "good";
          return (
            <div
              key={v.id}
              className="flex items-center gap-3 rounded-xl border border-line bg-card px-3 py-2.5"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  isGood
                    ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400"
                    : "bg-amber-500/12 text-amber-700 dark:text-amber-400"
                }`}
              >
                {v.segment}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-medium text-fg">{v.title}</span>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] ${
                      isGood
                        ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400"
                        : "bg-amber-500/12 text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    {isGood ? "较好" : "待提升"}
                  </span>
                </div>
                <div className="relative mt-1.5 h-2 overflow-hidden rounded-full bg-inset">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full opacity-60"
                    style={{
                      width: `${v.radarPeerScore}%`,
                      background: "var(--radar-peer-stroke)",
                    }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#FF6B8A] to-[#FE2C55]"
                    style={{ width: `${v.radarScore}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-fg-muted">
                  本篇 {v.radarScore} · 同类 {v.radarPeerScore}
                  <span
                    className={
                      gap >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    }
                  >
                    {" "}
                    ({gap >= 0 ? "+" : ""}
                    {gap})
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
