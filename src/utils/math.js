export function calcCurve(chord, screenW, screenH, screenPos, cabW, cabH, modW, modH, pitch, curveMode, sagitta, radiusIn, preset, cabWeight, curveType) {
  let R;
  if (curveMode === "sagitta") R = (chord * chord) / (8 * sagitta) + sagitta / 2;
  else if (curveMode === "radius") R = radiusIn;
  else {
    const map = { subtle: 5, signature: 2.5, wrap: 1.3, cylinder: 0.8 };
    R = screenW * map[preset];
  }
  const sag = R - Math.sqrt(R * R - (chord * chord) / 4);
  const screenStart = screenPos === "left" ? 0 : screenPos === "right" ? chord - screenW : (chord - screenW) / 2;
  const cabCountW = Math.round((screenW / cabW) * 100) / 100;
  const cabCountH = Math.round((screenH / cabH) * 100) / 100;
  const cabFitW = Number.isInteger(cabCountW);
  const cabFitH = Number.isInteger(cabCountH);
  const cleanFit = cabFitW && cabFitH;
  const totalCabs = Math.ceil(cabCountW) * Math.ceil(cabCountH);
  const modPerCabW = Math.round((cabW / modW) * 100) / 100;
  const modPerCabH = Math.round((cabH / modH) * 100) / 100;
  const modFitW = Number.isInteger(modPerCabW);
  const modFitH = Number.isInteger(modPerCabH);
  const modPerCab = Math.ceil(modPerCabW) * Math.ceil(modPerCabH);
  const totalMods = totalCabs * modPerCab;
  const pxScreenW = Math.round(screenW / pitch);
  const pxScreenH = Math.round(screenH / pitch);
  const totalPixels = pxScreenW * pxScreenH;
  const halfAngle = Math.asin(chord / (2 * R));
  const totalArcLen = R * 2 * halfAngle;
  const xStart = screenStart - chord / 2;
  const xEnd = screenStart + screenW - chord / 2;
  const screenArcLen = R * (Math.asin(xEnd / R) - Math.asin(xStart / R));
  const cabAngleRad = 2 * Math.asin(cabW / (2 * R));
  const cabAngleDeg = (cabAngleRad * 180) / Math.PI;
  const gapPerJoint = (cabW * cabW) / (2 * R);

  let verdict, verdictColor, advice;
  if (gapPerJoint < 8) { verdict = "EXCELLENT"; verdictColor = "#7BC474"; advice = "Flat cabinets mount directly tangent. Negligible gap. No filler needed."; }
  else if (gapPerJoint < 15) { verdict = "VERY GOOD"; verdictColor = "#7BC474"; advice = "Flat cabinets work. Use 5mm closed-cell foam strip on cabinet edge for moisture seal."; }
  else if (gapPerJoint < 25) { verdict = "ACCEPTABLE"; verdictColor = "#E5B454"; advice = "Use wedge spacer plates (max ~12mm at edges) behind cabinets. Add aluminum trim filler at front joints."; }
  else if (gapPerJoint < 40) { verdict = "FACETED"; verdictColor = "#E5B454"; advice = "Visible faceting. Recommend smaller cabinet OR custom angled-edge cabinets OR gentler curve."; }
  else { verdict = "SEVERE"; verdictColor = "#E26464"; advice = "Use flexible/soft LED modules OR cabinets fabricated specifically for this radius."; }

  const totalWeight = totalCabs * cabWeight;
  const avgPower = totalCabs * (modPerCab * 25);
  const maxPower = totalCabs * (modPerCab * 70);
  const recommendedSupply = Math.ceil((maxPower * 1.25) / 1000);
  const isOuter = curveType === "outer";
  const cantileverAtCenter = isOuter ? sag : 0;
  const wallContactAtEnds = isOuter ? "Chord endpoints" : "Full arc face";
  const structuralStrategy = isOuter
    ? sag < 300 ? "Bracket cantilever from wall"
      : sag < 700 ? "Floating back-frame + 4-6 wall struts"
        : "Deep back-frame + heavy bracket system"
    : "Direct anchor along curve face into recessed wall";
  const vertPosts = Math.ceil(screenW / 960) + 1;
  const vertPostLen = (screenH + 600) / 1000;
  const horizRails = Math.ceil(screenH / 960) + 1;
  const horizRailLen = screenArcLen / 1000;
  const strutLen = isOuter ? (sag * 6) / 1000 : 0;
  const totalSteelLen = vertPosts * vertPostLen + horizRails * horizRailLen + strutLen;
  const steelWeightKg = Math.round(totalSteelLen * 12);

  return { R, sag, screenStart, cleanFit, cabCountW, cabCountH, cabFitW, cabFitH, totalCabs, modPerCabW, modPerCabH, modFitW, modFitH, modPerCab, totalMods, pxScreenW, pxScreenH, totalPixels, totalArcLen, screenArcLen, cabAngleDeg, gapPerJoint, verdict, verdictColor, advice, totalWeight, avgPower, maxPower, recommendedSupply, steelWeightKg, cantileverAtCenter, wallContactAtEnds, structuralStrategy, vertPosts, horizRails, isOuter };
}
