import React from "react";

const BRAND = {
  navy: "#06001A", navyLight: "#0F0826", purple: "#793494", magenta: "#9d20d6",
  lavender: "#c89dd9", cream: "#F5EFE6", line: "#2A1F3D",
  amber: "#E5B454", green: "#7BC474", red: "#E26464", wall: "#8B7355"
};
const MANROPE = "'Manrope', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

function num(n, d = 0) {
  if (!isFinite(n)) return "—";
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: d });
}

export default function SectionDrawing({ sag, curveType }) {
  const W = 340, H = 340;
  const isOuter = curveType === "outer";
  const wallX = 60;
  const sagScale = Math.min(180 / Math.max(sag, 100), 0.35);
  const visualSag = Math.max(sag * sagScale, 30);
  const cabFaceX = wallX + (isOuter ? visualSag : -visualSag) + (isOuter ? 0 : visualSag * 2);
  const topY = 70;
  const botY = H - 90;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <pattern id="grid3" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={BRAND.line} strokeWidth="0.5" opacity="0.4" />
        </pattern>
        <pattern id="wallHatch2" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={BRAND.wall} strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={BRAND.navyLight} />
      <rect width={W} height={H} fill="url(#grid3)" />
      <text x={20} y={22} fontSize="10" fill={BRAND.lavender} opacity="0.7" fontFamily={MANROPE} fontWeight="600" letterSpacing="2">
        SIDE SECTION
      </text>
      <rect x={wallX - 16} y={topY - 30} width={16} height={botY - topY + 50} fill="url(#wallHatch2)" opacity="0.8" />
      <line x1={wallX} y1={topY - 30} x2={wallX} y2={botY + 20} stroke={BRAND.wall} strokeWidth="2.5" />
      <text x={wallX - 22} y={(topY + botY) / 2} textAnchor="middle" fontSize="9" fill={BRAND.wall} fontFamily={MANROPE} fontWeight="700" transform={`rotate(-90 ${wallX - 22} ${(topY + botY) / 2})`}>
        BUILDING WALL
      </text>
      <line x1={wallX - 16} y1={botY + 20} x2={W - 10} y2={botY + 20} stroke={BRAND.wall} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
      <text x={W - 10} y={botY + 34} textAnchor="end" fontSize="8" fill={BRAND.wall} fontFamily={MONO} opacity="0.6">2ND FLOOR SLAB</text>
      <line x1={cabFaceX - 8} y1={topY - 10} x2={cabFaceX - 8} y2={botY + 10} stroke={BRAND.amber} strokeWidth="2" />
      <text x={cabFaceX - 12} y={topY - 16} textAnchor="end" fontSize="8" fill={BRAND.amber} fontFamily={MONO}>BACK FRAME</text>
      <rect x={cabFaceX} y={topY} width={6} height={botY - topY} fill={BRAND.magenta} opacity="0.9" />
      <text x={cabFaceX + 12} y={(topY + botY) / 2 - 5} fontSize="9" fill={BRAND.magenta} fontFamily={MANROPE} fontWeight="700">LED FACE</text>
      <text x={cabFaceX + 12} y={(topY + botY) / 2 + 8} fontSize="8" fill={BRAND.magenta} fontFamily={MONO} opacity="0.7">at apex</text>
      {[topY + 20, (topY + botY) / 2, botY - 20].map((y, i) => (
        <line key={i} x1={wallX} y1={y} x2={cabFaceX - 8} y2={y} stroke={BRAND.purple} strokeWidth="1.5" />
      ))}
      <line x1={wallX} y1={botY + 55} x2={cabFaceX} y2={botY + 55} stroke={BRAND.green} strokeWidth="1.2" />
      <line x1={wallX} y1={botY + 51} x2={wallX} y2={botY + 59} stroke={BRAND.green} strokeWidth="1.2" />
      <line x1={cabFaceX} y1={botY + 51} x2={cabFaceX} y2={botY + 59} stroke={BRAND.green} strokeWidth="1.2" />
      <text x={(wallX + cabFaceX) / 2} y={botY + 70} textAnchor="middle" fontSize="11" fill={BRAND.green} fontFamily={MONO} fontWeight="600">
        {num(sag, 0)} mm
      </text>
      <text x={(wallX + cabFaceX) / 2} y={botY + 82} textAnchor="middle" fontSize="8" fill={BRAND.green} fontFamily={MONO} opacity="0.7">
        cantilever @ apex
      </text>
    </svg>
  );
}
