import React from "react";

const BRAND = {
  navy: "#06001A", navyLight: "#0F0826", purple: "#793494", magenta: "#9d20d6",
  lavender: "#c89dd9", cream: "#F5EFE6", line: "#2A1F3D",
  amber: "#E5B454", green: "#7BC474", red: "#E26464", wall: "#8B7355"
};
const MANROPE = "'Manrope', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

export default function PlanDrawing({ chord, R, sag, screenW, screenStart, cabCountW, curveType }) {
  const W = 560, H = 340, pad = 50;
  const scale = (W - 2 * pad) / chord;
  const cx = W / 2;
  const isOuter = curveType === "outer";
  const wallY = isOuter ? H - pad - 30 : pad + 30;
  const viewerY = isOuter ? 22 : H - 14;
  const apexDir = isOuter ? -1 : 1;
  const halfChord = chord / 2;
  const x1 = cx - halfChord * scale;
  const x2 = cx + halfChord * scale;
  const Rpx = R * scale;
  const sweepFlag = isOuter ? 1 : 0;
  const arcPath = `M ${x1} ${wallY} A ${Rpx} ${Rpx} 0 0 ${sweepFlag} ${x2} ${wallY}`;

  const arcPoint = (t) => {
    const xChord = -halfChord + t * chord;
    const yOff = Math.sqrt(R * R - xChord * xChord) - (R - sag);
    return { x: cx + xChord * scale, y: wallY + apexDir * yOff * scale };
  };

  const startFrac = screenStart / chord;
  const endFrac = (screenStart + screenW) / chord;
  const pS = arcPoint(startFrac);
  const pE = arcPoint(endFrac);
  const screenArc = `M ${pS.x} ${pS.y} A ${Rpx} ${Rpx} 0 0 ${sweepFlag} ${pE.x} ${pE.y}`;

  const ticks = [];
  for (let i = 0; i <= cabCountW; i++) {
    const t = startFrac + (i / cabCountW) * (endFrac - startFrac);
    ticks.push(arcPoint(t));
  }
  const apex = arcPoint(0.5);
  const struts = [0.25, 0.5, 0.75].map(t => {
    const p = arcPoint(t);
    const wx = cx + (-halfChord + t * chord) * scale;
    return { from: { x: wx, y: wallY }, to: p };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={BRAND.line} strokeWidth="0.5" opacity="0.4" />
        </pattern>
        <pattern id="wallHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke={BRAND.wall} strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={BRAND.navyLight} />
      <rect width={W} height={H} fill="url(#grid)" />
      <text x={pad} y={24} fontSize="10" fill={BRAND.lavender} opacity="0.7" fontFamily={MANROPE} fontWeight="600" letterSpacing="2">
        PLAN VIEW · {isOuter ? "OUTER (CONVEX)" : "INNER (CONCAVE)"}
      </text>
      <rect x={x1 - 30} y={isOuter ? wallY : wallY - 14} width={chord * scale + 60} height={14} fill="url(#wallHatch)" opacity="0.7" />
      <line x1={x1 - 30} y1={wallY} x2={x2 + 30} y2={wallY} stroke={BRAND.wall} strokeWidth="2" />
      <text x={cx} y={isOuter ? wallY + 28 : wallY - 20} textAnchor="middle" fontSize="10" fill={BRAND.wall} fontFamily={MANROPE} fontWeight="700" letterSpacing="1.5">
        BUILDING WALL · 2ND FLOOR
      </text>
      <text x={cx} y={viewerY} textAnchor="middle" fontSize="11" fill={BRAND.amber} fontFamily={MANROPE} fontWeight="700" letterSpacing="1.5">
        {isOuter ? "↑ VIEWER / STREET BELOW" : "↓ VIEWER"}
      </text>
      {struts.map((s, i) => (
        <line key={i} x1={s.from.x} y1={s.from.y} x2={s.to.x} y2={s.to.y} stroke={BRAND.lavender} strokeWidth="1" strokeDasharray="2 3" opacity="0.35" />
      ))}
      <circle cx={x1} cy={wallY} r="5" fill={BRAND.amber} stroke={BRAND.navy} strokeWidth="1.5" />
      <circle cx={x2} cy={wallY} r="5" fill={BRAND.amber} stroke={BRAND.navy} strokeWidth="1.5" />
      <text x={x1 - 8} y={wallY + (isOuter ? -8 : 18)} textAnchor="end" fontSize="9" fill={BRAND.amber} fontFamily={MONO}>ANCHOR</text>
      <text x={x2 + 8} y={wallY + (isOuter ? -8 : 18)} textAnchor="start" fontSize="9" fill={BRAND.amber} fontFamily={MONO}>ANCHOR</text>
      <path d={arcPath} fill="none" stroke={BRAND.lavender} strokeWidth="1.5" opacity="0.35" />
      <path d={screenArc} fill="none" stroke={BRAND.magenta} strokeWidth="4" />
      {ticks.map((p, i) => (<circle key={i} cx={p.x} cy={p.y} r="2.5" fill={BRAND.cream} />))}
      <line x1={apex.x - 22} y1={apex.y} x2={apex.x - 22} y2={wallY} stroke={BRAND.green} strokeWidth="1.2" />
      <line x1={apex.x - 26} y1={apex.y} x2={apex.x - 18} y2={apex.y} stroke={BRAND.green} strokeWidth="1.2" />
      <line x1={apex.x - 26} y1={wallY} x2={apex.x - 18} y2={wallY} stroke={BRAND.green} strokeWidth="1.2" />
      <text x={apex.x - 30} y={(apex.y + wallY) / 2 + 4} textAnchor="end" fontSize="10" fill={BRAND.green} fontFamily={MONO} fontWeight="600">S={Math.round(sag)}</text>
      <text x={apex.x - 30} y={(apex.y + wallY) / 2 + 16} textAnchor="end" fontSize="8" fill={BRAND.green} fontFamily={MONO} opacity="0.7">cantilever</text>
      <text x={apex.x + 8} y={apex.y + (isOuter ? -10 : 16)} fontSize="10" fill={BRAND.amber} fontFamily={MONO} fontWeight="600">R = {(R / 1000).toFixed(2)} m</text>
      <text x={(pS.x + pE.x) / 2} y={isOuter ? Math.min(pS.y, pE.y) - 18 : Math.max(pS.y, pE.y) + 24} textAnchor="middle" fontSize="11" fill={BRAND.magenta} fontFamily={MANROPE} fontWeight="700" letterSpacing="0.5">
        LED SCREEN · {Math.round(cabCountW)} CABINETS
      </text>
    </svg>
  );
}
