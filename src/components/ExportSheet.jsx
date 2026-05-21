import React, { forwardRef } from "react";
import Logo from "./Logo";

const BRAND = {
  navy: "#06001A", navyLight: "#0F0826", purple: "#793494", magenta: "#9d20d6",
  lavender: "#c89dd9", cream: "#F5EFE6", line: "#2A1F3D",
  amber: "#E5B454", green: "#7BC474", red: "#E26464", wall: "#8B7355"
};
const FRAUNCES = "'Fraunces', Georgia, serif";
const MANROPE = "'Manrope', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

function num(n, d = 0) {
  if (!isFinite(n)) return "—";
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: d });
}

const ExportSheet = forwardRef(function ExportSheet({ projectName, today, calc, chord, screenW, screenH, pitch, cabW, cabH, curveType, cabWeight, clientData }, ref) {
  const ink = "#1A1208", muted = "#6B5E4A", paper = "#FFFFFF";

  return (
    <div ref={ref} className="vr-print" style={{
      background: paper, color: ink, fontFamily: MANROPE,
      padding: "15mm", boxSizing: "border-box", width: "210mm", minHeight: "297mm"
    }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        borderBottom: `2px solid ${BRAND.magenta}`, paddingBottom: 16, marginBottom: 24
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Logo size={48} />
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: BRAND.magenta, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Visual Rhyme</div>
            <div style={{ fontFamily: FRAUNCES, fontSize: 26, fontWeight: 600, lineHeight: 1.1, color: ink }}>Curved LED — Project Specification</div>
          </div>
        </div>
        <div style={{ textAlign: "right", fontFamily: MONO, fontSize: 11, color: muted, flexShrink: 0, minWidth: 180 }}>
          <div style={{ fontSize: 14, color: ink, fontWeight: 600, marginBottom: 4 }}>{projectName || "Untitled Project"}</div>
          <div style={{ marginBottom: 2 }}>{today}</div>
          <div style={{ marginBottom: 8 }}>{curveType === "outer" ? "Outer / Convex" : "Inner / Concave"}</div>
          {clientData && (
            <div style={{ borderTop: `1px solid ${muted}33`, paddingTop: 8 }}>
              <div style={{ fontWeight: 600, color: ink }}>Client: {clientData.clientName || "—"}</div>
              {clientData.projectRef && <div style={{ marginTop: 2 }}>{clientData.projectRef}</div>}
              {clientData.contactEmail && <div style={{ marginTop: 2 }}>{clientData.contactEmail}</div>}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        {/* Left Column - Data */}
        <div>
          {/* Geometry Section */}
          <SectionTitle title="Geometry" />
          <SheetRow k="Radius (R)" v={`${num(calc.R / 1000, 2)} m`} />
          <SheetRow k="Chord / total width" v={`${num(chord)} mm`} />
          <SheetRow k={curveType === "outer" ? "Sagitta · cantilever" : "Sagitta · depth"} v={`${num(calc.sag, 0)} mm`} accent={BRAND.purple} />
          <SheetRow k="Screen size" v={`${num(screenW)} × ${num(screenH)} mm`} />
          <SheetRow k="Screen arc length" v={`${num(calc.screenArcLen, 0)} mm`} />
          <SheetRow k="Per-joint back gap" v={`${num(calc.gapPerJoint, 1)} mm`} accent={calc.verdictColor} />
          <SheetRow k="Per-cabinet wedge" v={`${num(calc.cabAngleDeg, 2)}°`} />

          {/* Build Quantities Section */}
          <SectionTitle title="Build Quantities" />
          <SheetRow k="Cabinets (W × H)" v={`${num(calc.cabCountW, calc.cabFitW ? 0 : 2)} × ${num(calc.cabCountH, calc.cabFitH ? 0 : 2)}`} accent={calc.cleanFit ? BRAND.green : BRAND.red} />
          <SheetRow k="Total cabinets" v={`${calc.totalCabs}${calc.cleanFit ? "" : " (rounded up)"}`} />
          <SheetRow k="Modules / cabinet" v={`${num(calc.modPerCabW, calc.modFitW ? 0 : 2)} × ${num(calc.modPerCabH, calc.modFitH ? 0 : 2)} = ${calc.modPerCab}`} />
          <SheetRow k="Total modules" v={num(calc.totalMods)} />
          <SheetRow k="Pixel resolution" v={`${num(calc.pxScreenW)} × ${num(calc.pxScreenH)} px`} />
          <SheetRow k="Pixel pitch" v={`${pitch} mm`} />

          {/* Structure Section */}
          <SectionTitle title="Structure" />
          <SheetRow k="Mounting strategy" v={calc.structuralStrategy} />
          <SheetRow k="Cantilever @ center" v={`${num(calc.cantileverAtCenter, 0)} mm`} accent={BRAND.purple} />
          <SheetRow k="Anchor zone" v={calc.wallContactAtEnds} />
          <SheetRow k="Steel structure (est.)" v={`~${num(calc.steelWeightKg, 0)} kg`} />
          <SheetRow k="Screen weight" v={`${num(calc.totalWeight, 0)} kg`} />
        </div>

        {/* Right Column - Drawing + Verdict + Electrical */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Plan Drawing */}
          <div style={{ border: "1px solid #E4DCCB", borderRadius: 8, overflow: "hidden", background: "#F8F6F2" }}>
            <PlanDrawing chord={chord} R={calc.R} sag={calc.sag} screenW={screenW} screenStart={calc.screenStart} cabCountW={Math.round(calc.cabCountW)} curveType={curveType} />
          </div>

          {/* Curve Verdict */}
          <div style={{ padding: 16, borderRadius: 8, background: `${calc.verdictColor}0A`, border: `1px solid ${calc.verdictColor}` }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: muted, fontWeight: 700, marginBottom: 4 }}>Curve Verdict</div>
            <div style={{ fontFamily: FRAUNCES, fontSize: 22, fontWeight: 700, color: calc.verdictColor, marginBottom: 6 }}>{calc.verdict}</div>
            <div style={{ fontSize: 12, lineHeight: 1.5, color: ink }}>{calc.advice}</div>
          </div>

          {/* Electrical Section */}
          <SectionTitle title="Electrical" />
          <SheetRow k="Average power" v={`${num(calc.avgPower / 1000, 2)} kW`} />
          <SheetRow k="Peak power" v={`${num(calc.maxPower / 1000, 2)} kW`} />
          <SheetRow k="Recommended supply" v={`${num(calc.recommendedSupply)} kW`} accent={BRAND.magenta} />
          <SheetRow k="Cabinet weight basis" v={`${num(cabWeight)} kg each`} />
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div style={{
        marginTop: 28, paddingTop: 14, borderTop: "1px solid #E4DCCB",
        fontSize: 9.5, lineHeight: 1.5, color: muted, fontStyle: "italic"
      }}>
        Pre-engineering estimates for project scoping only. Final structural design, anchor specification and wind-load
        verification must be stamped by a licensed structural engineer per local code (IS 875 Part 3 for wind in India).
        Power and steel figures are indicative. © {new Date().getFullYear()} Visual Rhyme.
      </div>
    </div>
  );
});

export default ExportSheet;

function SectionTitle({ title }) {
  return (
    <div style={{
      fontSize: 11, letterSpacing: 2, color: "#793494", fontWeight: 700,
      textTransform: "uppercase", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #E4DCCB"
    }}>
      {title}
    </div>
  );
}

function SheetRow({ k, v, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "6px 0", borderBottom: "1px solid #F0ECE4" }}>
      <span style={{ fontSize: 10.5, letterSpacing: 0.5, textTransform: "uppercase", color: "#6B5E4A", fontFamily: MANROPE, fontWeight: 600 }}>{k}</span>
      <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: accent || "#1A1208" }}>{v}</span>
    </div>
  );
}

function PlanDrawing({ chord, R, sag, screenW, screenStart, cabCountW, curveType }) {
  const W = 520, H = 280, pad = 45;
  const scale = (W - 2 * pad) / chord;
  const cx = W / 2;
  const isOuter = curveType === "outer";
  const wallY = isOuter ? H - pad - 25 : pad + 25;
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

  // PDF-optimized colors
  const pdfBg = "#F8F6F2";
  const pdfGrid = "#E8E4DC";
  const pdfText = "#1A1208";
  const pdfTextMuted = "#6B5E4A";
  const pdfWall = "#8B7355";
  const pdfWallHatch = "#A08B6E";
  const pdfAmber = "#B8860B";
  const pdfMagenta = "#9d20d6";
  const pdfGreen = "#5A9E5A";
  const pdfLavender = "#793494";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <pattern id="grid-pdf" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={pdfGrid} strokeWidth="0.5" />
        </pattern>
        <pattern id="wallHatch-pdf" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke={pdfWallHatch} strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={pdfBg} />
      <rect width={W} height={H} fill="url(#grid-pdf)" />

      {/* Title - positioned at top left with padding */}
      <text x={pad} y={20} fontSize="9" fill={pdfText} fontFamily="'Manrope', sans-serif" fontWeight="600" letterSpacing="1.5">
        PLAN VIEW · {isOuter ? "OUTER (CONVEX)" : "INNER (CONCAVE)"}
      </text>

      {/* Wall */}
      <rect x={x1 - 25} y={isOuter ? wallY : wallY - 12} width={chord * scale + 50} height={12} fill="url(#wallHatch-pdf)" opacity="0.8" />
      <line x1={x1 - 25} y1={wallY} x2={x2 + 25} y2={wallY} stroke={pdfWall} strokeWidth="2" />

      {/* Wall label - positioned below wall */}
      <text x={cx} y={isOuter ? wallY + 22 : wallY - 16} textAnchor="middle" fontSize="9" fill={pdfTextMuted} fontFamily="'Manrope', sans-serif" fontWeight="600" letterSpacing="1">
        BUILDING WALL · 2ND FLOOR
      </text>

      {/* Viewer label - positioned at bottom for outer, top for inner */}
      <text x={cx} y={isOuter ? H - 8 : 32} textAnchor="middle" fontSize="9" fill={pdfAmber} fontFamily="'Manrope', sans-serif" fontWeight="600" letterSpacing="1">
        {isOuter ? "↑ VIEWER / STREET BELOW" : "↓ VIEWER"}
      </text>

      {/* Structural struts */}
      {struts.map((s, i) => (
        <line key={i} x1={s.from.x} y1={s.from.y} x2={s.to.x} y2={s.to.y} stroke={pdfLavender} strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
      ))}

      {/* Anchor points */}
      <circle cx={x1} cy={wallY} r="4" fill={pdfAmber} stroke={pdfBg} strokeWidth="1.5" />
      <circle cx={x2} cy={wallY} r="4" fill={pdfAmber} stroke={pdfBg} strokeWidth="1.5" />
      <text x={x1 - 6} y={wallY + (isOuter ? -8 : 16)} textAnchor="end" fontSize="8" fill={pdfAmber} fontFamily="'JetBrains Mono', monospace" fontWeight="600">ANCHOR</text>
      <text x={x2 + 6} y={wallY + (isOuter ? -8 : 16)} textAnchor="start" fontSize="8" fill={pdfAmber} fontFamily="'JetBrains Mono', monospace" fontWeight="600">ANCHOR</text>

      {/* Full arc */}
      <path d={arcPath} fill="none" stroke={pdfLavender} strokeWidth="1.5" opacity="0.5" />

      {/* Screen arc */}
      <path d={screenArc} fill="none" stroke={pdfMagenta} strokeWidth="3.5" />

      {/* Cabinet ticks */}
      {ticks.map((p, i) => (<circle key={i} cx={p.x} cy={p.y} r="2" fill={pdfText} />))}

      {/* Sagitta dimension */}
      <line x1={apex.x - 18} y1={apex.y} x2={apex.x - 18} y2={wallY} stroke={pdfGreen} strokeWidth="1" />
      <line x1={apex.x - 22} y1={apex.y} x2={apex.x - 14} y2={apex.y} stroke={pdfGreen} strokeWidth="1" />
      <line x1={apex.x - 22} y1={wallY} x2={apex.x - 14} y2={wallY} stroke={pdfGreen} strokeWidth="1" />
      <text x={apex.x - 26} y={(apex.y + wallY) / 2 + 3} textAnchor="end" fontSize="9" fill={pdfGreen} fontFamily="'JetBrains Mono', monospace" fontWeight="600">S={Math.round(sag)}</text>
      <text x={apex.x - 26} y={(apex.y + wallY) / 2 + 13} textAnchor="end" fontSize="7" fill={pdfTextMuted} fontFamily="'JetBrains Mono', monospace">cantilever</text>

      {/* Radius label */}
      <text x={apex.x + 6} y={apex.y + (isOuter ? -8 : 14)} fontSize="9" fill={pdfAmber} fontFamily="'JetBrains Mono', monospace" fontWeight="600">R = {(R / 1000).toFixed(2)} m</text>

      {/* Screen label */}
      <text x={(pS.x + pE.x) / 2} y={isOuter ? Math.min(pS.y, pE.y) - 12 : Math.max(pS.y, pE.y) + 18} textAnchor="middle" fontSize="9" fill={pdfMagenta} fontFamily="'Manrope', sans-serif" fontWeight="600" letterSpacing="0.5">
        LED SCREEN · {Math.round(cabCountW)} CABINETS
      </text>
    </svg>
  );
}
