FACE.panic = { eye: ["shock", "shock"], brow: [-6, -5], mouth: "wave" };
FACE.snore = { eye: ["dash", "dash"], brow: [0, -1], mouth: "o" };
FACE.stubborn = { eye: ["lid", "lid"], brow: [4, -3], mouth: "frown" };
FACE.squint = { eye: ["slit", "slit"], brow: [3, -2], mouth: "dash" };
FACE.yawn = { eye: ["squeeze", "squeeze"], brow: [-4, -2], mouth: "O" };

// ---------------- Roman-era cast (our own designs), built on the Pen / blob / face helpers above ----------------
const STEEL = "#aeb6bf", BRASS = "#d9a845", LEATHER = "#7a4a2a";
export const OUTFITS = {
  legion: { tunic: "#b8322f", cape: "#8f2228", skin: SKIN, helmet: true, armor: true, spear: true, shield: true },
  old: { tunic: "#9c4a3c", cape: "#6e3330", skin: "#f3d6bb", helmet: "old", armor: true, spear: true, shield: false, beard: "#f4f1ea", brows: "#f4f1ea" },
  toga: { tunic: "#f1ead8", skin: "#f5c9a0", toga: "#6b3c8f", hair: "#3b2a20", stout: true },
  civA: { tunic: "#4f7fb8", skin: "#f5c9a0", hair: "#5a3b2a" },
  civB: { tunic: "#d9a441", skin: SKIN, hair: "#2b211c", dress: "#c25a7a" },
  civC: { tunic: "#5d8a3a", skin: "#c99067", hair: "#1e1714", stout: true },
  workA: { tunic: "#8a5d3b", skin: "#f5c9a0", cap: "#c2733a", apron: "#d8c9a6" },
  workB: { tunic: "#3f6a6f", skin: "#ecd0b6", cap: "#5b4a8a", moustache: "#4a3020" },
  CRIADOR: { tunic: "#743eb3", pants: "#314f78", skin: "#e9b58f", hair: "#292135", hoodie: true, headphones: true },
  CRIADOR_MINER: { tunic: "#743eb3", pants: "#314f78", skin: "#e9b58f", hair: "#292135", hoodie: true, headphones: true, hardhat: true },
  MINEIRO: { tunic: "#e97b2f", pants: "#b96b36", skin: "#dca57d", hair: "#493324", overalls: true, hardhat: true },
  MINEIRO_B: { tunic: "#d88335", pants: "#8b6d45", skin: "#ba7d59", hair: "#322820", beard: "#513626", overalls: true, hardhat: true },
  MINEIRO_C: { tunic: "#f09b3a", pants: "#646b6a", skin: "#e4c39f", hair: "#53372c", overalls: true, hardhat: true },
  RH: { tunic: "#777e89", pants: "#4e5660", skin: "#ebbb9c", hair: "#392c2d", suit: true, glasses: true },
  CLAUDE_BOT: { bot: true, tunic: "#d9773f", body: "#d9773f", screen: "#f6ead8" },
};

/** galea: iron bowl, brass brow band, cheek guards, transverse red crest */
const galea = (p, H, cx, hc, light, thick, ow, old, u) => {
  const crest = old ? "#8d4b3f" : "#d2372f", bowl = old ? "#8f8a7e" : STEEL;
  // crest (behind the bowl top)
  const cy0 = hc - H.b * 0.98;
  const cr = ellPts(cx, cy0, 0.66 * 2 * H.a, 0.42 * 2 * H.b, 180, 360, 0, 40);
  cr.push([cx + 0.66 * 2 * H.a * 0.98, cy0 + 4 * u], [cx - 0.66 * 2 * H.a * 0.98, cy0 + 4 * u]);
  const crP = [...ellPts(cx, cy0 + 2 * u, 0.62 * 2 * H.a, 0.36 * 2 * H.b, 180, 360, 0, 40)];
  p.shadedFill(crP, crest, mul(crest, [0.7, 0.62, 0.7]), light, 0.62 * 2 * H.a, 0.3);
  p.clip(crP, () => { for (let i = -9; i <= 9; i++) p.stroke([[cx + i * 7.4 * u, cy0], [cx + i * 9.4 * u, cy0 - 0.62 * H.b * Math.cos(i / 11)]], 1.4 * u, mul(crest, [0.62, 0.55, 0.62])); });
  if (old) p.clip(crP, () => { for (let i = 0; i < 6; i++) p.ell(cx + (i - 3) * 22 * u, cy0 - 18 * u - (i % 2) * 10 * u, 9 * u, 5 * u, "#6f6a5e", 0); });
  p.inkRing(crP, ow * 0.85, thick);
  p.poly(rrect(cx - 10 * u, cy0 - 6 * u, cx + 10 * u, cy0 + 6 * u, 3 * u), BRASS, 2 * u);
  // bowl: upper head cap
  const bandY = hc - H.b * 0.42;
  const bp = ellPts(cx, bandY, H.a * 1.05, H.b * 0.66, 180, 360, 0, 48);
  p.shadedFill(bp, bowl, mul(bowl, [0.62, 0.64, 0.72]), light, H.a, 0.4);
  p.clip(bp, () => {
    p.stroke(ellPts(cx - 20 * u, bandY - 0.3 * H.b, 0.25 * H.a, 0.18 * H.b, 200, 300, 0, 16), 4 * u, "#ffffff55");
    if (old) for (let i = 0; i < 9; i++) p.ell(cx + Math.sin(i * 2.3) * 0.8 * H.a, bandY - (0.08 + 0.5 * ((i * 0.37) % 1)) * H.b, (3 + (i % 3) * 2) * u, (2 + (i % 2)) * u, "#8a4b22", 0);
  });
  p.inkRing(bp, ow * 0.9, thick);
  p.band([[cx - H.a * 1.04, bandY], [cx + H.a * 1.04, bandY]], old ? "#a88a4a" : BRASS, 7 * u, 1.8 * u, "round");
  for (const s of [-1, 1]) p.dot(cx + s * 0.55 * H.a, bandY, 2.2 * u, "#fff3c4");
};
const cheeks = (p, H, cx, hc, light, ow, old, u) => {
  const bowl = old ? "#8f8a7e" : STEEL;
  for (const s of [-1, 1]) {
    const x0 = cx + s * 0.78 * H.a, x1 = cx + s * 1.07 * H.a, y0 = hc - H.b * 0.42, y1 = hc + H.b * 0.48;
    const pts = [[x0, y0], [x1, y0], [x1 - s * 0.04 * H.a, y1 - 0.1 * H.b], [x0 + s * 0.06 * H.a, y1], [x0 - s * 0.05 * H.a, (y0 + y1) / 2]];
    p.shadedFill(pts, bowl, mul(bowl, [0.62, 0.64, 0.72]), light, 0.2 * H.a, 0.3);
    p.poly(pts, null, ow * 0.8);
    p.dot((x0 + x1) / 2, (y0 + y1) / 2 - 0.05 * H.b, 2.2 * u, BRASS);
  }
};
const cobweb = (p, cx, cy, r, u) => {
  const g = p.g; g.save(); g.globalAlpha = 0.8;
  for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.05 + 0.9 * i / 6); p.stroke([[cx, cy], [cx + Math.cos(a) * r, cy + Math.sin(a) * r]], 1.1 * u, "#f2f2f2"); }
  for (let k = 1; k <= 4; k++) { const rr = r * k / 4.3, pts = []; for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.05 + 0.9 * i / 6); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } p.stroke(pts, 1 * u, "#f2f2f2"); }
  g.restore();
};

/** CLAUDE_BOT mascot: friendly rounded bean/tablet robot floating on hover jets */
const drawClaudeBot = (p, O, opts = {}) => {
  const {
    expr = "smile",
    look = 0,
    blink = 0,
    tilt = 0,
    headTilt = 0,
    bob = 0,
    light = rad(-120),
    pose = "hang",
    L = null,
    R = null,
  } = opts;

  const cx = 300;
  const sole = 975;
  const thick = thickAngle(light);
  const ow = 12;

  // Arm poses resolution
  const lPose = L || (pose === "cross" ? "cross" : "hang");
  const rPose = R || pose || "hang";
  const isCross = pose === "cross" || lPose === "cross" || rPose === "cross";

  // Bob offset & body center
  const by = (bob || 0) * 28;
  const cy = 645 + by;

  // Tilt rotation
  const totalTilt = tilt + headTilt;
  p.rot = totalTilt ? [rad(totalTilt), cx, cy] : null;

  // Ground shadow (floats above sole=975)
  const g = p.g;
  g.save();
  if (p.rot) {
    p.rot = null;
    p.ell(cx, sole - 10, 95, 14, "#24172626", 0);
    p.rot = totalTilt ? [rad(totalTilt), cx, cy] : null;
  } else {
    p.ell(cx, sole - 10, 95, 14, "#24172626", 0);
  }
  g.restore();

  // Hover jet exhaust flames / thrust (drawn behind body)
  const jetY = cy + 165;
  for (const jx of [cx - 62, cx + 62]) {
    p.ell(jx, jetY + 48, 22, 14, "#48cae430", 0);
    p.ell(jx, jetY + 38, 16, 9, "#48cae4", 0);
    p.ell(jx, jetY + 26, 12, 6, "#90e0ef", 0);
    p.ell(jx, jetY + 15, 7, 4, "#caf0f8ee", 0);
  }

  // Hover jet nozzles
  for (const jx of [cx - 62, cx + 62]) {
    const pod = [
      [jx - 18, jetY - 10],
      [jx + 18, jetY - 10],
      [jx + 24, jetY + 16],
      [jx - 24, jetY + 16],
    ];
    p.poly(pod, "#4a5568", 6);
    p.stroke([[jx - 24, jetY + 16], [jx + 24, jetY + 16]], 6, "#2d3748");
    p.ell(jx, jetY + 16, 19, 5, "#1a202c", 2.5);
  }

  // Antenna behind/on top of head
  const topY = cy - 165;
  const tipX = cx + 8, tipY = topY - 75;
  p.ell(cx, topY + 2, 16, 8, "#b95d2c", 3);
  p.stroke([[cx, topY], [cx + 3, topY - 35], [tipX, tipY]], 6, INK);
  // Glowing tip
  p.dot(tipX, tipY, 26, "#ffd16628");
  p.dot(tipX, tipY, 18, "#ffd16666");
  p.dot(tipX, tipY, 12, "#ffe066");
  p.ell(tipX, tipY, 12, 12, null, 3.5);
  p.dot(tipX - 3, tipY - 3, 3.5, "#ffffff");

  // Stubby arms BEHIND body when not crossed
  const shoulderY = cy - 15;
  const drawStubbyArm = (side, armPose) => {
    const sx = cx + side * 122;
    const sy = shoulderY;
    if (armPose === "wave") {
      const mid = [cx + side * 165, sy - 60];
      const end = [cx + side * 162, sy - 140];
      const pts = curve([sx, sy], mid, end);
      p.stroke(pts, 22, INK);
      p.stroke(pts, 15, "#d9773f");
      p.dot(end[0], end[1], 15, INK);
      p.dot(end[0], end[1], 11, "#d9773f");
      p.stroke([[end[0] - side * 4, end[1] - 8], [end[0] + side * 8, end[1] - 16]], 4, INK);
    } else if (armPose === "point") {
      const mid = [cx + side * 175, sy - 10];
      const end = [cx + side * 225, sy - 15];
      const pts = curve([sx, sy], mid, end);
      p.stroke(pts, 22, INK);
      p.stroke(pts, 15, "#d9773f");
      p.dot(end[0], end[1], 15, INK);
      p.dot(end[0], end[1], 11, "#d9773f");
      p.stroke([[end[0], end[1]], [end[0] + side * 20, end[1] - 2]], 7, INK);
      p.stroke([[end[0], end[1]], [end[0] + side * 20, end[1] - 2]], 4, "#d9773f");
    } else {
      // "hang"
      const mid = [cx + side * 148, sy + 50];
      const end = [cx + side * 140, sy + 100];
      const pts = curve([sx, sy], mid, end);
      p.stroke(pts, 22, INK);
      p.stroke(pts, 15, "#d9773f");
      p.dot(end[0], end[1], 15, INK);
      p.dot(end[0], end[1], 11, "#d9773f");
    }
  };

  if (!isCross) {
    drawStubbyArm(-1, lPose);
    drawStubbyArm(1, rPose);
  }

  // Rounded body: soft bean / tablet
  const bodyW = 130, bodyH = 165;
  const bodyPts = rrect(cx - bodyW, cy - bodyH, cx + bodyW, cy + bodyH, 72);
  p.gradFill(bodyPts, "#d9773f", mul("#d9773f", [0.72, 0.65, 0.7]), light);
  p.inkRing(bodyPts, ow, thick);

  // Subtle curved shoulder highlight
  p.stroke(ellPts(cx - 50, cy - 120, 55, 30, 190, 260, 0, 12), 4, "#ffffff44");

  // Cream face screen
  const screenW = 88, screenH = 62;
  const screenY = cy - 55;
  const screenPts = rrect(cx - screenW, screenY - screenH, cx + screenW, screenY + screenH, 36);
  p.poly(screenPts, "#f6ead8", 9);
  p.stroke([[cx - 62, screenY - screenH + 14], [cx - 32, screenY - screenH + 14]], 3, "#ffffff88");

  // Screen Face expressions
  const lx = clamp((look || 0) * 10, -18, 18);
  const isBlink = blink >= 1 || blink === true;
  const ey = screenY - 5;
  const my = screenY + 26;

  if (isBlink) {
    p.arc(cx - 36 + lx, ey + 2, 11, 7, 200, 340, 4.5);
    p.arc(cx + 36 + lx, ey + 2, 11, 7, 200, 340, 4.5);
    p.arc(cx + lx * 0.5, my, 16, 9, 20, 160, 4.5);
  } else if (expr === "wink") {
    p.dot(cx - 36 + lx, ey, 7, INK);
    p.arc(cx + 36 + lx, ey + 2, 12, 8, 200, 340, 4.5);
    p.arc(cx + 4 + lx * 0.5, my, 18, 11, 15, 155, 4.5);
  } else if (expr === "smug") {
    // Half-lidded eyes + sly smile (taking over)
    p.ell(cx - 36 + lx, ey + 3, 7.5, 6, INK, 0, 0, 180);
    p.stroke([[cx - 48 + lx, ey - 2], [cx - 24 + lx, ey + 2]], 4.5, INK);
    p.ell(cx + 36 + lx, ey + 3, 7.5, 6, INK, 0, 0, 180);
    p.stroke([[cx + 24 + lx, ey + 2], [cx + 48 + lx, ey - 2]], 4.5, INK);
    p.stroke(curve([cx - 16 + lx * 0.5, my + 4], [cx + 4, my + 6], [cx + 24, my - 5]), 4.5, INK);
    p.stroke([[cx + 25 + lx, ey - 12], [cx + 46 + lx, ey - 15]], 3, INK);
  } else if (expr === "serious") {
    p.dot(cx - 36 + lx, ey, 6.5, INK);
    p.dot(cx + 36 + lx, ey, 6.5, INK);
    p.stroke([[cx - 48 + lx, ey - 11], [cx - 24 + lx, ey - 8]], 3.5, INK);
    p.stroke([[cx + 24 + lx, ey - 8], [cx + 48 + lx, ey - 11]], 3.5, INK);
    p.stroke([[cx - 16 + lx * 0.5, my + 2], [cx + 16 + lx * 0.5, my + 2]], 4.5, INK);
  } else {
    // "smile"
    p.dot(cx - 36 + lx, ey, 7, INK);
    p.dot(cx + 36 + lx, ey, 7, INK);
    p.arc(cx + lx * 0.5, my - 2, 16, 11, 20, 160, 4.5);
  }

  // Cute belly indicator light
  p.dot(cx, cy + 85, 4.5, "#48cae4");
  p.ell(cx, cy + 85, 4.5, 4.5, null, 2);

  // Crossed arms IN FRONT OF BODY
  if (isCross) {
    const sxL = cx - 122, sxR = cx + 122;
    const ptsL = curve([sxL, shoulderY], [cx - 40, cy + 50], [cx + 45, cy + 40]);
    p.stroke(ptsL, 22, INK);
    p.stroke(ptsL, 15, "#d9773f");
    p.dot(cx + 45, cy + 40, 15, INK);
    p.dot(cx + 45, cy + 40, 11, "#d9773f");

    const ptsR = curve([sxR, shoulderY], [cx + 45, cy + 60], [cx - 45, cy + 50]);
    p.stroke(ptsR, 22, INK);
    p.stroke(ptsR, 15, "#d9773f");
    p.dot(cx - 45, cy + 50, 15, INK);
    p.dot(cx - 45, cy + 50, 11, "#d9773f");
  }

  p.rot = null;
};

/** CRIADOR in 3/4-to-side profile with walk cycle and reach pose */
const drawCriadorSide = (p, O, opts = {}) => {
  const {
    expr = "neutral",
    blink = 0,
    look = 0,
    seed = 3,
    L = "hang",
    R = "hang",
    pose = 0,
    tilt = 0,
    headTilt = 0,
    bob = 0,
    light = rad(-120),
    step = 0,
    side = 1,
  } = opts;

  const dir = side < 0 ? -1 : 1;
  const isReach = opts.reach || pose === "reach" || L === "reach" || R === "reach";

  const sole = 975;
  const cx = 300;
  const skin = O.skin ?? "#e9b58f";
  const H = { ...headBlob(seed, 118, 0.3 * dir), asym: 0.12 * dir };
  const W = 2 * H.a, HH = 2 * H.b, u = W / 100;
  const thick = thickAngle(light), ow = 5 * u;

  const torsoL = 1.08, legsL = 1.38;
  const legLen = legsL * HH;
  const l1 = legLen * 0.5, l2 = legLen * 0.5;

  // Walk phase 0..1
  const ph = ((step % 1) + 1) % 1;
  const walkBob = (step ? Math.abs(Math.sin(2 * Math.PI * ph)) * 8 * u : 0) + (bob || 0) * HH;
  const torsoBot = sole - legLen - walkBob;
  const chin = torsoBot - torsoL * HH;
  const hc = chin - H.b;
  const hipY = torsoBot - 0.12 * HH;
  const walkLean = (step ? dir * (4 + 3 * Math.cos(4 * Math.PI * ph)) : dir * 2) + (tilt || 0);

  // Stride parameters
  const stride = 72 * u;
  const liftH = 34 * u;

  const calcFoot = (phase) => {
    const c = ((phase % 1) + 1) % 1;
    let dx, h, pitch;
    if (c < 0.5) {
      const s = c / 0.5;
      dx = dir * stride * (0.5 - s);
      h = 0;
      pitch = dir * (s - 0.5) * rad(14);
    } else {
      const s = (c - 0.5) / 0.5;
      dx = dir * -stride * (0.5 - s);
      h = liftH * Math.sin(Math.PI * s);
      pitch = -dir * Math.sin(Math.PI * s) * rad(24);
    }
    return {
      ank: [cx + dx, sole - 4 * u - h],
      pitch,
    };
  };

  const footN = calcFoot(ph);
  const footF = calcFoot((ph + 0.5) % 1);

  const solveKnee = (hip, ank) => {
    const dx = ank[0] - hip[0], dy = ank[1] - hip[1];
    const d = clamp(Math.hypot(dx, dy), 1, l1 + l2 - 0.01);
    const A = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
    const k = Math.atan2(dy, dx) - dir * A;
    return [hip[0] + l1 * Math.cos(k), hip[1] + l1 * Math.sin(k)];
  };

  const drawLeg = (foot, isNear) => {
    const hipX = cx + (isNear ? dir * 3 * u : -dir * 4 * u);
    const hip = [hipX, hipY];
    const knee = solveKnee(hip, foot.ank);
    const pantsCol = isNear ? (O.pants || "#314f78") : mix(O.pants || "#314f78", INK, 0.72);
    const shoeCol = isNear ? "#252d38" : "#19202a";

    p.stroke([hip, knee, foot.ank], 5.8 * u, pantsCol);

    const c = Math.cos(foot.pitch), s = Math.sin(foot.pitch);
    const p0 = [foot.ank[0] - dir * 4 * u * c, foot.ank[1] - dir * 4 * u * s];
    const p1 = [foot.ank[0] + dir * 14 * u * c, foot.ank[1] + dir * 14 * u * s + 0.5 * u];
    p.stroke([p0, p1], 7.5 * u + 3, INK);
    p.stroke([p0, p1], 7.5 * u, shoeCol);
  };

  p.rot = null;

  // 1. Far Leg (behind body)
  drawLeg(footF, false);

  // 2. Far Arm (behind body)
  const armCol = mix(O.tunic || "#743eb3", INK, 0.5);
  const farArmCol = mix(O.tunic || "#743eb3", INK, 0.7);
  const armLen = 0.95 * HH;

  const tcx = cx + dir * 4 * u;
  const T = {
    a: 0.31 * W,
    b: 0.5 * (torsoBot - (chin - 0.22 * HH)),
    nTop: 2.2,
    nBot: 2.5,
    egg: 0.1,
    asym: 0.08 * dir,
    rot: 0,
    noise: 0.006,
    seed: seed + 7,
  };
  const tcy = torsoBot - T.b;

  p.rot = walkLean ? [rad(walkLean), cx, hipY] : null;

  const S_near = [tcx + dir * 0.08 * T.a, chin + 0.15 * HH];
  const S_far = [tcx - dir * 0.12 * T.a, chin + 0.15 * HH];

  if (isReach) {
    const pts = [S_far, [S_far[0] - dir * 22 * u, S_far[1] + 0.28 * HH], [S_far[0] - dir * 30 * u, S_far[1] + 0.55 * HH]];
    p.stroke(curve(pts[0], pts[1], pts[2]), 5.2 * u, farArmCol);
    p.dot(pts[2][0], pts[2][1], 5.5 * u);
  } else if (step) {
    const armSwing = Math.sin(2 * Math.PI * ph) * rad(28) * dir;
    const e = [S_far[0] + Math.sin(armSwing) * armLen * 0.48, S_far[1] + Math.cos(armSwing) * armLen * 0.48];
    const h = [e[0] + Math.sin(armSwing * 1.1) * armLen * 0.48, e[1] + Math.cos(armSwing * 1.1) * armLen * 0.48];
    p.stroke(curve(S_far, e, h), 5.2 * u, farArmCol);
    p.dot(h[0], h[1], 5.5 * u);
  } else {
    const h = [S_far[0] - dir * 4 * u, S_far[1] + 0.9 * HH];
    p.stroke(curve(S_far, [S_far[0] - dir * 2 * u, S_far[1] + 0.45 * HH], h), 5.2 * u, farArmCol);
    p.dot(h[0], h[1], 5.5 * u);
  }

  // 3. Torso (Purple hoodie)
  const tp = blobPts(tcx, tcy, T);
  p.gradFill(tp, O.tunic || "#743eb3", mul(O.tunic || "#743eb3", SH_CLOTH), light);

  const hoodPts = [
    [tcx - dir * 0.15 * T.a, chin + 0.05 * HH],
    [tcx - dir * 0.72 * T.a, chin + 0.12 * HH],
    [tcx - dir * 0.82 * T.a, chin + 0.38 * HH],
    [tcx - dir * 0.32 * T.a, chin + 0.32 * HH],
  ];
  p.poly(hoodPts, O.tunic || "#743eb3", ow * 0.8);

  p.clip(tp, () => {
    p.stroke([[tcx + dir * 0.15 * T.a, torsoBot - 0.24 * HH], [tcx + dir * 0.85 * T.a, torsoBot - 0.21 * HH]], 2.5 * u, "#4f2d78");
    p.stroke([[tcx + dir * 0.35 * T.a, chin + 0.09 * HH], [tcx + dir * 0.32 * T.a, chin + 0.36 * HH]], 2 * u, "#e5d3f3");
  });
  p.inkRing(tp, ow, thick);

  // 4. Near Leg (in front of torso)
  drawLeg(footN, true);

  // 5. Near Arm
  if (isReach) {
    // Stretched forward and down for reaching for the power plug
    const elbow = [S_near[0] + dir * 38 * u, S_near[1] + 0.32 * HH];
    const hand = [S_near[0] + dir * 78 * u, S_near[1] + 0.62 * HH];
    p.stroke(curve(S_near, elbow, hand), 5.2 * u, armCol);
    p.dot(hand[0], hand[1], 5.5 * u);
    p.stroke([[hand[0], hand[1]], [hand[0] + dir * 14 * u, hand[1] + 7 * u]], 2.8 * u);
    p.stroke([[hand[0], hand[1]], [hand[0] + dir * 13 * u, hand[1] + 2 * u]], 2.8 * u);
  } else if (step) {
    const armSwing = -Math.sin(2 * Math.PI * ph) * rad(28) * dir;
    const e = [S_near[0] + Math.sin(armSwing) * armLen * 0.48, S_near[1] + Math.cos(armSwing) * armLen * 0.48];
    const h = [e[0] + Math.sin(armSwing * 1.1) * armLen * 0.48, e[1] + Math.cos(armSwing * 1.1) * armLen * 0.48];
    p.stroke(curve(S_near, e, h), 5.2 * u, armCol);
    p.dot(h[0], h[1], 5.5 * u);
  } else {
    const h = [S_near[0] + dir * 4 * u, S_near[1] + 0.9 * HH];
    p.stroke(curve(S_near, [S_near[0] + dir * 2 * u, S_near[1] + 0.45 * HH], h), 5.2 * u, armCol);
    p.dot(h[0], h[1], 5.5 * u);
  }

  // 6. Head in 3/4-to-side profile
  const hx = cx + dir * 10 * u;
  const hp = blobPts(hx, hc, { ...H, a: H.a * 0.96, b: H.b * 1.0, asym: 0.12 * dir });

  if (O.hair) {
    const hairBlob = blobPts(hx - dir * 4 * u, hc - 0.04 * HH, { ...H, a: H.a * 1.06, b: H.b * 1.07 });
    p.poly(hairBlob, O.hair, 0);
  }

  p.shadedFill(hp, skin, mul(skin, SH_SKIN), light, H.a);
  p.inkRing(hp, ow, thick);

  // Dark messy hair tufts & bangs
  if (O.hair) {
    const cut = hc - 0.08 * HH;
    const hairPts = [
      [hx + dir * 26 * u, cut],
      [hx + dir * 42 * u, cut - 8 * u],
      [hx + dir * 30 * u, cut - 22 * u],
      [hx + dir * 36 * u, cut - 40 * u],
      [hx + dir * 18 * u, hc - H.b * 1.08],
      [hx - dir * 6 * u, hc - H.b * 1.16],
      [hx - dir * 28 * u, hc - H.b * 1.08],
      [hx - dir * 44 * u, hc - H.b * 0.88],
      [hx - dir * 54 * u, hc - H.b * 0.45],
      [hx - dir * 55 * u, hc + H.b * 0.1],
      [hx - dir * 46 * u, hc + H.b * 0.52],
      [hx - dir * 22 * u, hc + H.b * 0.38],
      [hx - dir * 8 * u, cut],
    ];
    p.shadedFill(hairPts, O.hair, mul(O.hair, SH_FELT), light, H.a, 0.35);
    p.poly(hairPts, null, ow * 0.85);
  }

  // Headphones on neck
  if (O.headphones) {
    p.ell(tcx - dir * 6 * u, chin + 0.12 * HH, 13 * u, 17 * u, "#202332", 3 * u, 0, 360, dir * 15);
    p.ell(tcx - dir * 6 * u, chin + 0.12 * HH, 8 * u, 11 * u, "#161824", 0, 0, 360, dir * 15);
    p.band([[tcx - dir * 24 * u, chin + 0.08 * HH], [tcx + dir * 14 * u, chin + 0.15 * HH]], "#242637", 11 * u, 2.5 * u);
  }

  // Nose bump on profile contour
  const nx = hx + dir * (H.a * 0.90), ny = hc + 4 * u;
  p.stroke([
    [nx - dir * 3 * u, ny - 5 * u],
    [nx + dir * 7 * u, ny + 3 * u],
    [nx - dir * 4 * u, ny + 9 * u],
  ], 3.5 * u, INK);

  // Face: one eye & mouth
  const ex = hx + dir * 24 * u, ey = hc - 2 * u;
  const mx = hx + dir * 28 * u, my = hc + 21 * u;

  if (expr === "yawn") {
    p.stroke([
      [ex - dir * 8 * u, ey - 5 * u],
      [ex + dir * 7 * u, ey],
      [ex - dir * 8 * u, ey + 5 * u],
    ], 3.8 * u, INK);
    p.arc(ex, ey - 18 * u, 10 * u, 4 * u, 200, 340, 4 * u);
    p.ell(mx, my, 10 * u, 14 * u, MOUTH, 3.2 * u);
    p.ell(mx + dir * 2 * u, my + 6 * u, 6 * u, 5 * u, TONGUE, 0);
    p.ell(ex - dir * 12 * u, ey + 3 * u, 2.5 * u, 3.5 * u, "#9fd4ff", 1.5 * u);
  } else {
    const F = FACE[expr] || FACE.neutral;
    const kind = eyeKind(F.eye[1], lidOf(blink));
    eye(p, kind, ex, ey, u, dir, dir * 0.6, skin);
    const by = ey - 20 * u, [dI, dO] = F.brow;
    if (kind === "shock" || kind === "shockHalf") {
      p.arc(ex, by - 6 * u, 9 * u, 3 * u, 200, 340, 4 * u);
    } else {
      taper(p, [ex + dir * 8 * u, by + dI * u], [ex - dir * 7 * u, by - u + dO * u], 5 * u, 2.5 * u);
    }
    mouth(p, F.mouth, mx, my, u, 0.62 * dir);
  }

  p.rot = null;
};

/** front-facing Roman-era character. opts: expr, blink, look, facing, seed, L/R arm poses, tilt, headTilt, bob, nohelmet, light */
export const romanFront = (p, key, opts = {}) => {
  const O = typeof key === "string" ? OUTFITS[key] : key;
  if (!O) return;
  if (key === "CLAUDE_BOT" || O.bot) {
    drawClaudeBot(p, O, opts);
    return;
  }
  const sideVal = Number(opts.side);
  if (sideVal === -1 || sideVal === 1) {
    drawCriadorSide(p, O, opts);
    return;
  }
  const { expr = "neutral", blink = 0, look = 0, facing = 0, seed = 3, L = "hang", R = (opts.reach || opts.pose === "reach" ? "reach" : O.spear ? "spear" : "hang"), tilt = 0, headTilt = 0,
    bob = 0, nohelmet = false, light = rad(-120), web = false, step = 0 } = opts;
  const lid = lidOf(blink), skin = O.skin ?? SKIN;
  const H = headBlob(seed, 118, facing), W = 2 * H.a, HH = 2 * H.b, u = W / 100;
  const torsoL = O.stout ? 1.12 : 1.08, legsL = 1.38, sole = 975;
  const torsoBot = sole - legsL * HH - bob * HH, chin = torsoBot - torsoL * HH, hc = chin - H.b, hipY = torsoBot - 0.12 * HH;
  const thick = thickAngle(light), ow = 5 * u, cx = 300;
  const legCol = O.pants || mix(O.tunic, INK, 0.62), armCol = mix(O.tunic, INK, 0.5);
  const helmet = !!O.helmet && !nohelmet, old = O.helmet === "old";
  p.rot = null;
  // ---- cape behind everything ----
  if (O.cape) {
    const cp = [[cx - 0.48 * W, chin + 0.08 * HH], [cx + 0.48 * W, chin + 0.08 * HH], [cx + 0.62 * W, sole - 0.55 * HH], [cx + 0.2 * W, sole - 0.45 * HH], [cx - 0.2 * W, sole - 0.5 * HH], [cx - 0.62 * W, sole - 0.55 * HH]];
    p.gradFill(cp, O.cape, mul(O.cape, [0.6, 0.6, 0.7]), light); p.inkRing(cp, ow * 0.8, thick);
  }
  // ---- legs ----
  const dress = !!O.dress;
  for (const side of [-1, 1]) {
    const up = Math.max(0, Math.sin(Math.PI * 2 * (step + (side > 0 ? 0.5 : 0)))) * 30 * (step ? 1 : 0);
    const hx = cx + side * 16 * u, fx = cx + side * 22 * u, fy = sole - 4 * u - up;
    p.stroke(curve([hx, hipY], [(hx + fx) / 2 + side * 2 * u, (hipY + fy) / 2], [fx, fy]), 5.8 * u, legCol);
    const sandal = O.pants ? "#252d38" : O.helmet ? LEATHER : "#5a3b2a";
    p.stroke([[fx - side * 3 * u, fy], [fx + side * 13 * u, fy + 0.5 * u]], 7.5 * u + 3, INK);
    p.stroke([[fx - side * 3 * u, fy], [fx + side * 13 * u, fy + 0.5 * u]], 7.5 * u, sandal);
    if (O.helmet) for (let k = 1; k <= 3; k++) p.stroke([[fx - 4 * u, fy - k * 0.07 * HH], [fx + 4 * u, fy - k * 0.07 * HH - 2 * u]], 2 * u, LEATHER);
  }
  // ---- upper body ----
  p.rot = tilt ? [rad(tilt), cx, hipY] : null;
  const T = { a: (0.4 * W) / 1.06 * (O.stout ? 1.12 : 1), b: 0.5 * (torsoBot - (chin - 0.25 * HH)), nTop: 2.2, nBot: 2.6, egg: O.stout ? 0.17 : 0.12, asym: 0.04 * facing, rot: 0, noise: 0.006, seed: seed + 7 };
  const tcx = cx + 3 * u * facing, tcy = torsoBot - T.b, tp = blobPts(tcx, tcy, T);
  const S = (side) => [tcx + side * 0.85 * T.a, chin + 0.12 * HH];
  const arm = (side, pose) => {
    const s = S(side), X = (k) => tcx + side * (T.a * 1.1 + k * u);
    switch (pose) {
      case "spear": return { pts: [s, [X(6), s[1] + 0.42 * HH], [X(10), s[1] + 0.2 * HH]], front: false };
      case "point": return { pts: [s, [X(28), s[1] - 0.02 * HH], [X(62), s[1] - 0.1 * HH]], front: false, finger: true };
      case "up": return { pts: [s, [X(14), s[1] - 0.3 * HH], [X(22), s[1] - 0.75 * HH]], front: false };
      case "wave": return { pts: [s, [X(16), s[1] - 0.2 * HH], [X(30 + 10 * Math.sin(opts.wv || 0)), s[1] - 0.62 * HH]], front: false };
      case "hip": return { pts: [s, [X(22), s[1] + 0.3 * HH], [tcx + side * T.a * 0.95, torsoBot - 0.3 * HH]], front: false };
      case "belly": return { pts: [s, [X(8), s[1] + 0.45 * HH], [tcx + side * 0.25 * T.a, torsoBot - 0.35 * HH]], front: true };
      case "temple": return { pts: [s, [X(26), s[1] + 0.05 * HH], [cx + side * (H.a + 16 * u), hc - 0.1 * HH]], front: false, swirl: true };
      case "lift": return { pts: [s, [X(20), s[1] - 0.25 * HH], [X(4), s[1] - 0.82 * HH]], front: false };
      case "shield": return { pts: [s, [X(4), s[1] + 0.4 * HH], [tcx + side * 0.6 * T.a, torsoBot - 0.1 * HH]], front: true };
      case "cross": return { pts: [s, [X(2), s[1] + 0.38 * HH], [tcx - side * 0.45 * T.a, s[1] + 0.32 * HH]], front: true };
      case "reach": {
        if (opts.lift) { const lf = opts.lift * 0.62 * HH; return { pts: [s, [X(42), s[1] - 0.12 * HH - lf * 0.6], [X(82), s[1] - 0.5 * HH - lf]], front: false }; }
        return { pts: [s, [X(28), s[1] + 0.35 * HH], [X(46), s[1] + 0.68 * HH]], front: true, finger: true };
      }
      case "cheek": return { pts: [s, [X(16), s[1] + 0.05 * HH], [cx + side * (H.a + 2 * u), hc + 0.25 * H.b]], front: false };
      case "thumb": return { pts: [s, [X(20), s[1] + 0.12 * HH], [X(44), s[1] - 0.12 * HH]], front: false, thumb: true };
      default: return { pts: [s, [X(4), s[1] + 0.48 * HH], [X(3), chin + 1.04 * HH]], front: false };
    }
  };
  const arms = [arm(-1, L), arm(1, R)];
  const drawArm = (a) => {
    p.stroke(curve(a.pts[0], a.pts[1], a.pts[2]), 5.2 * u, armCol);
    const [hx, hy] = a.pts[2];
    p.dot(hx, hy, 5.5 * u);
    if (a.finger) { const dx = a.pts[2][0] - a.pts[1][0], dy = a.pts[2][1] - a.pts[1][1], l = Math.hypot(dx, dy); p.stroke([[hx, hy], [hx + dx / l * 14 * u, hy + dy / l * 14 * u]], 2.6 * u); }
    if (a.thumb) p.stroke([[hx, hy], [hx + Math.sign(hx - cx) * 6 * u, hy - 12 * u]], 2.6 * u);
  };
  // spear behind
  if (O.spear && R === "spear") {
    const [hx, hy] = arms[1].pts[2], s0 = [hx + 2 * u, sole - 2 * u], s1 = [hx - 3 * u, 70];
    p.band([s0, s1], old ? "#6d5236" : "#8a5a34", 4.2 * u, 1.4 * u, "round");
    const tip = [[s1[0] - 7 * u, s1[1] + 6 * u], [s1[0], s1[1] - 34 * u], [s1[0] + 7 * u, s1[1] + 6 * u], [s1[0], s1[1] + 14 * u]];
    p.poly(tip, old ? "#8b7c6a" : "#c9cfd6", 2 * u);
    if (web) cobweb(p, s1[0] - 2 * u, s1[1] + 60 * u, 70 * u, u);
  }
  for (const a of arms) if (!a.front) drawArm(a);
  // torso
  if (dress) {
    const D = { a: 0.5 * W * 0.98, b: 0.5 * ((sole - 0.35 * HH) - (chin - 0.2 * HH)), nTop: 2.0, nBot: 3.0, egg: 0.35, asym: 0, rot: 0, noise: 0.006, seed: seed + 9 };
    const dp = blobPts(cx, sole - 0.35 * HH - D.b, D);
    p.gradFill(dp, O.dress, mul(O.dress, SH_CLOTH), light); p.inkRing(dp, ow, thick);
  }
  // skirt / pteruges below the torso
  if (!dress) {
    const sk = [[tcx - 0.92 * T.a, torsoBot - 0.2 * HH], [tcx + 0.92 * T.a, torsoBot - 0.2 * HH], [tcx + 1.0 * T.a, torsoBot + 0.3 * HH], [tcx - 1.0 * T.a, torsoBot + 0.3 * HH]];
    p.gradFill(sk, O.tunic, mul(O.tunic, SH_CLOTH), light); p.poly(sk, null, ow * 0.8);
    if (O.armor) for (let i = -3; i <= 3; i++) { const x = tcx + i * 0.27 * T.a, st = [[x - 9 * u, torsoBot - 0.05 * HH], [x + 9 * u, torsoBot - 0.05 * HH], [x + 9 * u, torsoBot + 0.22 * HH], [x - 9 * u, torsoBot + 0.22 * HH]]; p.poly(st, old ? "#5e4632" : LEATHER, 1.6 * u); }
  }
  p.gradFill(tp, O.tunic, mul(O.tunic, SH_CLOTH), light);
  p.clip(tp, () => {
    if (O.armor) {
      const top = chin - 0.1 * HH, bot = torsoBot - 0.25 * HH, n = 5;
      for (let i = 0; i < n; i++) {
        const y0 = top + (bot - top) * i / n, y1 = top + (bot - top) * (i + 1) / n;
        const c = old ? (i % 2 ? "#8d8679" : "#9a9384") : (i % 2 ? "#a7b0ba" : "#bcc4cc");
        p.poly([[tcx - 1.5 * T.a, y0], [tcx + 1.5 * T.a, y0 + 3 * u], [tcx + 1.5 * T.a, y1 + 3 * u], [tcx - 1.5 * T.a, y1]], c, 1.8 * u);
      }
      p.band([[tcx - 1.4 * T.a, torsoBot - 0.2 * HH], [tcx + 1.4 * T.a, torsoBot - 0.2 * HH]], LEATHER, 0.08 * HH, 1.5 * u);
      for (let i = -2; i <= 2; i++) p.dot(tcx + i * 0.3 * T.a, torsoBot - 0.2 * HH, 2.4 * u, BRASS);
      if (old) for (let i = 0; i < 5; i++) p.ell(tcx + Math.sin(i * 1.7) * 0.7 * T.a, top + (bot - top) * ((i * 0.31) % 1), 6 * u, 3 * u, "#8a4b22", 0);
    } else {
      p.band([[tcx - 1.4 * T.a, torsoBot - 0.24 * HH], [tcx + 1.4 * T.a, torsoBot - 0.24 * HH]], O.apron ? "#5a3b2a" : "#e2c27a", 0.05 * HH, 1.2 * u);
      if (O.toga) p.band([[tcx - 1.0 * T.a, chin - 0.1 * HH], [tcx + 1.1 * T.a, torsoBot - 0.1 * HH]], O.toga, 0.16 * HH, 1.6 * u);
      if (O.apron) p.poly([[tcx - 0.55 * T.a, torsoBot - 0.2 * HH], [tcx + 0.55 * T.a, torsoBot - 0.2 * HH], [tcx + 0.6 * T.a, torsoBot + 0.2 * HH], [tcx - 0.6 * T.a, torsoBot + 0.2 * HH]], O.apron, 1.6 * u);
      p.stroke([[tcx - 0.2 * T.a, chin + 0.02 * HH], [tcx, chin + 0.16 * HH], [tcx + 0.2 * T.a, chin + 0.02 * HH]], 2 * u);
    }
  });
  p.inkRing(tp, ow, thick);
  if (O.overalls) {
    p.band([[tcx - .55*T.a, chin+.04*HH],[tcx-.42*T.a,torsoBot-.12*HH]], "#f6b34d", 8*u, 2*u);
    p.band([[tcx + .55*T.a, chin+.04*HH],[tcx+.42*T.a,torsoBot-.12*HH]], "#f6b34d", 8*u, 2*u);
    p.poly(rrect(tcx-.28*T.a,torsoBot-.48*HH,tcx+.28*T.a,torsoBot-.28*HH,3*u),"#b45d2f",2*u);
  }
  if (O.hoodie) {
    p.stroke([[tcx-.18*T.a,chin+.08*HH],[tcx-.13*T.a,chin+.36*HH]],2*u,"#e5d3f3");
    p.stroke([[tcx+.18*T.a,chin+.08*HH],[tcx+.13*T.a,chin+.36*HH]],2*u,"#e5d3f3");
    p.stroke([[tcx-.35*T.a,torsoBot-.2*HH],[tcx+.35*T.a,torsoBot-.2*HH]],2*u,"#4f2d78");
  }
  if (O.suit) {
    p.poly([[tcx-.27*T.a,chin],[tcx,chin+.58*HH],[tcx-.06*T.a,chin+.15*HH]],"#e9ebec",2*u);
    p.poly([[tcx+.27*T.a,chin],[tcx,chin+.58*HH],[tcx+.06*T.a,chin+.15*HH]],"#e9ebec",2*u);
    p.poly([[tcx,chin+.13*HH],[tcx+5*u,chin+.34*HH],[tcx,chin+.62*HH],[tcx-5*u,chin+.34*HH]],"#c4353c",1.5*u);
  }
  if (O.headphones) { p.band([[cx-42*u,chin+.1*HH],[cx+42*u,chin+.1*HH]],"#242637",12*u,3*u); for(const side of [-1,1]) p.ell(cx+side*42*u,chin+.1*HH,10*u,14*u,"#202332",2*u); }
  if (O.armor) for (const s of [-1, 1]) { // shoulder plates
    const sp = ellPts(tcx + s * 0.72 * T.a, chin + 0.1 * HH, 0.42 * T.a, 0.13 * HH, 180, 360, s * 8, 20);
    p.poly(sp, old ? "#9a9384" : "#c5ccd3", 1.8 * u);
  }
  if (O.moss) {/* reserved */}
  for (const a of arms) if (a.front) drawArm(a);
  // shield in front, held by the left hand
  if (O.shield && L === "shield") {
    const sx = tcx - 0.55 * T.a, sy = torsoBot + 0.05 * HH, sw = 0.36 * W, sh = 0.78 * HH;
    const sp = rrect(sx - sw, sy - sh, sx + sw, sy + sh, 8 * u);
    p.gradFill(sp, "#c0302c", "#7d1d22", light);
    p.clip(sp, () => {
      p.band([[sx - sw, sy], [sx + sw, sy]], BRASS, 6 * u, 1.2 * u);
      p.band([[sx, sy - sh], [sx, sy + sh]], BRASS, 6 * u, 1.2 * u);
      for (const s of [-1, 1]) { p.stroke([[sx + s * 12 * u, sy - 14 * u], [sx + s * 34 * u, sy - 46 * u], [sx + s * 22 * u, sy - 44 * u], [sx + s * 46 * u, sy - 74 * u]], 3.5 * u, BRASS); p.stroke([[sx + s * 12 * u, sy + 14 * u], [sx + s * 34 * u, sy + 46 * u], [sx + s * 22 * u, sy + 44 * u], [sx + s * 46 * u, sy + 74 * u]], 3.5 * u, BRASS); }
      p.stroke(ellPts(sx - sw * 0.5, sy - sh * 0.7, sw * 0.3, sh * 0.1, 200, 320, 0, 10), 3 * u, "#ffffff44");
    });
    p.ell(sx, sy, 13 * u, 13 * u, "#e6c068", 2.2 * u);
    p.inkRing(sp, ow, thick);
  }
  // ---- head ----
  const [cpx, cpy] = rotAbout([cx, chin], rad(tilt), [cx, hipY]);
  const Ah = tilt + headTilt;
  p.rot = Ah ? [rad(Ah), cx, chin, cpx - cx, cpy - chin] : null;
  if (helmet) galea(p, H, cx, hc, light, thick, ow, old, u);
  const hp = blobPts(cx, hc, H);
  if (O.hair && !helmet) { const hb = blobPts(cx, hc - 0.03 * HH, { ...H, a: H.a * 1.04, b: H.b * 1.05 }); p.poly(hb, O.hair, 0); }
  p.shadedFill(hp, skin, mul(skin, SH_SKIN), light, H.a);
  p.inkRing(hp, ow, thick);
  if (helmet) {
    const bandY = hc - H.b * 0.42, bp = ellPts(cx, bandY, H.a * 1.05, H.b * 0.66, 180, 360, 0, 48);
    p.shadedFill(bp, old ? "#8f8a7e" : STEEL, mul(old ? "#8f8a7e" : STEEL, [0.62, 0.64, 0.72]), light, H.a, 0.4);
    p.clip(bp, () => { p.stroke(ellPts(cx - 20 * u, bandY - 0.3 * H.b, 0.25 * H.a, 0.18 * H.b, 200, 300, 0, 16), 5 * u, "#ffffff66");
      if (old) for (let i = 0; i < 9; i++) p.ell(cx + Math.sin(i * 2.3) * 0.8 * H.a, bandY - (0.08 + 0.5 * ((i * 0.37) % 1)) * H.b, (4 + (i % 3) * 2) * u, (2.5 + (i % 2)) * u, "#8a4b22", 0); });
    p.poly(bp, null, ow * 0.9);
    p.band([[cx - H.a * 1.05, bandY], [cx + H.a * 1.05, bandY]], old ? "#a88a4a" : BRASS, 7 * u, 1.8 * u, "round");
    p.poly(rrect(cx - 4 * u, bandY - 0.55 * H.b, cx + 4 * u, bandY - 3 * u, 2 * u), old ? "#a88a4a" : BRASS, 1.5 * u);
    cheeks(p, H, cx, hc, light, ow, old, u);
  } else if (O.cap) hatOn(p, { hat: "cap", cap: O.cap, jacket: O.tunic }, hp, H, cx, hc, light, seed, facing, false);
  else if (O.hair) hatOn(p, { hat: "hair", hair: O.hair, jacket: O.tunic }, hp, H, cx, hc, light, seed, facing, false);
  else if (O.helmet && nohelmet) { // bald old head with white side tufts
    for (const s of [-1, 1]) p.ell(cx + s * 0.9 * H.a, hc - 0.1 * H.b, 0.22 * H.a, 0.3 * H.b, "#f4f1ea", 3 * u);
  }
  if (O.beard) {
    const bd = blobPts(cx + 6 * u * facing, hc + 0.85 * H.b, { a: 0.62 * H.a, b: 0.75 * H.b, nTop: 2.4, nBot: 1.6, egg: -0.35, asym: 0, rot: 0, noise: 0.02, seed: seed + 4 });
    p.shadedFill(bd, O.beard, mul(O.beard, [0.86, 0.86, 0.92]), light, 0.6 * H.a, 0.3);
    p.clip(bd, () => { for (let i = -3; i <= 3; i++) p.stroke([[cx + i * 9 * u, hc + 0.45 * H.b], [cx + i * 7 * u, hc + 1.35 * H.b]], 1.2 * u, "#c9c4bb"); });
    p.inkRing(bd, ow * 0.8, thick);
  }
  faceFront(p, cx, hc, W, expr, facing, look, lid, helmet, skin, O.beard ? O.beard : O.moustache, !!O.stout);
  if (expr === "yawn") {
    const fmx = cx + 8 * u * facing, fmy = hc + 22 * u;
    p.ell(fmx, fmy + 5 * u, 5 * u, 3.5 * u, TONGUE, 0);
    p.ell(cx + 26 * u, hc + 2 * u, 2.5 * u, 3.5 * u, "#9fd4ff", 1.5 * u);
  }
  if (O.hardhat) {
    p.ell(cx,hc-H.b*.78,H.a*1.12,H.b*.36,"#f2c83c",ow*.8);
    p.band([[cx-H.a*1.15,hc-H.b*.55],[cx+H.a*1.15,hc-H.b*.55]],"#e5a921",9*u,2*u);
    p.ell(cx,hc-H.b*.78,15*u,15*u,"#fff5bc",3*u);
    if (key === "CRIADOR_MINER") p.dot(cx,hc-H.b*.78,6*u,"#fffadb");
  }
  if (O.glasses || opts.sunglasses) {
    const col = opts.sunglasses ? "#202632" : "#ced9e5";
    for(const side of [-1,1]) p.ell(cx+side*18*u,hc-8*u,17*u,12*u,col,3*u);
    p.stroke([[cx-2*u,hc-8*u],[cx+2*u,hc-8*u]],3*u,"#252330");
  }
  if (opts.prop === "pickaxe") {
    // Keep the whole tool beside its owner, clear of the torso and neighbours.
    const hx=cx+94*u, hy=torsoBot-.13*HH;
    p.band([[hx+8*u,hy+8*u],[hx+13*u,sole-15*u]],"#7a5430",7*u,2*u,"round");
    p.poly([[hx-32*u,hy+7*u],[hx-17*u,hy-7*u],[hx+4*u,hy-11*u],
      [hx+26*u,hy-7*u],[hx+40*u,hy+7*u],[hx+19*u,hy+1*u],
      [hx-8*u,hy+2*u]],"#87929d",3*u);
    p.stroke([[hx-24*u,hy+3*u],[hx+2*u,hy-7*u],[hx+26*u,hy-3*u]],3*u,"#d9e1e5");
  }
  if (opts.prop === "clipboard") {
    p.poly(rrect(cx+25*u,chin+.5*HH,cx+68*u,chin+1.07*HH,3*u),"#9d7546",3*u);
    p.poly(rrect(cx+29*u,chin+.57*HH,cx+64*u,chin+1.0*HH,2*u),"#f8f1dc",1*u);
    for(let i=0;i<3;i++) p.stroke([[cx+35*u,chin+(.67+i*.1)*HH],[cx+58*u,chin+(.67+i*.1)*HH]],2*u,"#777e89");
  }
  if (opts.sign) {
    const sx=cx+75*u, sy=hc-1.12*HH;
    p.band([[sx,sy+30*u],[sx,sole]],"#835b32",6*u,2*u);
    p.poly(rrect(sx-62*u,sy-27*u,sx+62*u,sy+28*u,7*u),"#f3e9ce",4*u);
    const g=p.g; g.save(); g.fillStyle="#612d34"; g.textAlign="center"; g.textBaseline="middle"; g.font=`900 ${opts.sign.length>8?34:43}px Arial`; g.fillText(opts.sign,sx,sy); g.restore();
  }
  if (O.brows) for (const s of [-1, 1]) p.ell(cx + 7 * u * facing + s * 14 * u, hc - 20 * u, 11 * u, 5 * u, O.brows, 2 * u);
  if (O.beard) { // re-draw the mouth over the beard for open mouths
    if (expr === "shock" || expr === "snore") p.ell(cx + 8 * u * facing, hc + 22 * u, 6 * u, 7 * u, "#5a1e28", 2 * u);
  }
  p.rot = null;
  if (arms.some((a) => a.swirl)) { // cuckoo swirl next to the temple
    const a = arms.find((x) => x.swirl), [hx, hy] = a.pts[2], ph = opts.swirl || 0, pts = [];
    for (let i = 0; i < 40; i++) { const t = i / 40 * Math.PI * 4 + ph, r = (4 + i * 0.7) * u; pts.push([hx + Math.cos(t) * r, hy - 40 * u + Math.sin(t) * r]); }
    p.stroke(pts, 3 * u, "#ffffff"); p.stroke(pts, 1.4 * u, INK);
  }
};

/** loose helmet prop card (lifted off the old soldier) */
export const helmetCard = (p) => {
  const H = headBlob(3, 118, 0), u = 2 * H.a / 100, hc = 560, light = rad(-120), thick = thickAngle(light), ow = 5 * u;
  galea(p, H, 300, hc, light, thick, ow, true, u);
  const bandY = hc - H.b * 0.42, bp = ellPts(300, bandY, H.a * 1.05, H.b * 0.66, 180, 360, 0, 48);
  // dark inside visible from below
  p.ell(300, bandY, H.a * 1.05, 0.12 * H.b, "#2a221e", 0);
  p.shadedFill(bp, "#8f8a7e", mul("#8f8a7e", [0.62, 0.64, 0.72]), light, H.a, 0.4);
  p.clip(bp, () => { for (let i = 0; i < 9; i++) p.ell(300 + Math.sin(i * 2.3) * 0.8 * H.a, bandY - (0.08 + 0.5 * ((i * 0.37) % 1)) * H.b, (4 + (i % 3) * 2) * u, (2.5 + (i % 2)) * u, "#8a4b22", 0); });
  p.poly(bp, null, ow * 0.9);
  p.band([[300 - H.a * 1.05, bandY], [300 + H.a * 1.05, bandY]], "#a88a4a", 7 * u, 1.8 * u, "round");
  cheeks(p, H, 300, hc, light, ow, true, u);
};

/** ZZZ for the sleeping guard */
export const fxZ = (p, t) => {
  const g = p.g; g.save(); g.font = "900 120px Arial Black, Arial"; g.lineJoin = "round";
  for (let i = 0; i < 3; i++) {
    const k = (t + i / 3) % 1, x = 220 + i * 70 + Math.sin(k * 6) * 20, y = 700 - k * 500, s = 0.5 + k * 0.7;
    g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = Math.min(1, (1 - k) * 2.5);
    g.lineWidth = 16; g.strokeStyle = INK; g.strokeText("Z", 0, 0); g.fillStyle = "#ffffff"; g.fillText("Z", 0, 0); g.restore();
  }
  g.restore();
};
/** falling leaf */
export const fxLeaf = (p, col) => { p.poly([[300, 380], [420, 470], [300, 620], [180, 470]], col, 14); p.stroke([[300, 400], [300, 600]], 8); };
/** dust cloud puff (k 0..1 growth) */
export const fxDust = (p, k, col = "#e8dcc4") => {
  const g = p.g; g.save(); g.globalAlpha = Math.max(0, 1 - k * k);
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2, r = 90 + 150 * k; p.ell(300 + Math.cos(a) * r, 520 + Math.sin(a) * r * 0.6, 120 + 60 * k, 100 + 50 * k, col, 12); }
  p.ell(300, 520, 170 + 110 * k, 140 + 80 * k, col, 0);
  g.restore();
};
export const fxDrip = (p) => p.ell(300, 500, 40, 64, "#9fd4ff", 10);
export const fxWood = (p, seed) => { p.poly([[200, 420], [400, 400], [420, 560], [230, 600]], "#5b3d22", 14); p.stroke([[240, 450], [380, 440]], 6, "#3a2614"); p.ell(330, 520, 26, 18, "#4d7a32", 0); };

export const headCenter = (seed = 3) => { const H = headBlob(seed, 118, 0), HH = 2 * H.b; return 975 - 1.38 * HH - 1.08 * HH - H.b; };
