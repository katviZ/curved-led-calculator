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

export default function ElevationDrawing({ screenW, screenH, cabCountW, cabCountH, modPerCabW, modPerCabH }) {
  const W = 560, H = 340, pad = 30;
  const aspect = screenW / screenH;
  let drawW = W - 2 * pad;
  let drawH = drawW / aspect;
  if (drawH > H - 2 * pad - 40) { drawH = H - 2 * pad - 40; drawW = drawH * aspect; }
  const x0 = (W - drawW) / 2;
  const y0 = 44;
  const cabPxW = drawW / cabCountW;
  const cabPxH = drawH / cabCountH;
  const cabs = [];
  for (let r = 0; r < cabCountH; r++) {
    for (let c = 0; c < cabCountW; c++) {
      cabs.push({ x: x0 + c * cabPxW, y: y0 + r * cabPxH, idx: r * cabCountW + c + 1 });
    }
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={BRAND.line} strokeWidth="0.5" opacity="0.4" />
        </pattern>
        <linearGradient id="cabGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BRAND.purple} stopOpacity="0.45" />
          <stop offset="100%" stopColor={BRAND.magenta} stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={BRAND.navyLight} />
      <rect width={W} height={H} fill="url(#grid2)" />
      <text x={pad} y={24} fontSize="10" fill={BRAND.lavender} opacity="0.7" fontFamily={MANROPE} fontWeight="600" letterSpacing="2">
        FRONT ELEVATION · VIEWER PERSPECTIVE
      </text>
      <rect x={x0 - 2} y={y0 - 2} width={drawW + 4} height={drawH + 4} fill="none" stroke={BRAND.amber} strokeWidth="1.5" />
      {cabs.map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={c.y} width={cabPxW} height={cabPxH} fill="url(#cabGrad)" stroke={BRAND.magenta} strokeWidth="0.8" />
          {[...Array(Math.round(modPerCabW) - 1)].map((_, j) => (
            <line key={`v${j}`} x1={c.x + ((j + 1) * cabPxW) / modPerCabW} y1={c.y} x2={c.x + ((j + 1) * cabPxW) / modPerCabW} y2={c.y + cabPxH} stroke={BRAND.lavender} strokeWidth="0.4" opacity="0.5" />
          ))}
          {[...Array(Math.round(modPerCabH) - 1)].map((_, j) => (
            <line key={`h${j}`} x1={c.x} y1={c.y + ((j + 1) * cabPxH) / modPerCabH} x2={c.x + cabPxW} y2={c.y + ((j + 1) * cabPxH) / modPerCabH} stroke={BRAND.lavender} strokeWidth="0.4" opacity="0.5" />
          ))}
          {cabPxW > 35 && (
            <text x={c.x + cabPxW / 2} y={c.y + cabPxH / 2 + 3} textAnchor="middle" fontSize="9" fill={BRAND.cream} fontFamily={MONO} opacity="0.85">C{c.idx}</text>
          )}
        </g>
      ))}
      <text x={x0 + drawW / 2} y={y0 + drawH + 22} textAnchor="middle" fontSize="10" fill={BRAND.lavender} fontFamily={MONO}>
        ← {num(screenW)} mm · {num(cabCountW)} cab × {num(modPerCabW)} mod →
      </text>
      <text x={x0 - 10} y={y0 + drawH / 2} textAnchor="middle" fontSize="10" fill={BRAND.lavender} fontFamily={MONO} transform={`rotate(-90 ${x0 - 10} ${y0 + drawH / 2})`}>
        {num(screenH)} mm · {num(cabCountH)} × {num(modPerCabH)}
      </text>
    </svg>
  );
}
