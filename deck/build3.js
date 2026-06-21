// build3.js — v22 "Follow-Along Manual" deck builder
// Prototype: HOW TO 1 only, per REDESIGN_SPEC.md
// One step per page, biggest possible type, full button-by-button walkthrough,
// AI answers written as flowing essay paragraphs (not bullets).
const pptxgen = require("pptxgenjs");
const QRCode = require("qrcode");
const sharp = require("sharp");
const path = require("path");
const { buildIcons } = require("./icons.js");

const P = {
  bg: "F4ECDA", panel: "EFE4CD", card: "FFFFFF", cardAlt: "FBF6EC", border: "E0D3B8",
  ink: "2B2A26", ink2: "514C42", muted: "8A8170",
  d5: "0E7490", d5t: "E1EEF1",
  d1: "B45309", d1t: "FAF0DA",
  d2: "7C3AED", d2t: "EFE9FB",
  d3: "B91C1C", d3t: "FBE6E6",
  d4: "0E7A55", d4t: "E1F1E9",
  d6: "1D4ED8", d6t: "E2EAFB",
  d7: "4B3F72", d7t: "E9E5F3",
  green: "0E7A55", greenT: "E6F3EC", greenBd: "BCDFC9",
  amber: "B45309", amberT: "FAF0DA", amberBd: "EAD6A2",
  red: "B91C1C", cap: "38332B", capt: "ECE6D8", gold: "D9A441",
};
const F = "Arial";
const W = 13.333, H = 7.5;

let pres = new pptxgen();
pres.defineLayout({ name: "W", width: W, height: H });
pres.layout = "W";
pres.author = "AI for SME";
pres.title = "AI สำหรับ SME ส่งออก-นำเข้า — คู่มือทำตามทีละขั้น (v22)";
let IC;

function bg(s, c = P.bg) { s.background = { color: c }; }
function shadowSoft() { return { type: "outer", color: "8A7B55", blur: 9, offset: 3, angle: 90, opacity: 0.18 }; }

async function qrPngUrl(url) {
  const d = await QRCode.toDataURL(url, { errorCorrectionLevel: "L", margin: 1, width: 760, color: { dark: "#2B2A26", light: "#FFFFFF" } });
  return d.replace(/^data:/, "");
}
async function qrPng(text) {
  return qrPngUrl("https://chatgpt.com/?q=" + encodeURIComponent(text));
}
const REPO_RAW = "https://raw.githubusercontent.com/skunpoj/krungsri/claude/ai-sme-workshop-handoff-gfde4c/";
function rawUrl(p) { return REPO_RAW + p; }
const PREVIEW_DIR = path.join(__dirname, "assets", "previews");
async function imgDim(relName) {
  const file = path.join(PREVIEW_DIR, relName);
  const meta = await sharp(file).metadata();
  return { file, w: meta.width, h: meta.height };
}
const LIVE_PROOF_DIR = path.join(__dirname, "assets", "live_proof");
async function liveProofDim(relName) {
  const file = path.join(LIVE_PROOF_DIR, relName);
  const meta = await sharp(file).metadata();
  return { file, w: meta.width, h: meta.height };
}

// ── shared chrome ──────────────────────────────────────────────────────────
function topBar(s, A, kicker, stepNum, stepTotal) {
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.86, fill: { color: A }, line: { type: "none" } });
  s.addText(kicker.toUpperCase(), { x: 0.55, y: 0.1, w: 9.5, h: 0.32, fontFace: F, fontSize: 13, bold: true, color: "FFFFFF", charSpacing: 2, align: "left", valign: "middle", margin: 0 });
  if (stepNum) {
    s.addText(`ขั้นที่ ${stepNum} / ${stepTotal}`, { x: 10.3, y: 0.1, w: 2.43, h: 0.32, fontFace: F, fontSize: 13, bold: true, color: "FFFFFF", align: "right", valign: "middle", margin: 0 });
  }
}
function pageFoot(s, text) {
  s.addText(text, { x: 0.55, y: 7.14, w: 12.23, h: 0.3, fontFace: F, fontSize: 10.5, italic: true, color: P.muted, align: "left", valign: "middle", margin: 0 });
}
function stepBadge(s, x, y, A, n) {
  s.addShape(pres.shapes.OVAL, { x, y, w: 0.85, h: 0.85, fill: { color: A }, line: { type: "none" }, shadow: shadowSoft() });
  s.addText(String(n), { x, y, w: 0.85, h: 0.85, fontFace: F, fontSize: 30, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
}

// ── TEMPLATE 1 — howToOpenSlide ─────────────────────────────────────────────
// Opening summary page for a HOW TO: objective / scenario / problem / AI task / expected outcome
function howToOpenSlide(o) {
  const s = pres.addSlide(); bg(s); const A = o.accent;
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 1.5, fill: { color: A }, line: { type: "none" } });
  s.addText(o.kicker || `HOW TO ${o.num}`, { x: 0.55, y: 0.18, w: 6, h: 0.5, fontFace: F, fontSize: 17, bold: true, color: "FFFFFF", charSpacing: 3, align: "left", valign: "middle", margin: 0 });
  s.addText(o.title, { x: 0.55, y: 0.6, w: 12.2, h: 0.82, fontFace: F, fontSize: 32, bold: true, color: "FFFFFF", align: "left", valign: "middle", margin: 0 });

  const blocks = [
    { lab: "วัตถุประสงค์", icon: IC.bulb, txt: o.objective },
    { lab: "สถานการณ์ตอนนี้", icon: IC.file, txt: o.scenario },
    { lab: "ปัญหาคืออะไร", icon: IC.warn, txt: o.problem },
    { lab: "ให้ AI ทำอะไร", icon: IC.checkW, txt: o.aiTask },
    { lab: "ผลลัพธ์ที่คาดหวัง", icon: IC.rocket, txt: o.outcome },
  ];
  const x0 = 0.55, w = 12.23, y0 = 1.74, gap = 0.14;
  const heights = [0.92, 0.92, 0.92, 0.92, 0.92];
  let y = y0;
  blocks.forEach((b, i) => {
    const h = heights[i];
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0, y, w, h, fill: { color: i % 2 === 0 ? P.cardAlt : P.card }, line: { color: P.border, width: 1 }, rectRadius: 0.07, shadow: shadowSoft() });
    s.addImage({ data: b.icon, x: x0 + 0.2, y: y + h / 2 - 0.17, w: 0.34, h: 0.34 });
    s.addText(b.lab, { x: x0 + 0.66, y: y + 0.08, w: 2.3, h: h - 0.16, fontFace: F, fontSize: 15, bold: true, color: A, align: "left", valign: "middle", margin: 0 });
    s.addText(b.txt, { x: x0 + 3.1, y: y + 0.08, w: w - 3.4, h: h - 0.16, fontFace: F, fontSize: 15, color: P.ink, align: "left", valign: "middle", lineSpacingMultiple: 1.08, margin: 0 });
    y += h + gap;
  });
}

// ── TEMPLATE 2 — docStorySlide ──────────────────────────────────────────────
// One page per example document, told as a short story
function docStorySlide(o) {
  const s = pres.addSlide(); bg(s); const A = o.accent;
  topBar(s, A, o.label);
  s.addText(o.docName, { x: 0.55, y: 1.0, w: 12.23, h: 0.62, fontFace: F, fontSize: 26, bold: true, color: P.ink, align: "left", valign: "middle", margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.55, y: 1.78, w: 12.23, h: 1.6, fill: { color: P.cardAlt }, line: { color: P.border, width: 1 }, rectRadius: 0.08, shadow: shadowSoft() });
  s.addText(o.story, { x: 0.82, y: 1.94, w: 11.7, h: 1.3, fontFace: F, fontSize: 16, color: P.ink, align: "left", valign: "middle", lineSpacingMultiple: 1.18, margin: 0 });

  const cw = (12.23 - 0.3 * (o.stats.length - 1)) / o.stats.length;
  o.stats.forEach((st, i) => {
    const x = 0.55 + i * (cw + 0.3);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 3.6, w: cw, h: 1.5, fill: { color: P.card }, line: { color: A, width: 1.25 }, rectRadius: 0.08, shadow: shadowSoft() });
    s.addText(st[0], { x, y: 3.72, w: cw, h: 0.78, fontFace: F, fontSize: 30, bold: true, color: A, align: "center", valign: "middle", margin: 0 });
    s.addText(st[1], { x: x + 0.1, y: 4.48, w: cw - 0.2, h: 0.52, fontFace: F, fontSize: 13, color: P.ink2, align: "center", valign: "middle", lineSpacingMultiple: 1.0, margin: 0 });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.55, y: 5.32, w: 12.23, h: 1.5, fill: { color: P.d5t }, line: { color: A, width: 1.25 }, rectRadius: 0.08 });
  s.addText("ใช้ในขั้นถัดไป", { x: 0.78, y: 5.46, w: 11.7, h: 0.32, fontFace: F, fontSize: 13, bold: true, color: A, charSpacing: 1, align: "left", valign: "middle", margin: 0 });
  s.addText(o.useNext, { x: 0.78, y: 5.8, w: 11.7, h: 0.92, fontFace: F, fontSize: 15, color: P.ink, align: "left", valign: "top", lineSpacingMultiple: 1.15, margin: 0 });
  pageFoot(s, o.foot || "ไฟล์นี้อยู่ในภาคผนวกท้ายเล่ม — ดาวน์โหลดด้วย QR ได้");
}

// ── TEMPLATE 2B — filePreviewSlide ──────────────────────────────────────────
// A literal peek inside the example input file — one file per page, rows shown as text
function filePreviewSlide(o) {
  const s = pres.addSlide(); bg(s); const A = o.accent;
  topBar(s, A, o.label);
  s.addText(o.fileName, { x: 0.55, y: 1.0, w: 12.23, h: 0.6, fontFace: F, fontSize: 23, bold: true, color: P.ink, align: "left", valign: "middle", margin: 0 });
  s.addText("ตัวอย่างเนื้อหาในไฟล์นี้ (ภาพจริงจากไฟล์)", { x: 0.55, y: 1.56, w: 12.23, h: 0.36, fontFace: F, fontSize: 14, bold: true, color: A, charSpacing: 1, align: "left", valign: "middle", margin: 0 });
  const cardX = 0.55, cardY = 2.0, cardW = 12.23, cardH = 4.55;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cardX, y: cardY, w: cardW, h: cardH, fill: { color: "FFFFFF" }, line: { color: A, width: 1.25 }, rectRadius: 0.08, shadow: shadowSoft() });
  const rows = o.rows;
  if (o.previewImage) {
    const pad = 0.22;
    const imgBoxW = cardW * 0.42, imgBoxH = cardH - pad * 2;
    const { w: iw, h: ih } = o._imgDim;
    let dw = imgBoxW, dh = (ih / iw) * dw;
    if (dh > imgBoxH) { dh = imgBoxH; dw = (iw / ih) * dh; }
    const ix = cardX + pad + (imgBoxW - dw) / 2, iy = cardY + pad + (imgBoxH - dh) / 2;
    s.addImage({ path: o.previewImage, x: ix, y: iy, w: dw, h: dh });
    s.addShape(pres.shapes.RECTANGLE, { x: cardX + pad, y: cardY + pad, w: imgBoxW, h: imgBoxH, fill: { type: "none" }, line: { color: P.border, width: 0.75 } });
    const textX = cardX + pad + imgBoxW + pad, textW = cardW - imgBoxW - pad * 3;
    const rh = imgBoxH / rows.length;
    rows.forEach((r, i) => {
      const y = cardY + pad + i * rh;
      if (i > 0) s.addShape(pres.shapes.LINE, { x: textX, y, w: textW, h: 0, line: { color: P.border, width: 0.75 } });
      s.addText(r[0], { x: textX, y, w: textW, h: rh * 0.42, fontFace: F, fontSize: 13.5, bold: true, color: A, align: "left", valign: "bottom", margin: 0 });
      s.addText(r[1], { x: textX, y: y + rh * 0.42, w: textW, h: rh * 0.58, fontFace: F, fontSize: 13, color: P.ink, align: "left", valign: "top", lineSpacingMultiple: 1.05, margin: 0 });
    });
  } else {
    const rh = 4.25 / rows.length;
    rows.forEach((r, i) => {
      const y = 2.17 + i * rh;
      if (i > 0) s.addShape(pres.shapes.LINE, { x: 0.78, y, w: 11.77, h: 0, line: { color: P.border, width: 0.75 } });
      s.addText(r[0], { x: 0.78, y, w: 3.1, h: rh, fontFace: F, fontSize: 14, bold: true, color: A, align: "left", valign: "middle", margin: 0 });
      s.addText(r[1], { x: 3.95, y, w: 8.55, h: rh, fontFace: F, fontSize: 14, color: P.ink, align: "left", valign: "middle", lineSpacingMultiple: 1.05, margin: 0 });
    });
  }
  pageFoot(s, o.foot || "นี่คือตัวอย่างจริงจากไฟล์ภาคผนวก — หน้าถัดไปมี QR ให้ดาวน์โหลดไฟล์นี้");
}

// ── TEMPLATE 2C — fileLinkSlide ─────────────────────────────────────────────
// QR + direct link to download the actual example file from the repo
function fileLinkSlide(o) {
  const s = pres.addSlide(); bg(s); const A = o.accent;
  topBar(s, A, o.label);
  s.addText("ดาวน์โหลดไฟล์ตัวอย่างนี้ไปใช้ฝึกได้ทันที", { x: 0.55, y: 1.0, w: 12.23, h: 0.6, fontFace: F, fontSize: 24, bold: true, color: P.ink, align: "left", valign: "middle", margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.55, y: 1.85, w: 7.3, h: 4.7, fill: { color: P.cardAlt }, line: { color: A, width: 1.25 }, rectRadius: 0.09, shadow: shadowSoft() });
  s.addText(o.fileName, { x: 0.85, y: 2.1, w: 6.7, h: 0.85, fontFace: F, fontSize: 19, bold: true, color: A, align: "left", valign: "middle", lineSpacingMultiple: 1.05, margin: 0 });
  s.addText(o.desc, { x: 0.85, y: 3.0, w: 6.7, h: 1.85, fontFace: F, fontSize: 15, color: P.ink, align: "left", valign: "top", lineSpacingMultiple: 1.2, margin: 0 });
  s.addText(o.url, { x: 0.85, y: 5.0, w: 6.7, h: 1.3, fontFace: F, fontSize: 11.5, italic: true, color: P.ink2, align: "left", valign: "top", lineSpacingMultiple: 1.2, margin: 0 });
  const qx = 8.25, qy = 2.05, qz = 3.9;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: qx - 0.1, y: qy - 0.1, w: qz + 0.2, h: qz + 0.2, fill: { color: "FFFFFF" }, line: { color: P.border, width: 1 }, rectRadius: 0.05, shadow: shadowSoft() });
  s.addImage({ data: o.qr, x: qx, y: qy, w: qz, h: qz });
  s.addText("สแกนเพื่อดาวน์โหลดไฟล์นี้โดยตรง", { x: qx - 0.4, y: qy + qz + 0.08, w: qz + 0.8, h: 0.32, fontFace: F, fontSize: 13, bold: true, color: A, align: "center", valign: "middle", margin: 0 });
  pageFoot(s, o.foot || "ไฟล์นี้อยู่ในภาคผนวกของแพ็กเกจคู่มือ ใช้ทดลองพิมพ์คำสั่งกับ AI ได้จริง");
}

// ── TEMPLATE 3 — actionStepSlide ────────────────────────────────────────────
// One literal click / action per page. kind: "open" | "click" | "type" | "enter" | "qr"
function actionStepSlide(o) {
  const s = pres.addSlide(); bg(s); const A = o.accent;
  topBar(s, A, o.label, o.stepNum, o.stepTotal);
  stepBadge(s, 0.55, 1.1, A, o.stepNum);
  s.addText(o.headline, { x: 1.6, y: 1.05, w: 11.2, h: 0.95, fontFace: F, fontSize: 27, bold: true, color: P.ink, align: "left", valign: "middle", lineSpacingMultiple: 1.0, margin: 0 });

  const by = 2.25;
  if (o.kind === "qr" && o.qr) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.55, y: by, w: 7.3, h: 4.55, fill: { color: P.cardAlt }, line: { color: A, width: 1.25 }, rectRadius: 0.09, shadow: shadowSoft() });
    s.addText("พิมพ์ / คัดลอกข้อความนี้", { x: 0.8, y: by + 0.2, w: 6.8, h: 0.4, fontFace: F, fontSize: 15, bold: true, color: A, align: "left", valign: "middle", margin: 0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: by + 0.7, w: 6.8, h: 3.05, fill: { color: "FFFFFF" }, line: { color: A, width: 0.75 }, rectRadius: 0.06 });
    s.addText(o.promptText, { x: 0.96, y: by + 0.84, w: 6.5, h: 2.78, fontFace: F, fontSize: 14.5, color: P.ink, align: "left", valign: "top", lineSpacingMultiple: 1.18, margin: 0 });
    s.addText(o.detail || "", { x: 0.8, y: by + 3.85, w: 6.8, h: 0.55, fontFace: F, fontSize: 12.5, italic: true, color: P.ink2, align: "left", valign: "middle", margin: 0 });

    const qx = 8.25, qy = by + 0.25, qz = 3.9;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: qx - 0.1, y: qy - 0.1, w: qz + 0.2, h: qz + 0.2, fill: { color: "FFFFFF" }, line: { color: P.border, width: 1 }, rectRadius: 0.05, shadow: shadowSoft() });
    s.addImage({ data: o.qr, x: qx, y: qy, w: qz, h: qz });
    s.addText("สแกนนี้ก่อน → เปิดแชตพร้อมข้อความ", { x: qx - 0.4, y: qy + qz + 0.08, w: qz + 0.8, h: 0.32, fontFace: F, fontSize: 13, bold: true, color: A, align: "center", valign: "middle", margin: 0 });
  } else {
    // simple full-width instruction with a big mock UI element
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.55, y: by, w: 12.23, h: 3.3, fill: { color: P.cardAlt }, line: { color: A, width: 1.25 }, rectRadius: 0.09, shadow: shadowSoft() });
    if (o.mock) drawMock(s, o.mock, A, 0.95, by + 0.35, 11.4, 2.3);
    else if (o.bodyText) s.addText(o.bodyText, { x: 0.95, y: by + 0.3, w: 11.4, h: 2.35, fontFace: F, fontSize: 16, color: P.ink, align: "left", valign: "top", lineSpacingMultiple: 1.22, margin: 0 });
    s.addText(o.detail, { x: 0.95, y: by + 2.78, w: 11.4, h: 0.42, fontFace: F, fontSize: 14, italic: true, color: P.ink2, align: "left", valign: "middle", margin: 0 });
  }
  pageFoot(s, o.foot || "ทำตามทีละขั้น — ไม่ต้องเดาว่าต้องกดอะไรต่อ");
}

function drawMock(s, kind, A, x, y, w, h) {
  if (kind === "browser") {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.5, fill: { color: "FFFFFF" }, line: { color: P.border, width: 1 }, rectRadius: 0.05 });
    [P.red, P.amber, P.green].forEach((c, i) => s.addShape(pres.shapes.OVAL, { x: x + 0.18 + i * 0.26, y: y + 0.18, w: 0.14, h: 0.14, fill: { color: c }, line: { type: "none" } }));
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 1.1, y: y + 0.1, w: w - 1.4, h: 0.3, fill: { color: P.bg }, line: { type: "none" }, rectRadius: 0.15 });
    s.addText("chatgpt.com", { x: x + 1.1, y: y + 0.1, w: w - 1.4, h: 0.3, fontFace: F, fontSize: 12, color: P.muted, align: "center", valign: "middle", margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.5, w, h: h - 0.5, fill: { color: P.bg }, line: { color: P.border, width: 1 } });
    s.addText("หน้าแชตเปล่า — พร้อมเริ่มคุยกับ ChatGPT", { x, y: y + 0.5, w, h: h - 0.5, fontFace: F, fontSize: 15, italic: true, color: P.muted, align: "center", valign: "middle", margin: 0 });
  } else if (kind === "plusButton") {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: "FFFFFF" }, line: { color: P.border, width: 1 } });
    s.addShape(pres.shapes.OVAL, { x: x + 0.5, y: y + h / 2 - 0.45, w: 0.9, h: 0.9, fill: { color: A }, line: { type: "none" }, shadow: shadowSoft() });
    s.addText("+", { x: x + 0.5, y: y + h / 2 - 0.45, w: 0.9, h: 0.9, fontFace: F, fontSize: 40, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
    s.addText("กดปุ่ม “+” ที่อยู่ข้างกล่องพิมพ์ข้อความ ด้านล่างซ้ายของหน้าแชต", { x: x + 1.7, y: y, w: w - 2.2, h, fontFace: F, fontSize: 16, bold: true, color: P.ink, align: "left", valign: "middle", lineSpacingMultiple: 1.1, margin: 0 });
  } else if (kind === "attach") {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: "FFFFFF" }, line: { color: P.border, width: 1 } });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.35, y: y + h / 2 - 0.45, w: 0.9, h: 0.9, fill: { color: A }, line: { type: "none" }, rectRadius: 0.12, shadow: shadowSoft() });
    s.addImage({ data: IC.file, x: x + 0.55, y: y + h / 2 - 0.25, w: 0.5, h: 0.5 });
    s.addText("เลือก “เพิ่มรูปและไฟล์” แล้วเลือกไฟล์ Sample_Thai_Export_Data.xlsx จากเครื่องของคุณ\n⚠ ต้อง Login เข้า ChatGPT ก่อน — ถ้ายังไม่ Login ปุ่มนี้จะให้ Login ก่อนเสมอ", { x: x + 1.55, y: y, w: w - 2.0, h, fontFace: F, fontSize: 15, bold: true, color: P.ink, align: "left", valign: "middle", lineSpacingMultiple: 1.1, margin: 0 });
  } else if (kind === "uploaded") {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: "FFFFFF" }, line: { color: P.border, width: 1 } });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.35, y: y + h / 2 - 0.4, w: 4.2, h: 0.8, fill: { color: P.greenT }, line: { color: P.greenBd, width: 1.25 }, rectRadius: 0.08 });
    s.addImage({ data: IC.checkW ? IC.check : IC.bulb, x: x + 0.55, y: y + h / 2 - 0.2, w: 0.4, h: 0.4 });
    s.addText("Sample_Thai_Export_Data.xlsx", { x: x + 1.05, y: y + h / 2 - 0.4, w: 3.4, h: 0.8, fontFace: F, fontSize: 13, bold: true, color: P.green, align: "left", valign: "middle", margin: 0 });
    s.addText("ไฟล์ขึ้นเป็นการ์ดแนบในกล่องพิมพ์ข้อความ แสดงว่าอัปโหลดสำเร็จ พร้อมพิมพ์คำสั่งต่อได้เลย", { x: x + 4.8, y: y, w: w - 5.0, h, fontFace: F, fontSize: 16, bold: true, color: P.ink, align: "left", valign: "middle", lineSpacingMultiple: 1.1, margin: 0 });
  } else if (kind === "enter") {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: "FFFFFF" }, line: { color: P.border, width: 1 } });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.35, y: y + h / 2 - 0.4, w: 1.2, h: 0.8, fill: { color: A }, line: { type: "none" }, rectRadius: 0.1, shadow: shadowSoft() });
    s.addText("↵", { x: x + 0.35, y: y + h / 2 - 0.4, w: 1.2, h: 0.8, fontFace: F, fontSize: 32, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
    s.addText("กดปุ่มลูกศรส่ง (หรือกด Enter บนคีย์บอร์ด) เพื่อส่งข้อความให้ AI ตอบ", { x: x + 1.85, y: y, w: w - 2.3, h, fontFace: F, fontSize: 16, bold: true, color: P.ink, align: "left", valign: "middle", lineSpacingMultiple: 1.1, margin: 0 });
  }
}

// ── TEMPLATE 4 — resultSlide ─────────────────────────────────────────────────
// AI answer written as a flowing essay, big type, one result per page (or more if long)
function resultSlide(o) {
  const s = pres.addSlide(); bg(s); const A = o.accent;
  topBar(s, A, o.label);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.55, y: 1.0, w: 12.23, h: 0.66, fill: { color: P.green }, line: { type: "none" }, rectRadius: 0.08 });
  s.addImage({ data: IC.checkW, x: 0.78, y: 1.16, w: 0.34, h: 0.34 });
  s.addText(o.title, { x: 1.26, y: 1.0, w: 11.3, h: 0.66, fontFace: F, fontSize: 17, bold: true, color: "FFFFFF", align: "left", valign: "middle", margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.55, y: 1.82, w: 12.23, h: 4.95, fill: { color: P.greenT }, line: { color: P.greenBd, width: 1.25 }, rectRadius: 0.09, shadow: shadowSoft() });
  s.addText(o.body, { x: 0.85, y: 2.02, w: 11.63, h: 4.55, fontFace: F, fontSize: o.fontSize || 16, color: P.ink, align: "left", valign: "top", lineSpacingMultiple: 1.32, margin: 0 });
  pageFoot(s, o.foot || "นี่คือคำตอบจริงจาก AI — ใช้เป็นจุดตั้งต้น ตรวจสอบตัวเลข/กฎกับแหล่งทางการก่อนใช้จริง");
}

// ── TEMPLATE 4B — liveProofSlide ────────────────────────────────────────────
// Real screenshot captured from a live ChatGPT (or other live website) test run —
// proof that the prompt on the previous page genuinely produces this, not an
// illustrative mock-up. Image is shown at native aspect ratio, never cropped/stretched.
function liveProofSlide(o) {
  const s = pres.addSlide(); bg(s); const A = o.accent;
  topBar(s, A, o.label);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.55, y: 1.0, w: 12.23, h: 0.62, fill: { color: P.d6 }, line: { type: "none" }, rectRadius: 0.08 });
  s.addImage({ data: IC.checkW, x: 0.78, y: 1.15, w: 0.32, h: 0.32 });
  s.addText(o.title || "ภาพหน้าจอจริงจากการทดสอบสด — ไม่ใช่ภาพตัวอย่างจำลอง", { x: 1.24, y: 1.0, w: 11.32, h: 0.62, fontFace: F, fontSize: 16, bold: true, color: "FFFFFF", align: "left", valign: "middle", margin: 0 });
  const cardX = 0.55, cardY = 1.78, cardW = 12.23, cardH = 4.55;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cardX, y: cardY, w: cardW, h: cardH, fill: { color: "FFFFFF" }, line: { color: A, width: 1.25 }, rectRadius: 0.08, shadow: shadowSoft() });
  const pad = 0.16;
  const boxW = cardW - pad * 2, boxH = cardH - pad * 2;
  const { w: iw, h: ih } = o._imgDim;
  let dw = boxW, dh = (ih / iw) * dw;
  if (dh > boxH) { dh = boxH; dw = (iw / ih) * dh; }
  const ix = cardX + (cardW - dw) / 2, iy = cardY + (cardH - dh) / 2;
  s.addImage({ path: o.image, x: ix, y: iy, w: dw, h: dh });
  s.addShape(pres.shapes.RECTANGLE, { x: ix, y: iy, w: dw, h: dh, fill: { type: "none" }, line: { color: P.border, width: 0.75 } });
  pageFoot(s, o.foot || "ภาพจริงจากการทดสอบสด — คำตอบของ AI อาจต่างไปบ้างในแต่ละครั้งที่รัน เนื้อหาหลักจะคล้ายกัน");
}

function closingSlide(o) {
  const s = pres.addSlide(); bg(s, P.cap); const A = P.gold;
  s.addText(o.kicker || `HOW TO ${o.num} — สรุป`, { x: 0.6, y: 0.9, w: 12.13, h: 0.5, fontFace: F, fontSize: 17, bold: true, color: A, charSpacing: 3, align: "center", margin: 0 });
  s.addText(o.headline, { x: 0.6, y: 1.5, w: 12.13, h: 1.2, fontFace: F, fontSize: 34, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
  const items = o.recap;
  const y0 = 3.1, rh = 0.78, gap = 0.14;
  items.forEach((t, i) => {
    const y = y0 + i * (rh + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.4, y, w: 10.53, h: rh, fill: { color: "453F33" }, line: { type: "none" }, rectRadius: 0.08 });
    s.addShape(pres.shapes.OVAL, { x: 1.62, y: y + rh / 2 - 0.22, w: 0.44, h: 0.44, fill: { color: A }, line: { type: "none" } });
    s.addText(String(i + 1), { x: 1.62, y: y + rh / 2 - 0.22, w: 0.44, h: 0.44, fontFace: F, fontSize: 16, bold: true, color: P.cap, align: "center", valign: "middle", margin: 0 });
    s.addText(t, { x: 2.3, y, w: 9.4, h: rh, fontFace: F, fontSize: 15.5, color: "FFFFFF", align: "left", valign: "middle", lineSpacingMultiple: 1.1, margin: 0 });
  });
  s.addText(o.next, { x: 0.6, y: y0 + items.length * (rh + gap) + 0.15, w: 12.13, h: 0.5, fontFace: F, fontSize: 14, italic: true, color: "D8CFBE", align: "center", valign: "middle", margin: 0 });
}

function guideIntroSlide() {
  const s = pres.addSlide(); bg(s, P.cap); const A = P.gold;
  s.addText("ก่อนเริ่ม — วิธีใช้คู่มือนี้", { x: 0.6, y: 0.7, w: 12.13, h: 0.5, fontFace: F, fontSize: 17, bold: true, color: A, charSpacing: 3, align: "center", margin: 0 });
  s.addText("3 ข้อที่ต้องรู้ก่อนสแกน QR ขั้นแรก", { x: 0.6, y: 1.25, w: 12.13, h: 1.0, fontFace: F, fontSize: 30, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
  const guideItems = [
    "อยู่ในแชทเดิมตลอดทั้ง HOW TO — ทุกขั้นในหัวข้อเดียวกันต้องพิมพ์ต่อในแชทเดียวกัน ห้ามเปิดแชทใหม่ระหว่างขั้น เพราะ AI ใช้คำตอบและไฟล์จากขั้นก่อนหน้ามาตอบขั้นต่อไป",
    "ขั้นที่ต้องแนบไฟล์ (มีปุ่ม “+”) ต้อง Login เข้า ChatGPT ก่อน — ChatGPT จะให้ Login ก่อนเสมอเมื่อกดแนบไฟล์ ถ้ายังไม่ Login ให้ Login ก่อนเริ่มขั้นนั้น",
    "ตัวเลข/ชื่อตลาดที่ AI ตอบจริงอาจไม่ตรงกับตัวอย่างในคู่มือทุกตัว เพราะคู่มือใช้ข้อมูลตัวอย่างประกอบ ส่วน AI จะตอบจากไฟล์ข้อมูลจริงที่คุณอัปโหลด — ให้ดูว่า AI ใช้เหตุผลและอ้างอิงข้อมูลจากไฟล์ถูกต้องหรือไม่ ไม่ใช่ตัวเลขต้องตรงกันทุกตัว",
  ];
  const gy0 = 2.7, grh = 1.1, ggap = 0.18;
  guideItems.forEach((t, i) => {
    const y = gy0 + i * (grh + ggap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.4, y, w: 10.53, h: grh, fill: { color: "453F33" }, line: { type: "none" }, rectRadius: 0.08 });
    s.addShape(pres.shapes.OVAL, { x: 1.62, y: y + grh / 2 - 0.22, w: 0.44, h: 0.44, fill: { color: A }, line: { type: "none" } });
    s.addText(String(i + 1), { x: 1.62, y: y + grh / 2 - 0.22, w: 0.44, h: 0.44, fontFace: F, fontSize: 16, bold: true, color: P.cap, align: "center", valign: "middle", margin: 0 });
    s.addText(t, { x: 2.3, y: y + 0.06, w: 9.4, h: grh - 0.12, fontFace: F, fontSize: 14.5, color: "FFFFFF", align: "left", valign: "middle", lineSpacingMultiple: 1.12, margin: 0 });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// HOW TO 1 CONTENT — หาตลาดและผู้ซื้อต่างชาติ
// ════════════════════════════════════════════════════════════════════════════
const H1 = {
  num: 1, accent: P.d5, label: "HOW TO 1 · หาตลาด-ผู้ซื้อ",
  title: "AI หาตลาดและผู้ซื้อต่างชาติ\nจากข้อมูลส่งออกที่มีอยู่แล้ว",
  objective: "ให้ AI ช่วยตอบคำถามที่ SME ส่งออกแทบทุกคนเจอ: “ปีนี้ควรเทขายไปประเทศไหน และใครคือผู้ซื้อจริง” โดยไม่ต้องนั่งไล่ตัวเลขเองทีละบรรทัด",
  scenario: "บริษัท Siam Rice มีไฟล์บันทึกการส่งออกเก่าเก็บไว้ในคอมพิวเตอร์ (Excel 72 รายการส่งของ ปี 2025–2026) แต่ไม่มีใครในทีมมีเวลานั่งวิเคราะห์ว่าตลาดไหนน่าไปต่อ",
  problem: "ข้อมูลมีอยู่แล้วแต่ไม่ถูกใช้ — กระจัดกระจายเป็นแถวตัวเลข ไม่มีใครสรุปเป็นกลยุทธ์ได้ทันเวลาตัดสินใจ ทำให้บางทีเลือกตลาดผิด เสียเวลาและค่าใช้จ่ายในการเข้าหาผู้ซื้อที่ไม่เหมาะ",
  aiTask: "อัปโหลดไฟล์ Excel ให้ AI อ่าน แล้วให้ช่วย (1) จัดลำดับตลาดที่มีโอกาสที่สุด (2) หารายชื่อผู้ซื้อ/ผู้นำเข้าตัวจริงในตลาดนั้น (3) ร่างอีเมลแนะนำตัวพร้อมคำตอบที่เตรียมไว้สำหรับคำถามที่ผู้ซื้อจะถาม",
  outcome: "ภายในไม่กี่นาที ได้ตลาดเป้าหมายที่จัดลำดับด้วยเหตุผลชัดเจน รายชื่อผู้ซื้อที่ติดต่อได้จริง และอีเมลพร้อมส่งเป็นภาษาอังกฤษ — แทนที่จะเสียเวลาหลายวันค้นเอง",
};

const DOC1 = {
  accent: P.d5, label: "HOW TO 1 · เอกสาร/ข้อมูลที่ใช้",
  docName: "Sample_Thai_Export_Data.xlsx — ไฟล์บันทึกการส่งออก",
  story: "ไฟล์นี้คือบันทึกการส่งออกของบริษัทในช่วงปี 2025 ถึงต้นปี 2026 รวบรวมไว้แถวต่อแถวว่าส่งสินค้าอะไร ไปประเทศไหน น้ำหนักเท่าไหร่ มูลค่าเท่าไหร่ และใช้เงื่อนไขการขนส่งแบบใด — เป็นข้อมูลจริงของกิจการเองที่หลายบริษัทมีอยู่แล้วแต่ไม่เคยถูกหยิบมาวิเคราะห์",
  stats: [["72", "รายการส่งออก (shipments)"], ["5", "ประเภทสินค้าหลัก"], ["10", "ประเทศปลายทาง"], ["$3.4M", "มูลค่ารวมทุกรายการ"]],
  useNext: "ในขั้นต่อไป เราจะอัปโหลดไฟล์นี้ทั้งไฟล์ให้ ChatGPT อ่าน แล้วให้ AI สรุปเป็น Top 5 ตลาดที่มีโอกาสมากที่สุดในปี 2026 — ไม่ต้องเปิด Excel ไล่ดูเองทีละแถว",
  foot: "ไฟล์ตัวอย่างนี้ดาวน์โหลดได้จาก QR ในภาคผนวกท้ายเล่ม — ใช้ไฟล์ข้อมูลส่งออกจริงของกิจการคุณแทนได้เลย",
};

const STEP1_PROMPT = "จากไฟล์ข้อมูลส่งออกนี้ ช่วยวิเคราะห์ Top 5 ตลาดส่งออกของฉันปี 2026 — ดูจากดีมานด์ การเติบโต ภาษี และคู่แข่ง เรียงลำดับพร้อมเหตุผล";
const STEP2_PROMPT = "ในตลาดอันดับ 1 ที่แนะนำมา ใครคือผู้นำเข้า/ผู้จัดจำหน่ายสินค้าหลักของฉันที่มีโอกาสมากที่สุดในตลาดนั้นรายใหญ่? ช่วยหารายชื่อบริษัท ประเภทธุรกิจ และช่องทางติดต่อที่หาได้ พร้อมแนะนำว่าควรเข้าหาอย่างไร";
const STEP3_PROMPT = "ร่างอีเมลแนะนำสินค้าและบริษัทเราถึงผู้นำเข้ารายแรกที่แนะนำมา เป็นภาษาอังกฤษ โทนมืออาชีพ กระชับ เน้นคุณภาพ ราคา และใบรับรอง แล้วเตรียมคำตอบสำหรับคำถามที่เขาน่าจะถาม";

const RESULT1 = "AI อ่านไฟล์บันทึกการส่งออกทั้ง 72 รายการแล้วสรุปว่า อินเดียคือโอกาสที่สูงที่สุดของปีนี้ เพราะตลาดข้าวพรีเมียมที่นั่นมีขนาดถึง 22 ล้านตันต่อปีและเติบโตถึง 28% ในช่วง 3 ปีที่ผ่านมา ชนชั้นกลางใหม่กว่า 300 ล้านคนยินดีจ่ายราคาสูงกว่าสำหรับสินค้าที่มีตรารับรองสิ่งบ่งชี้ทางภูมิศาสตร์ (GI) และที่สำคัญคือเมื่อใช้สิทธิ์ภายใต้ความตกลง RCEP ผ่าน Form D ภาษีนำเข้าจะลดจาก 70% เหลือ 0% ทันที ทำให้ข้าวหอมมะลิไทยได้เปรียบคู่แข่งจากปากีสถานและอินโดนีเซียอย่างชัดเจน ส่วนจีนตามมาเป็นอันดับสองด้วยมูลค่าสูงและส่งถึงเร็ว เพราะผู้บริโภคในเซี่ยงไฮ้และปักกิ่งยอมจ่ายแพงกว่าข้าวทั่วไปถึง 5-8 เท่า บวกกับ RCEP Form E ที่ให้ภาษี 0% เช่นกัน และเวลาขนส่งจากแหลมฉบังไปเซี่ยงไฮ้เพียง 7 วัน อันดับสามคือเวียดนามซึ่งเป็นจุดกระจายสินค้าของอาเซียนที่ค่าขนส่งถูกและส่งต่อไปยุโรปหรือสหรัฐฯ ได้สะดวก ตามมาด้วยเยอรมนีที่ให้มูลค่าต่อหน่วยสูงสุดหากมีใบรับรองออร์แกนิก เพราะตลาดออร์แกนิกในสหภาพยุโรปเติบโต 12% ต่อปี และสุดท้ายคือสหรัฐอาหรับเอมิเรตส์ที่เป็นศูนย์กลางกระจายสินค้าไปทั่วตะวันออกกลาง 22 ประเทศด้วยภาษีเพียง 5% และไม่มีโควต้า อย่างไรก็ตาม AI เตือนว่าตลาดสหรัฐอเมริกาตอนนี้มีความเสี่ยงสูงเพราะภาษีตอบโต้ (reciprocal tariff) อยู่ที่ประมาณ 19% จึงแนะนำให้กระจายไปสามตลาดหลักเพื่อลดความเสี่ยงจากการพึ่งพานโยบายของประเทศเดียว";

const RESULT2 = "เมื่อให้ AI เจาะลึกเฉพาะตลาดอินเดีย AI ได้รวบรวมรายชื่อผู้นำเข้าข้าวรายใหญ่สามแห่งที่น่าติดต่อที่สุด อันดับแรกคือ ITC Limited จากเมืองมุมไบ ซึ่งมีแผนกอาหารที่ทำรายได้ถึง 2,100 ล้านดอลลาร์ในปี 2025 และนำเข้าข้าวพรีเมียมปีละ 5,000 ถึง 8,000 ตัน ขายผ่านแบรนด์ Aashirvaad ที่มีวางขายในซูเปอร์มาร์เก็ตทั่วประเทศ โดยบริษัทนี้ต้องการใบรับรอง SGS ใบรับรองสุขอนามัยพืช และใบรับรอง GI ก่อนพิจารณาสั่งซื้อ อันดับสองคือ Amira Nature Foods จากเดลี ซึ่งเชี่ยวชาญด้านข้าวพิเศษ ข้าว GI และข้าวออร์แกนิก มีลูกค้าเป็นห้างค้าปลีกรายใหญ่อย่าง Big Bazaar, Reliance Fresh และ D-Mart และส่งออกต่อไปกว่า 60 ประเทศทั่วโลก ส่วนอันดับสามคือ KRBL Limited จากเมือง Noida ผู้ส่งออกข้าวอันดับหนึ่งของอินเดียภายใต้แบรนด์ India Gate ซึ่งมักซื้อในปริมาณมากเพื่อนำไปผสมและบรรจุใหม่ก่อนส่งออกต่อไปยังตะวันออกกลาง ทำให้ออเดอร์มีขนาดใหญ่แต่กำไรต่อหน่วยจะต่ำกว่า AI แนะนำว่าวิธีเข้าหาที่ได้ผลดีที่สุดคือการส่งอีเมลภาษาอังกฤษพร้อมแนบสเปกสินค้า ใบรับรองสุขอนามัยพืช ใบรับรองออร์แกนิก และใบรับรอง GI ไปพร้อมกัน เสนอตัวอย่างสินค้าฟรี 5 กิโลกรัมก่อนให้สั่งซื้อทดลองจริงที่ 20 ถึง 50 ตัน และควรลงทะเบียนในระบบ APEDA ของอินเดียเพื่อให้ผู้ซื้อค้นหาเราเจอได้เอง รวมถึงขอคำแนะนำเพิ่มเติมผ่านสำนักงาน DITP ประจำมุมไบ";

const RESULT3 = "ขั้นสุดท้าย AI ร่างอีเมลภาษาอังกฤษให้ทันที โดยตั้งหัวเรื่องว่า Premium Thai Hom Mali Rice — Grade A Organic, GI Certified | New Supplier Inquiry และเปิดอีเมลด้วยการแนะนำตัวว่า Siam Rice Co., Ltd. เป็นผู้ส่งออกข้าวออร์แกนิกที่มีใบรับรองมาตรฐานจากประเทศไทย ต้องการสร้างความร่วมมือระยะยาวกับแผนกอาหารของ ITC ตัวอีเมลระบุรายละเอียดสินค้าอย่างครบถ้วน ทั้งเลขทะเบียน GI ความชื้นไม่เกิน 14.5% เมล็ดหักไม่เกิน 5% ความบริสุทธิ์ 99.7% กำลังผลิต 200 ตันต่อเดือน ราคาส่งมอบที่ท่าเรือกรุงเทพ 1.45 ดอลลาร์ต่อกิโลกรัมซึ่งได้สิทธิ์ภาษี 0% ภายใต้ RCEP และเสนอตัวอย่างสินค้าทดลอง 5 กิโลกรัมโดยไม่มีข้อผูกมัด ปิดท้ายด้วยการขอนัดคุยทางโทรศัพท์ 20 นาทีในสัปดาห์นั้น นอกจากตัวอีเมลแล้ว AI ยังเตรียมคำถามที่ผู้ซื้อมักถามไว้ให้ล่วงหน้าพร้อมคำตอบ เช่น ทำไมต้องเลือกข้าวไทยแทนเวียดนาม คำตอบคือมีใบรับรอง GI และออร์แกนิกพร้อมกลิ่นหอมที่ได้รับการยืนยันมาตรฐาน ISO ปริมาณขั้นต่ำในการสั่งซื้อคือ 20 ตันสำหรับรอบทดลองและ 50 ตันสำหรับรอบปกติ การชำระเงินรับได้ทั้งแบบ L/C at sight หรือโอนล่วงหน้า 30% และเอกสารที่พร้อมแนบมีทั้งใบรับรองสุขอนามัยพืช ใบรับรองออร์แกนิก ใบรับรอง GI และใบตรวจสอบจาก SGS — ทำให้ทีมขายพร้อมส่งอีเมลได้ทันทีโดยไม่ต้องเขียนเองตั้งแต่ต้น";

async function buildHowTo1() {
  let page = 0;
  const total = 13;

  howToOpenSlide(H1); page++;
  docStorySlide(DOC1); page++;
  { const d = await imgDim("Sample_Thai_Export_Data.png");
    filePreviewSlide({ accent: H1.accent, label: H1.label, fileName: "Sample_Thai_Export_Data.xlsx", previewImage: d.file, _imgDim: d, rows: [
    ["สินค้า/ตลาด", "ข้าวหอมมะลิ ข้าวขาว ชิ้นส่วนยานยนต์ ถุงมือยาง สับปะรดกระป๋อง ส่งไปกว่า 10 ประเทศ"],
    ["จำนวนแถว", "รวม 72 แถว ตั้งแต่ปี 2025 ถึงต้นปี 2026 ครอบคลุมสินค้า 5 ประเภท"],
    ["คอลัมน์หลัก", "เดือน, สินค้า, HS Code, ประเทศปลายทาง, จำนวน (กก.), มูลค่า (USD), Incoterms, ผู้ซื้อ"],
  ] }); } page++;
  { const qr = await qrPngUrl(rawUrl("deck/Sample_Thai_Export_Data.xlsx"));
    fileLinkSlide({ accent: H1.accent, label: H1.label, fileName: "Sample_Thai_Export_Data.xlsx", qr,
      desc: "ไฟล์บันทึกการส่งออก 72 รายการที่ใช้ในขั้นตอนถัดไปทั้งหมดของ HOW TO 1 — สแกน QR เพื่อดาวน์โหลดไฟล์จริงจากภาคผนวกของแพ็กเกจคู่มือ แล้วใช้แทนไฟล์ข้อมูลส่งออกของกิจการคุณเองได้เลย",
      url: rawUrl("deck/Sample_Thai_Export_Data.xlsx") }); } page++;

  // Step block 1 — find markets
  actionStepSlide({ accent: H1.accent, label: H1.label, stepNum: 1, stepTotal: total, headline: "เปิดเว็บเบราว์เซอร์ แล้วไปที่ chatgpt.com", kind: "mock", mock: "browser", detail: "ล็อกอินด้วยบัญชีของคุณ แล้วเริ่มแชตใหม่ (กดปุ่ม “New chat” มุมซ้ายบน ถ้ามีแชตเก่าเปิดอยู่)" });
  actionStepSlide({ accent: H1.accent, label: H1.label, stepNum: 2, stepTotal: total, headline: "กดปุ่ม “+” ข้างกล่องพิมพ์ข้อความ", kind: "mock", mock: "plusButton", detail: "ปุ่มนี้อยู่ทางซ้ายของกล่องพิมพ์ข้อความ ด้านล่างของหน้าจอ" });
  actionStepSlide({ accent: H1.accent, label: H1.label, stepNum: 3, stepTotal: total, headline: "เลือก “เพิ่มรูปและไฟล์” แล้วแนบไฟล์ Excel", kind: "mock", mock: "attach", detail: "เลือกไฟล์ Sample_Thai_Export_Data.xlsx (หรือไฟล์ข้อมูลส่งออกจริงของคุณ) จากเครื่อง" });
  actionStepSlide({ accent: H1.accent, label: H1.label, stepNum: 4, stepTotal: total, headline: "รอจนไฟล์อัปโหลดเสร็จ เห็นการ์ดไฟล์ในกล่องแชต", kind: "mock", mock: "uploaded", detail: "เมื่อเห็นชื่อไฟล์ขึ้นเป็นการ์ดแล้ว แสดงว่าพร้อมให้พิมพ์คำสั่งต่อได้" });
  { const qr = await qrPng(STEP1_PROMPT);
    actionStepSlide({ accent: H1.accent, label: H1.label, stepNum: 5, stepTotal: total, headline: "พิมพ์คำสั่งนี้ แล้วกดส่ง", kind: "qr", qr, promptText: STEP1_PROMPT, detail: "หรือสแกน QR ทางขวาเพื่อเปิดแชตพร้อมข้อความนี้ทันทีบนมือถือ" }); }
  resultSlide({ accent: H1.accent, label: H1.label, title: "AI ตอบ — Top 5 ตลาดส่งออกปี 2026", body: RESULT1, fontSize: 15.5 });
  { const d = await liveProofDim("howto1_step1_markets.png");
    liveProofSlide({ accent: H1.accent, label: H1.label, image: d.file, _imgDim: d, title: "ภาพหน้าจอจริง — ทดสอบสดบน ChatGPT (ตลาด #1 ที่ AI แนะนำจะขึ้นอยู่กับรอบที่รัน)" }); }

  // Step block 2 — find buyers (continue same chat)
  { const qr = await qrPng(STEP2_PROMPT);
    actionStepSlide({ accent: H1.accent, label: H1.label, stepNum: 6, stepTotal: total, headline: "พิมพ์ต่อในแชตเดิม ไม่ต้องเริ่มใหม่", kind: "qr", qr, promptText: STEP2_PROMPT, detail: "AI จำไฟล์และบทสนทนาก่อนหน้าได้ จึงตอบต่อเนื่องโดยไม่ต้องอัปโหลดไฟล์ซ้ำ" }); }
  resultSlide({ accent: H1.accent, label: H1.label, title: "AI ตอบ — ผู้นำเข้า/ผู้ซื้อตัวจริงในตลาดอันดับ 1 ที่ AI แนะนำ", body: RESULT2, fontSize: 15.5 });
  { const d = await liveProofDim("howto1_step2_buyers.png");
    liveProofSlide({ accent: H1.accent, label: H1.label, image: d.file, _imgDim: d, title: "ภาพหน้าจอจริง — ทดสอบสดบน ChatGPT (ชื่อผู้ซื้อจริงในตลาดที่ AI เลือกจากขั้นที่แล้ว)" }); }

  // Step block 3 — draft email
  { const qr = await qrPng(STEP3_PROMPT);
    actionStepSlide({ accent: H1.accent, label: H1.label, stepNum: 7, stepTotal: total, headline: "พิมพ์คำสั่งให้ร่างอีเมลถึงผู้ซื้อที่เลือก", kind: "qr", qr, promptText: STEP3_PROMPT, detail: "เปลี่ยนชื่อบริษัท/ผู้ซื้อในข้อความให้ตรงกับที่คุณเลือกจากขั้นที่แล้ว" }); }
  resultSlide({ accent: H1.accent, label: H1.label, title: "AI ตอบ — อีเมลพร้อมส่ง + คำตอบเตรียมไว้ล่วงหน้า", body: RESULT3, fontSize: 15 });
  { const d = await liveProofDim("howto1_step3_email.png");
    liveProofSlide({ accent: H1.accent, label: H1.label, image: d.file, _imgDim: d, title: "ภาพหน้าจอจริง — ทดสอบสดบน ChatGPT (อีเมลร่างจริงถึงผู้ซื้อที่ AI เลือก)" }); }

  closingSlide({
    num: 1,
    headline: "จากไฟล์ Excel เก่า สู่ตลาดเป้าหมาย ผู้ซื้อ และอีเมลพร้อมส่ง",
    recap: [
      "อัปโหลดไฟล์ข้อมูลส่งออกที่มีอยู่แล้ว ไม่ต้องเตรียมข้อมูลใหม่",
      "ได้ Top 5 ตลาดพร้อมเหตุผลเรื่องดีมานด์ ภาษี และคู่แข่ง",
      "ได้รายชื่อผู้ซื้อจริงพร้อมวิธีเข้าหาที่เหมาะกับตลาดนั้น",
      "ได้อีเมลภาษาอังกฤษพร้อมส่ง และคำตอบเตรียมรับคำถาม",
    ],
    next: "ขั้นต่อไป (HOW TO 2): ตรวจภาษีและคำนวณ landed cost ของตลาดที่เลือกไว้",
  });

  return page;
}

// ════════════════════════════════════════════════════════════════════════════
// HOW TO 2 CONTENT — ภาษีนำเข้าและต้นทุนที่แท้จริง (Landed Cost)
// ════════════════════════════════════════════════════════════════════════════
const H2 = {
  num: 2, accent: P.d1, label: "HOW TO 2 · ภาษี-ต้นทุนนำเข้า",
  title: "AI คำนวณภาษีนำเข้าและต้นทุนที่แท้จริง\nก่อนเสนอราคาลูกค้าต่างประเทศ",
  objective: "ให้ AI ช่วยตอบคำถามที่ตัดสินใจได้ว่าจะ “ขายแล้วได้กำไรจริงหรือไม่” — เพราะราคา FOB หน้าโรงงานอย่างเดียวไม่บอกต้นทุนที่แท้จริงเมื่อสินค้าไปถึงมือผู้ซื้อ",
  scenario: "จากขั้นที่แล้ว Siam Rice ได้ตลาดอันดับหนึ่งที่ AI แนะนำมาแล้ว แต่ทีมขายยังอยากรู้ว่าถ้าจะลองตลาดสหรัฐฯ ด้วย จะเจอภาษี Trump Reciprocal Tariff เท่าไหร่ และเทียบกับตลาดอื่นแล้วคุ้มหรือไม่",
  problem: "ภาษีนำเข้าเปลี่ยนบ่อยและซับซ้อน มีทั้งภาษีฐาน (MFN) ภาษีตอบโต้ (Reciprocal Tariff) และสิทธิพิเศษทางการค้า (FTA) ซ้อนกันหลายชั้น ถ้าคำนวณผิดอาจเสนอราคาขาดทุนโดยไม่รู้ตัว",
  aiTask: "ให้ AI ช่วย (1) หาภาษีนำเข้าที่แท้จริงตาม HS Code (2) คำนวณ landed cost ต่อกิโลกรัมเทียบหลายตลาด (3) ชี้สิทธิประโยชน์ FTA ที่ลดภาษีได้ (4) สรุปเป็นตารางพร้อมร่างอีเมลเสนอราคา",
  outcome: "ได้ตัวเลขต้นทุนที่แท้จริงต่อหน่วยในแต่ละตลาด พร้อมรู้ว่าควรใช้เอกสารสิทธิพิเศษทางการค้าใดเพื่อลดภาษีให้เหลือน้อยที่สุดหรือเป็น 0% — ก่อนเสนอราคาให้ผู้ซื้อจริง",
};

const DOC2 = {
  accent: P.d1, label: "HOW TO 2 · เอกสาร/ข้อมูลที่ใช้",
  docName: "ใบเสนอราคาฉบับร่าง — FOB Bangkok $1.45/kg",
  story: "ทีมขายเตรียมใบเสนอราคาฉบับร่างสำหรับข้าวหอมมะลิเกรด A จำนวน 20,000 กิโลกรัม ราคา FOB กรุงเทพฯ ที่ 1.45 ดอลลาร์ต่อกิโลกรัม (รวม 29,000 ดอลลาร์) ภายใต้ HS Code 1006.30.90 — แต่ยังไม่รู้ว่าราคานี้เมื่อไปถึงผู้ซื้อที่สหรัฐฯ จะถูกบวกภาษีและค่าใช้จ่ายอะไรเพิ่มอีกเท่าไหร่",
  stats: [["$1.45", "ราคา FOB ต่อกิโลกรัม"], ["20,000 kg", "ปริมาณที่เสนอ"], ["1006.30.90", "HS Code ข้าวหอมมะลิ"], ["$29,000", "มูลค่ารวม FOB"]],
  useNext: "ในขั้นต่อไป เราจะให้ AI คำนวณภาษีนำเข้าจริงตาม HS Code นี้ และเปรียบเทียบ landed cost ในหลายตลาดเพื่อหาว่าตลาดไหนคุ้มที่สุด",
  foot: "ตัวเลขราคาที่ AI คำนวณเป็นจุดตั้งต้น ควรตรวจกับ USTR.gov / CBP HTS / กรมศุลกากรไทยก่อนเสนอราคาจริง",
};

const STEP2_1_PROMPT = "ข้าวหอมมะลิของฉัน HS Code 1006.30.90 ราคา FOB กรุงเทพฯ $1.45/kg ถ้าส่งไปสหรัฐฯ ตอนนี้เจอภาษีนำเข้าเท่าไหร่ ช่วยคำนวณ MFN base tariff รวมกับ Reciprocal Tariff ปี 2026 พร้อมตัวอย่าง landed cost ถึงท่าเรือ Los Angeles สำหรับออเดอร์ 20,000 กิโลกรัม";
const STEP2_2_PROMPT = "เปรียบเทียบ landed cost ต่อกิโลกรัมของข้าวหอมมะลิราคา FOB $1.45 ถ้าส่งไปสหรัฐฯ สหภาพยุโรป จีน อินเดีย และเวียดนาม ตลาดไหนคุ้มที่สุดเมื่อรวมภาษีนำเข้าแล้ว";
const STEP2_3_PROMPT = "มีสิทธิประโยชน์ทางภาษีอะไรที่ช่วยให้ส่งออกข้าวไปจีนหรืออินเดียได้ภาษี 0% บ้าง ต้องใช้เอกสารอะไร ขอที่ไหน ใช้เวลานานแค่ไหน และมีข้อควรระวังอะไรบ้าง";
const STEP2_4_PROMPT = "สรุปทุกตลาดที่เปรียบเทียบมาเป็นตารางเดียว (ภาษี/landed cost/ข้อแนะนำ) แล้วร่างอีเมลเสนอราคาภาษาอังกฤษไปยังผู้ซื้อในเยอรมนีที่ราคา CIF Hamburg พร้อมเน้นจุดขายเรื่องใบรับรองออร์แกนิก";

const RESULT2_1 = "AI ยืนยันว่า HS Code 1006.30.90 ตรงกับข้าวหอมมะลิเกรดพรีเมียมตามระบบศุลกากรสหรัฐฯ แล้วอธิบายว่าภาษีที่ต้องจ่ายมีสองชั้นซ้อนกัน ชั้นแรกคือภาษีฐาน MFN ซึ่งอยู่ที่ประมาณ 0.52 เซนต์ต่อกิโลกรัมเท่านั้น แต่ชั้นที่สองคือภาษีตอบโต้ (Reciprocal Tariff) ที่ประกาศเพิ่มเติมในปี 2026 อีก 18.5% ทำให้อัตราภาษีรวมที่แท้จริงตกอยู่ที่ประมาณ 19% ของมูลค่าสินค้า AI คำนวณตัวอย่างให้เห็นภาพว่าถ้าส่งออเดอร์มูลค่า FOB 29,000 ดอลลาร์ (20,000 กิโลกรัม) ไปถึงท่าเรือ Los Angeles จะต้องจ่ายภาษีนำเข้าประมาณ 5,510 ดอลลาร์ บวกค่าระวางเรืออีกราว 1,600 ดอลลาร์ และค่าประกันภัยอีกประมาณ 350 ดอลลาร์ รวมต้นทุนที่แท้จริงเป็น 36,460 ดอลลาร์ หรือเทียบเท่าประมาณ 1.82 ดอลลาร์ต่อกิโลกรัม ซึ่งสูงกว่าราคา FOB ตั้งต้นถึง 25.5% AI อ้างอิงตัวเลขจากเว็บไซต์ USTR.gov ตารางพิกัดศุลกากรของ CBP บทที่ 10 และกรมศุลกากรไทยเป็นแหล่งข้อมูล และเตือนว่าตัวเลขนี้อาจเปลี่ยนแปลงได้หากมีประกาศภาษีฉบับใหม่ ควรตรวจสอบอีกครั้งก่อนเสนอราคาจริง";

const RESULT2_2 = "เมื่อเทียบทั้งห้าตลาดจากราคาตั้งต้น FOB เดียวกันที่ 1.45 ดอลลาร์ต่อกิโลกรัม AI พบว่าผลต่างกันมาก สหรัฐอเมริกามี landed cost สูงสุดที่ 1.82 ดอลลาร์เพราะภาษีรวม 25.5% ตามที่คำนวณไว้ก่อนหน้า ตามมาด้วยสหภาพยุโรปที่ 1.70 ดอลลาร์จากภาษี 17.2% แต่ AI ตั้งข้อสังเกตว่ามาตรการ CBAM และ EUDR ของยุโรปยังไม่บังคับใช้กับสินค้าข้าว จึงไม่มีต้นทุนเพิ่มจากด้านสิ่งแวดล้อม ส่วนตลาดที่ต้นทุนต่ำที่สุดคือจีน อินเดีย และเวียดนาม ซึ่งภาษีนำเข้าอยู่ที่เพียง 2.5 ถึง 3.2% เท่านั้น ทำให้ landed cost อยู่ระหว่าง 1.49 ถึง 1.497 ดอลลาร์ต่อกิโลกรัม ใกล้เคียงกับราคาตั้งต้นมาก AI แนะนำกลยุทธ์การตั้งราคาที่ต่างกันตามตลาด คือสำหรับสหภาพยุโรปควรเน้นใบรับรองออร์แกนิกเพราะผู้บริโภคยินดีจ่ายเพิ่ม 30 ถึง 40% ทำให้ชดเชยภาษีที่สูงได้ ส่วนจีน อินเดีย และเวียดนามซึ่งต้นทุนต่ำอยู่แล้วควรเน้นเจาะปริมาณขายให้มากเพื่อทำกำไรจากปริมาณ ในขณะที่ตลาดสหรัฐฯ ควรระวังเพราะภาษีสูงและมีความเสี่ยงจากการเปลี่ยนนโยบายบ่อย จึงไม่ควรพึ่งพาตลาดนี้เป็นหลัก";

const RESULT2_3 = "AI อธิบายสิทธิประโยชน์ทางการค้าสี่ความตกลงที่ช่วยลดภาษีได้จริง ตัวแรกคือ RCEP สำหรับส่งไปจีน ใช้เอกสาร Form E ลดภาษีจาก 65% เหลือ 0% โดยสินค้าต้องมีสัดส่วนคุณค่าในประเทศ (RVC) ไม่น้อยกว่า 40% และยื่นขอผ่านกรมการค้าต่างประเทศ (DFT) เสียค่าธรรมเนียมประมาณ 500 บาทต่อใบ ตัวที่สองคือความตกลงอาเซียน-อินเดีย (AICEFTA) ใช้ Form D ลดภาษีจากเดิม 50 ถึง 70% ลงมาเหลือ 0 ถึง 5% โดยต้องมี RVC ไม่น้อยกว่า 35% ออกใบรับรองได้ภายใน 2 วันทำการ ตัวที่สามคือความตกลงอาเซียน-เกาหลีใต้ (AKFTA) ใช้ Form AK ได้ภาษี 0% ทันที และตัวที่สี่คือความตกลงการค้าเสรีอาเซียน (AFTA) ซึ่งให้ภาษี 0% กับประเทศสมาชิกอาเซียนทันทีโดยไม่ต้องรออะไรเพิ่ม AI แนะนำว่าหากกังวลเรื่องภาษีสหรัฐฯ ที่สูงถึง 19% ทางเลือกที่คุ้มกว่าคือเปลี่ยนไปเจาะตลาดอินเดียที่ได้ภาษี 0% ผ่าน CEFTA หรือจีนที่ได้ 0% ผ่าน RCEP หรือสหรัฐอาหรับเอมิเรตส์ที่ภาษีเพียง 5% และไม่มีโควต้า แต่ AI เตือนอย่างชัดเจนว่าห้ามใช้วิธีส่งผ่านประเทศที่สามเพื่อหลบเลี่ยงภาษี (transshipment) เพราะถ้ามูลค่าที่แปรรูปในประเทศที่สามเกิน 40% ของมูลค่าสินค้า จะถือเป็นการฉ้อโกงแหล่งกำเนิดสินค้าซึ่งผิดกฎหมายทั้งในไทยและประเทศปลายทาง";

const RESULT2_4 = "AI สรุปทั้งหกตลาดเป็นตารางเดียว ระบุว่าสหรัฐฯ มีภาษีรวม 19% และ landed cost 1.82 ดอลลาร์ ถือเป็นตลาดที่ควรเลี่ยงในช่วงนี้ ส่วนสหภาพยุโรปภาษี 12% (หลังหักสิทธิพิเศษบางส่วน) landed cost 1.70 ดอลลาร์ แนะนำให้ไปพร้อมใบรับรองออร์แกนิก จีนและอินเดียภาษี 0% landed cost ประมาณ 1.49 ถึง 1.50 ดอลลาร์ เป็นตลาดที่น่าไปมากที่สุด เวียดนามภาษี 0% landed cost 1.49 ดอลลาร์ เหมาะเป็นจุดกระจายสินค้า และสหรัฐอาหรับเอมิเรตส์ภาษี 5% landed cost 1.55 ดอลลาร์ เหมาะเป็นศูนย์กลางกระจายต่อตะวันออกกลาง จากนั้น AI ร่างอีเมลภาษาอังกฤษให้ทันทีถึงผู้ซื้อชื่อ Mr. Weber ในเยอรมนี เสนอราคา CIF Hamburg ที่ 1.70 ดอลลาร์ต่อกิโลกรัม ระบุว่าราคานี้ต่ำกว่าคู่แข่งจากเวียดนามที่เสนอ 1.84 ดอลลาร์ถึง 8% และเน้นว่าใบรับรองออร์แกนิกจากหน่วยงาน ACT ของไทยทำให้สินค้าสามารถตั้งราคาขายปลีกในชั้นวางได้ถึง 4.50 ถึง 6.00 ยูโรต่อกิโลกรัม พร้อมระบุกำลังผลิตที่รองรับได้ 50 ถึง 200 ตันต่อเดือน AI ปิดท้ายด้วยข้อสังเกตว่างานวิเคราะห์ทั้งหมดนี้ใช้เวลากับ AI เพียงประมาณ 4 นาที เทียบกับการคำนวณภาษีและต้นทุนด้วยมือเองที่ต้องใช้เวลา 4 ถึง 5 ชั่วโมง คิดเป็นการประหยัดเวลาไปถึง 98%";

async function buildHowTo2() {
  let page = 0; const total = 13;
  howToOpenSlide(H2); page++;
  docStorySlide(DOC2); page++;
  { const d = await imgDim("Sample_Thai_Export_Data.png");
    filePreviewSlide({ accent: H2.accent, label: H2.label, fileName: "Sample_Thai_Export_Data.xlsx (ใช้ไฟล์เดียวกับ HOW TO 1)", previewImage: d.file, _imgDim: d, rows: [
    ["FOB", "ราคา FOB กรุงเทพฯ ของข้าวหอมมะลิเกรด A: $1.45 ต่อกิโลกรัม"],
    ["HS Code", "1006.30.90 — พิกัดศุลกากรข้าวหอมมะลิเกรดพรีเมียม"],
    ["ปริมาณ", "ตัวอย่างออเดอร์ 20,000 กิโลกรัม มูลค่ารวม $29,000"],
  ] }); } page++;
  { const qr = await qrPngUrl(rawUrl("deck/Sample_Thai_Export_Data.xlsx"));
    fileLinkSlide({ accent: H2.accent, label: H2.label, fileName: "Sample_Thai_Export_Data.xlsx", qr,
      desc: "ไฟล์ข้อมูลส่งออกเดียวกับ HOW TO 1 — มีราคา FOB และพิกัดศุลกากรที่ใช้คำนวณภาษีและ landed cost ในขั้นตอนนี้ สแกน QR เพื่อดาวน์โหลด",
      url: rawUrl("deck/Sample_Thai_Export_Data.xlsx") }); } page++;
  actionStepSlide({ accent: H2.accent, label: H2.label, stepNum: 1, stepTotal: total, headline: "เปิดแชตใหม่ที่ chatgpt.com", kind: "mock", mock: "browser", detail: "กด “New chat” เพื่อเริ่มหัวข้อใหม่ แยกจากแชตหาตลาดในขั้นก่อนหน้า" });
  actionStepSlide({ accent: H2.accent, label: H2.label, stepNum: 2, stepTotal: total, headline: "กดปุ่ม “+” ข้างกล่องพิมพ์ข้อความ", kind: "mock", mock: "plusButton", detail: "ปุ่มนี้อยู่ทางซ้ายของกล่องพิมพ์ข้อความ ด้านล่างของหน้าจอ" });
  actionStepSlide({ accent: H2.accent, label: H2.label, stepNum: 3, stepTotal: total, headline: "เลือก “เพิ่มรูปและไฟล์” แล้วแนบใบเสนอราคา", kind: "mock", mock: "attach", detail: "แนบไฟล์ใบเสนอราคาฉบับร่าง หรือพิมพ์ตัวเลข FOB/HS Code ลงในแชตได้เลยถ้าไม่มีไฟล์" });
  actionStepSlide({ accent: H2.accent, label: H2.label, stepNum: 4, stepTotal: total, headline: "รอจนไฟล์อัปโหลดเสร็จ", kind: "mock", mock: "uploaded", detail: "เห็นชื่อไฟล์เป็นการ์ดในกล่องแชตแล้ว พร้อมพิมพ์คำสั่งต่อ" });
  { const qr = await qrPng(STEP2_1_PROMPT);
    actionStepSlide({ accent: H2.accent, label: H2.label, stepNum: 5, stepTotal: total, headline: "พิมพ์คำสั่งถามภาษีนำเข้าสหรัฐฯ แล้วกดส่ง", kind: "qr", qr, promptText: STEP2_1_PROMPT, detail: "สแกน QR ทางขวาเพื่อเปิดแชตพร้อมข้อความนี้บนมือถือ" }); }
  resultSlide({ accent: H2.accent, label: H2.label, title: "AI ตอบ — ภาษีนำเข้าสหรัฐฯ และ landed cost", body: RESULT2_1, fontSize: 15 });
  { const qr = await qrPng(STEP2_2_PROMPT);
    actionStepSlide({ accent: H2.accent, label: H2.label, stepNum: 6, stepTotal: total, headline: "พิมพ์คำสั่งเทียบ landed cost หลายตลาด", kind: "qr", qr, promptText: STEP2_2_PROMPT, detail: "พิมพ์ต่อในแชตเดิม AI จะใช้ข้อมูลและตัวเลขจากคำตอบก่อนหน้าต่อเนื่อง" }); }
  resultSlide({ accent: H2.accent, label: H2.label, title: "AI ตอบ — เปรียบเทียบ landed cost 5 ตลาด", body: RESULT2_2, fontSize: 15 });
  { const qr = await qrPng(STEP2_3_PROMPT);
    actionStepSlide({ accent: H2.accent, label: H2.label, stepNum: 7, stepTotal: total, headline: "พิมพ์คำสั่งถามสิทธิประโยชน์ทางการค้า (FTA)", kind: "qr", qr, promptText: STEP2_3_PROMPT, detail: "คำตอบนี้จะบอกว่าใช้เอกสารอะไรขอภาษี 0% ได้" }); }
  resultSlide({ accent: H2.accent, label: H2.label, title: "AI ตอบ — สิทธิประโยชน์ FTA ที่ใช้ได้จริง", body: RESULT2_3, fontSize: 15 });
  { const qr = await qrPng(STEP2_4_PROMPT);
    actionStepSlide({ accent: H2.accent, label: H2.label, stepNum: 8, stepTotal: total, headline: "พิมพ์คำสั่งให้สรุปตารางและร่างอีเมลเสนอราคา", kind: "qr", qr, promptText: STEP2_4_PROMPT, detail: "เปลี่ยนชื่อผู้ซื้อ/ตลาดในข้อความให้ตรงกับลูกค้าจริงของคุณ" }); }
  resultSlide({ accent: H2.accent, label: H2.label, title: "AI ตอบ — ตารางสรุป + อีเมลเสนอราคา CIF Hamburg", body: RESULT2_4, fontSize: 14.5 });
  closingSlide({
    num: 2,
    headline: "จากราคา FOB เดียว สู่ต้นทุนแท้จริงในทุกตลาด",
    recap: [
      "รู้ภาษีนำเข้าจริงตาม HS Code รวมภาษีตอบโต้ของแต่ละตลาด",
      "เทียบ landed cost ต่อกิโลกรัมได้ครบ 5 ตลาดในไม่กี่นาที",
      "รู้ว่าต้องใช้เอกสารสิทธิพิเศษ FTA ใดเพื่อลดภาษีเหลือ 0%",
      "ได้ตารางสรุป + อีเมลเสนอราคาพร้อมส่งให้ผู้ซื้อจริง",
    ],
    next: "ขั้นต่อไป (HOW TO 3): ให้ AI ร่างเอกสารส่งออก (Invoice/Packing List) จากข้อมูลออเดอร์จริง",
  });
  return page;
}

// ════════════════════════════════════════════════════════════════════════════
// HOW TO 3 CONTENT — ร่างเอกสารส่งออกจากข้อมูลออเดอร์
// ════════════════════════════════════════════════════════════════════════════
const H3 = {
  num: 3, accent: P.d4, label: "HOW TO 3 · สร้างเอกสารส่งออก",
  title: "AI ร่าง Commercial Invoice และ Packing List\nให้ภายในไม่กี่สิบวินาที",
  objective: "ให้ AI ช่วยลดงานคีย์เอกสารซ้ำที่ทีมส่งออกต้องทำทุกออเดอร์ — แทนที่จะพิมพ์ Invoice และ Packing List ใหม่ทุกครั้งจากศูนย์",
  scenario: "Siam Rice ปิดออเดอร์กับ EuroFood GmbH ที่เมืองฮัมบูร์กได้แล้ว ตามที่ตกลงราคาไว้ในขั้นก่อนหน้า ตอนนี้ต้องออกเอกสารส่งออกชุดแรกให้ทันกำหนดเรือออก",
  problem: "การคีย์เอกสารส่งออกด้วยมือใช้เวลานานและเสี่ยงพิมพ์ตัวเลขผิด พนักงานต้องเปิดหลายไฟล์พร้อมกันแล้วคัดลอกข้อมูลไปวางในแบบฟอร์มที่ต่างกัน เสียเวลา 15 ถึง 20 นาทีต่อเอกสารหนึ่งชุด",
  aiTask: "ให้ AI อ่านข้อมูลออเดอร์ที่มีอยู่แล้ว แล้วร่าง Commercial Invoice และ Packing List ให้ตรงกันทุกตัวเลข พร้อมตรวจสอบว่าเอกสารชุดใดที่อุตสาหกรรมและตลาดปลายทางต้องใช้ และแก้ไขให้ตรงตามข้อกำหนดเฉพาะของประเทศปลายทาง",
  outcome: "ได้เอกสารส่งออกชุดแรกที่ถูกต้องตรงกันทุกตัวเลขภายในไม่กี่สิบวินาที พร้อมรายการเอกสาร/ใบรับรองที่ต้องเตรียมเพิ่มตามกฎของตลาดปลายทาง",
};

const DOC3 = {
  accent: P.d4, label: "HOW TO 3 · เอกสาร/ข้อมูลที่ใช้",
  docName: "Invoice INV-2026-014 — ออเดอร์ EuroFood GmbH",
  story: "ทีมขายมีข้อมูลออเดอร์อยู่แล้วในอีเมลยืนยันคำสั่งซื้อ ระบุว่าจัดส่งข้าวหอมมะลิ 1,200 กระสอบ กระสอบละ 25 กิโลกรัม รวม 30,000 กิโลกรัมสุทธิ ลงเรือ EVER GIVEN 2 เที่ยวเรือ VOY-2026-018 — สิ่งที่ต้องทำต่อคือแปลงข้อมูลนี้เป็น Invoice และ Packing List ที่ใช้ยื่นกับธนาคารและศุลกากรได้จริง",
  stats: [["1,200", "กระสอบ × 25 กก."], ["30,000 kg", "น้ำหนักสุทธิรวม"], ["24", "พาเลท (ISPM-15)"], ["28 วิ", "เวลาที่ AI ใช้ร่างเอกสาร"]],
  useNext: "ในขั้นต่อไป เราจะให้ AI อ่านข้อมูลออเดอร์นี้แล้วร่างเอกสารส่งออกให้ครบชุด พร้อมตรวจว่าตัวเลขในทุกเอกสารตรงกัน 100%",
  foot: "ไฟล์ตัวอย่างอีเมลยืนยันคำสั่งซื้อดาวน์โหลดได้จาก QR ในภาคผนวกท้ายเล่ม",
};

const STEP3_1_PROMPT = "จากข้อมูลออเดอร์นี้ (Siam Rice ขายให้ EuroFood GmbH ฮัมบูร์ก ข้าวหอมมะลิ 1,200 กระสอบ x 25kg = 30,000kg สุทธิ ลงเรือ EVER GIVEN 2 เที่ยว VOY-2026-018) ช่วยร่าง Commercial Invoice และ Packing List ฉบับสมบูรณ์ให้หน่อย ใส่เลขที่เอกสาร INV-2026-014 และ PL-2026-014";
const STEP3_2_PROMPT = "เอกสารส่งออกชุดนี้เป็นสินค้าข้าว/อาหารส่งไปสหภาพยุโรป ต้องเตรียมเอกสารและใบรับรองอะไรเพิ่มอีกบ้างให้ครบตามข้อกำหนดของอุตสาหกรรมอาหารและตลาดปลายทางนี้";
const STEP3_3_PROMPT = "เอกสารชุดนี้จะส่งไปเยอรมนี ช่วยตรวจว่ามีอะไรต้องแก้เพิ่มเพื่อให้ผ่านศุลกากรสหภาพยุโรป เช่น เลข EORI ของผู้ซื้อ ประเทศแหล่งกำเนิดสินค้า การแยกน้ำหนักรายบรรทัด และพิกัดศุลกากร 8 หลัก แล้วตรวจความสอดคล้องของตัวเลขทั้งหมดอีกครั้ง";

const RESULT3_1 = "ภายในเวลาเพียง 28 วินาที AI ร่าง Packing List เลขที่ PL-2026-014 ให้ครบถ้วน โดยอ้างอิงตัวเลขทุกตัวมาจาก Invoice INV-2026-014 อย่างตรงกัน เอกสารระบุผู้ส่งสินค้าคือ Siam Rice ผู้รับสินค้าคือ EuroFood GmbH ที่เมืองฮัมบูร์ก ลงเรือ EVER GIVEN 2 เที่ยวเรือ VOY-2026-018 พร้อมเครื่องหมายหน้าหีบ (shipping marks) ว่า EFG/HAMBURG/2026/NO.1-1200 ระบุจำนวน 1,200 กระสอบ กระสอบละ 25 กิโลกรัม รวมเป็นน้ำหนักสุทธิ 30,000 กิโลกรัมและน้ำหนักรวมบรรจุภัณฑ์ 30,600 กิโลกรัม จัดเรียงบนพาเลท 24 พาเลทที่ผ่านมาตรฐาน ISPM-15 สำหรับบรรจุภัณฑ์ไม้ AI ยืนยันว่าตัวเลขทั้งหมดในสองเอกสารตรงกัน 100% ไม่มีจุดที่ต้องแก้ไข และที่สำคัญคือทีมไม่ต้องคีย์ข้อมูลซ้ำด้วยมือเลยแม้แต่ตัวเดียว ซึ่งปกติงานแบบนี้ใช้เวลา 15 ถึง 20 นาทีต่อเอกสารหนึ่งชุดถ้าทำด้วยมือ";

const RESULT3_2 = "AI อธิบายว่าเอกสารที่ต้องใช้จะต่างกันไปตามประเภทสินค้าและตลาดปลายทาง สำหรับสินค้าอาหารและเกษตรที่ส่งไปสหภาพยุโรปอย่างกรณีนี้ ต้องมีอย่างน้อยห้าชุด ได้แก่ Commercial Invoice และ Packing List ที่ร่างไว้แล้ว ใบรับรองแหล่งกำเนิดสินค้า (C/O) แบบ Form A หรือ EUR.1 เพื่อขอใช้สิทธิพิเศษทางภาษี ใบรับรองสุขอนามัยพืช (Phytosanitary Certificate) ที่ต้องขอจากกรมวิชาการเกษตรในราคาประมาณ 500 บาทต่อใบ และถ้าสินค้าผ่านการแปรรูปเพิ่มเติมต้องมีใบรับรองสุขอนามัย (Health Certificate) จากสำนักงานคณะกรรมการอาหารและยาของไทยด้วย หากต้องการเน้นจุดขายด้านออร์แกนิก ควรแนบใบรับรองออร์แกนิกจากหน่วยงาน ACT หรือ IFOAM ไปด้วย AI ยังให้ตัวอย่างเอกสารของอุตสาหกรรมอื่นเพื่อเทียบให้เห็นว่าแต่ละอุตสาหกรรมมีข้อกำหนดต่างกันมาก เช่น สิ่งทอส่งไปสหรัฐฯ ต้องมีใบประกาศส่วนผสมเส้นใย (Fiber Content Declaration) และถ้าเป็นเสื้อผ้าเด็กต้องผ่านมาตรฐาน CPSC เพิ่ม เหล็กและโลหะส่งไปยุโรปตั้งแต่ปี 2026 ต้องมีใบรับรองผลทดสอบโรงงาน (Mill Test Certificate) และแบบฟอร์ม CBAM Declaration ที่เป็นข้อบังคับใหม่ ส่วนเครื่องมือแพทย์ต้องมีตรา CE หรือผ่านการขึ้นทะเบียน FDA 510(k) พร้อมมาตรฐาน ISO 13485";

const RESULT3_3 = "AI ตรวจพบจุดที่ต้องแก้ไขก่อนส่งจริงสี่จุด จุดแรกคือเอกสารยังไม่มีเลข EORI ของผู้ซื้อซึ่งเป็นเลขทะเบียนผู้ประกอบการที่สหภาพยุโรปกำหนดให้ต้องระบุบนช่องผู้รับสินค้าของ Invoice เช่นเลข DE4567890123 ถ้าไม่มีเลขนี้สินค้าอาจถูกกักที่ท่าเรือฮัมบูร์ก จุดที่สองคือต้องระบุประเทศแหล่งกำเนิดสินค้าว่า THAILAND ให้ปรากฏชัดเจนในทุกเอกสาร จุดที่สามคือ Packing List ต้องแยกน้ำหนักสุทธิและน้ำหนักรวมเป็นรายบรรทัดสินค้า ไม่ใช่แค่ตัวเลขรวมท้ายเอกสาร และจุดที่สี่คือพิกัดศุลกากรของสหภาพยุโรปต้องใช้รหัส CN แปดหลักคือ 1006.30.27 ไม่ใช่รหัสไทยหกหลักที่ใช้อยู่ หลังจากแก้ไขครบทั้งสี่จุด AI ตรวจสอบความสอดคล้องอีกครั้งและยืนยันว่าทุกตัวเลขตรงกันแล้ว ทั้งจำนวน 1,200 กระสอบ มูลค่ารวม 36,000 ดอลลาร์ ราคา FOB กรุงเทพฯ เลข EORI ประเทศแหล่งกำเนิด และพิกัดศุลกากร ทำให้เอกสารทั้งห้าชุด (Invoice, Packing List, C/O, Phytosanitary, Bill of Lading) พร้อมยื่นโดยไม่มีข้อขัดแย้ง และธนาคารที่รับเอกสารตาม L/C จะตรวจผ่านได้แน่นอน";

async function buildHowTo3() {
  let page = 0; const total = 11;
  howToOpenSlide(H3); page++;
  docStorySlide(DOC3); page++;
  { const d = await imgDim("A1_MultiProduct_Invoice_INV-2026-087.png");
    filePreviewSlide({ accent: H3.accent, label: H3.label, fileName: "A1_MultiProduct_Invoice_INV-2026-087.pdf", previewImage: d.file, _imgDim: d, rows: [
    ["ผู้ขาย/ผู้ซื้อ", "Siam Rice Co., Ltd. → ผู้ซื้อต่างประเทศ พร้อมที่อยู่และเลขทะเบียนเต็มรูปแบบ"],
    ["รายการสินค้า", "หลายรายการในใบเดียว (multi-product) แต่ละบรรทัดมี HS Code น้ำหนัก ราคาต่อหน่วยแยกกัน"],
    ["เงื่อนไข", "Incoterm + วิธีชำระเงิน + เลขที่ใบสั่งซื้ออ้างอิงระบุไว้ครบที่หัวเอกสาร"],
  ] }); } page++;
  { const qr = await qrPngUrl(rawUrl("handoff/02_documents_assets/A1_MultiProduct_Invoice_INV-2026-087.pdf"));
    fileLinkSlide({ accent: H3.accent, label: H3.label, fileName: "A1_MultiProduct_Invoice_INV-2026-087.pdf", qr,
      desc: "ตัวอย่าง Commercial Invoice จริงที่มีหลายรายการสินค้าในใบเดียว ใช้เป็นต้นแบบรูปแบบเอกสารที่ AI จะช่วยร่างให้ในขั้นถัดไป",
      url: rawUrl("handoff/02_documents_assets/A1_MultiProduct_Invoice_INV-2026-087.pdf") }); } page++;
  { const d = await imgDim("A2_MultiProduct_PackingList_PL-2026-087.png");
    filePreviewSlide({ accent: H3.accent, label: H3.label, fileName: "A2_MultiProduct_PackingList_PL-2026-087.pdf", previewImage: d.file, _imgDim: d, rows: [
    ["คู่กับ Invoice", "เลขที่เอกสารอ้างอิงกลับไปยัง Invoice ฉบับเดียวกัน ตัวเลขต้องตรงกันทุกบรรทัด"],
    ["น้ำหนัก/บรรจุภัณฑ์", "แยกน้ำหนักสุทธิและน้ำหนักรวมเป็นรายบรรทัดสินค้า พร้อมจำนวนพาเลท/หีบ"],
    ["เครื่องหมายหน้าหีบ", "Shipping marks ระบุชื่อผู้รับ ปลายทาง และเลขลำดับกล่อง"],
  ] }); } page++;
  { const qr = await qrPngUrl(rawUrl("handoff/02_documents_assets/A2_MultiProduct_PackingList_PL-2026-087.pdf"));
    fileLinkSlide({ accent: H3.accent, label: H3.label, fileName: "A2_MultiProduct_PackingList_PL-2026-087.pdf", qr,
      desc: "ตัวอย่าง Packing List คู่กันกับ Invoice ฉบับก่อนหน้า ใช้ดูว่าตัวเลขทั้งสองเอกสารต้องตรงกันแบบไหนก่อนยื่นจริง",
      url: rawUrl("handoff/02_documents_assets/A2_MultiProduct_PackingList_PL-2026-087.pdf") }); } page++;
  actionStepSlide({ accent: H3.accent, label: H3.label, stepNum: 1, stepTotal: total, headline: "เปิดแชตใหม่ที่ chatgpt.com", kind: "mock", mock: "browser", detail: "กด “New chat” เพื่อเริ่มหัวข้อใหม่สำหรับงานร่างเอกสารส่งออก" });
  actionStepSlide({ accent: H3.accent, label: H3.label, stepNum: 2, stepTotal: total, headline: "กดปุ่ม “+” ข้างกล่องพิมพ์ข้อความ แล้วแนบอีเมลยืนยันคำสั่งซื้อ", kind: "mock", mock: "attach", detail: "หรือพิมพ์รายละเอียดออเดอร์ลงในแชตตรงๆ ก็ได้ถ้าไม่มีไฟล์แนบ" });
  actionStepSlide({ accent: H3.accent, label: H3.label, stepNum: 3, stepTotal: total, headline: "รอจนไฟล์อัปโหลดเสร็จ", kind: "mock", mock: "uploaded", detail: "เห็นชื่อไฟล์เป็นการ์ดในกล่องแชตแล้ว พร้อมพิมพ์คำสั่งต่อ" });
  { const qr = await qrPng(STEP3_1_PROMPT);
    actionStepSlide({ accent: H3.accent, label: H3.label, stepNum: 4, stepTotal: total, headline: "พิมพ์คำสั่งให้ร่าง Invoice + Packing List", kind: "qr", qr, promptText: STEP3_1_PROMPT, detail: "สแกน QR ทางขวาเพื่อเปิดแชตพร้อมข้อความนี้บนมือถือ" }); }
  resultSlide({ accent: H3.accent, label: H3.label, title: "AI ตอบ — Invoice + Packing List ฉบับสมบูรณ์", body: RESULT3_1, fontSize: 15 });
  { const qr = await qrPng(STEP3_2_PROMPT);
    actionStepSlide({ accent: H3.accent, label: H3.label, stepNum: 5, stepTotal: total, headline: "พิมพ์คำสั่งถามว่าต้องเตรียมเอกสารเพิ่มอะไร", kind: "qr", qr, promptText: STEP3_2_PROMPT, detail: "พิมพ์ต่อในแชตเดิม ระบุประเภทสินค้าและตลาดปลายทางให้ชัดเจน" }); }
  resultSlide({ accent: H3.accent, label: H3.label, title: "AI ตอบ — รายการเอกสาร/ใบรับรองที่ต้องเตรียม", body: RESULT3_2, fontSize: 15 });
  { const qr = await qrPng(STEP3_3_PROMPT);
    actionStepSlide({ accent: H3.accent, label: H3.label, stepNum: 6, stepTotal: total, headline: "พิมพ์คำสั่งให้ตรวจแก้ตามกฎปลายทางอีกครั้ง", kind: "qr", qr, promptText: STEP3_3_PROMPT, detail: "AI จะชี้จุดที่ต้องแก้และยืนยันความสอดคล้องของตัวเลขทั้งหมด" }); }
  resultSlide({ accent: H3.accent, label: H3.label, title: "AI ตอบ — แก้ไขครบ 4 จุด + ยืนยันความสอดคล้อง", body: RESULT3_3, fontSize: 14.5 });
  closingSlide({
    num: 3,
    headline: "จากอีเมลยืนยันออเดอร์ สู่เอกสารส่งออกที่พร้อมยื่นจริง",
    recap: [
      "ร่าง Invoice + Packing List ตรงกันทุกตัวเลขภายใน 28 วินาที",
      "รู้รายการเอกสาร/ใบรับรองที่ต้องเตรียมตามอุตสาหกรรมและตลาดปลายทาง",
      "AI ตรวจและแก้ไขตามข้อกำหนดเฉพาะของประเทศปลายทางให้ครบ",
      "เอกสารทั้งชุดพร้อมยื่นธนาคาร/ศุลกากรโดยไม่มีข้อขัดแย้ง",
    ],
    next: "ขั้นต่อไป (HOW TO 4): ให้ AI อ่าน-สกัดข้อมูลจากเอกสารที่มีอยู่ พร้อมตรวจความเสี่ยงตามกฎปลายทาง",
  });
  return page;
}

// ════════════════════════════════════════════════════════════════════════════
// HOW TO 4 CONTENT — อ่าน/สกัดข้อมูลจากเอกสารส่งออก + ตรวจความเสี่ยง
// ════════════════════════════════════════════════════════════════════════════
const H4 = {
  num: 4, accent: P.d2, label: "HOW TO 4 · อ่านเอกสารส่งออก",
  title: "AI อ่านและสกัดข้อมูลจากเอกสารส่งออก\nพร้อมตรวจความเสี่ยงก่อนเรือออก",
  objective: "ให้ AI ช่วยอ่านเอกสารที่มีอยู่แล้วแทนการนั่งไล่ดูทีละบรรทัด แล้วช่วยจับความเสี่ยงที่อาจทำให้สินค้าถูกกักหรือเงินไม่เข้าตามนัด",
  scenario: "Siam Garment Co. ได้รับ Invoice ฉบับร่างจากฝ่ายขายสำหรับออเดอร์เสื้อยืดผ้าฝ้ายส่งไป Fashion Import GmbH ที่เยอรมนี ต้องตรวจสอบให้ครบก่อนส่งเอกสารจริง",
  problem: "เอกสารส่งออกมีฟิลด์ข้อมูลจำนวนมาก การอ่านด้วยตาเปล่าเสี่ยงพลาดจุดสำคัญ เช่น เลขทะเบียนที่ขาดหรือพิกัดศุลกากรที่ไม่ครบหลัก ซึ่งอาจทำให้สินค้าถูกกักที่ท่าเรือปลายทาง",
  aiTask: "ให้ AI อ่าน Invoice แล้ว (1) สกัดข้อมูลสำคัญทั้งหมดออกมาเป็นรายการที่ตรวจสอบง่าย (2) ชี้จุดเสี่ยงที่อาจทำให้เกิดปัญหาที่ศุลกากรหรือธนาคาร (3) แนะนำใบรับรองที่ต้องเตรียมเพิ่มสำหรับสินค้าและตลาดปลายทางนี้",
  outcome: "ได้ข้อมูลที่สกัดแล้วพร้อมใช้ในระบบอื่น และรู้จุดเสี่ยงทั้งหมดก่อนส่งเอกสารจริง — ลดความเสี่ยงสินค้าถูกกักหรือธนาคารปฏิเสธจ่ายเงิน",
};

const DOC4 = {
  accent: P.d2, label: "HOW TO 4 · เอกสาร/ข้อมูลที่ใช้",
  docName: "Invoice INV-TX-2026-051 — เสื้อยืดผ้าฝ้ายส่งฮัมบูร์ก",
  story: "ฝ่ายขายร่าง Invoice สำหรับออเดอร์เสื้อยืดผ้าฝ้าย 5,000 ตัว ขายให้ Fashion Import GmbH ที่เยอรมนีในราคา 2.50 ดอลลาร์ต่อตัว มูลค่ารวม 12,500 ดอลลาร์ เงื่อนไข FOB กรุงเทพฯ ชำระด้วย L/C at sight — เอกสารนี้ต้องผ่านการตรวจสอบให้ครบก่อนส่งจริง",
  stats: [["5,000", "ตัว เสื้อยืดผ้าฝ้าย"], ["6109.10", "HS Code (6 หลัก)"], ["$12,500", "มูลค่ารวม FOB"], ["8 วิ", "เวลาที่ AI ใช้สกัดข้อมูล"]],
  useNext: "ในขั้นต่อไป เราจะให้ AI อ่าน Invoice นี้แล้วสกัดข้อมูลสำคัญทั้งหมด พร้อมตรวจหาจุดเสี่ยงก่อนส่งเอกสารจริงให้ผู้ซื้อและธนาคาร",
  foot: "ไฟล์ตัวอย่าง Invoice นี้ดาวน์โหลดได้จาก QR ในภาคผนวกท้ายเล่ม",
};

const STEP4_1_PROMPT = "อ่าน Invoice ฉบับนี้ (Siam Garment Co. ขายเสื้อยืดผ้าฝ้าย HS 6109.10 5,000 ตัว ให้ Fashion Import GmbH เยอรมนี ราคา $2.50/ตัว รวม $12,500 FOB กรุงเทพฯ L/C at sight) แล้วสกัดข้อมูลสำคัญทั้งหมดออกมาเป็นรายการที่ตรวจสอบง่าย พร้อมบอกว่าแต่ละฟิลด์ตรงกันหรือไม่";
const STEP4_2_PROMPT = "จากข้อมูลที่สกัดมา ช่วยตรวจหาจุดเสี่ยงที่อาจทำให้สินค้าถูกกักที่ศุลกากรเยอรมนีหรือธนาคารปฏิเสธจ่ายเงินตาม L/C บอกระดับความเสี่ยงและอ้างอิงกฎที่เกี่ยวข้องด้วย";
const STEP4_3_PROMPT = "ออเดอร์นี้จะส่งไปฮัมบูร์ก ต้องเตรียมใบรับรองอะไรเพิ่มอีกบ้าง โดยเฉพาะถ้าเป็นเสื้อผ้าเด็ก และถ้าจะเปลี่ยนไปส่งสหรัฐฯ แทนต้องเตรียมอะไรต่างไปบ้าง";

const RESULT4_1 = "ภายในเวลาเพียง 8 วินาที AI สกัดข้อมูลสำคัญออกมาได้ครบ 15 ฟิลด์จาก Invoice ฉบับนี้ ได้แก่ ผู้ขายคือ Siam Garment Co. ผู้ซื้อคือ Fashion Import GmbH ที่เยอรมนี สินค้าคือเสื้อยืดผ้าฝ้ายภายใต้พิกัดศุลกากร 6109.10 จำนวน 5,000 ตัว น้ำหนักสุทธิ 1,000 กิโลกรัม (เฉลี่ยตัวละ 200 กรัม) น้ำหนักรวมบรรจุภัณฑ์ 1,150 กิโลกรัม ราคาต่อหน่วย 2.50 ดอลลาร์ คิดเป็นมูลค่ารวม 12,500 ดอลลาร์ เงื่อนไขการส่งมอบแบบ FOB กรุงเทพฯ และวิธีชำระเงินแบบเลตเตอร์ออฟเครดิตที่จ่ายเมื่อเห็นเอกสาร (L/C at sight) AI ตรวจสอบไขว้ทุกฟิลด์โดยอัตโนมัติและยืนยันว่าตัวเลขน้ำหนัก ราคา และจำนวนสอดคล้องกันทั้งหมด ไม่มีความขัดแย้งภายในเอกสารฉบับนี้ ข้อมูลที่สกัดได้นี้สามารถส่งออกไปต่อได้หลายรูปแบบ ทั้งไฟล์ Excel ไฟล์ JSON สำหรับเชื่อมระบบ แบบฟอร์มศุลกากร หรือนำเข้าระบบ ERP ของบริษัทได้ทันทีโดยไม่ต้องคีย์ซ้ำ";

const RESULT4_2 = "AI พบจุดเสี่ยงสามจุดที่ต้องแก้ไขก่อนส่งเอกสารจริง จุดแรกเป็นความเสี่ยงระดับสูงคือ Invoice ยังไม่มีเลข EORI ของผู้ซื้อ Fashion Import GmbH ซึ่งตามระเบียบสหภาพยุโรป EC 2913/92 และฉบับแก้ไขปี 2024 กำหนดให้ผู้นำเข้าในยุโรปทุกรายต้องมีเลขนี้ ถ้าไม่มีจะทำให้สินค้าถูกกักไว้ที่ท่าเรือฮัมบูร์กหรือเมืองแอนต์เวิร์ป จุดที่สองเป็นความเสี่ยงระดับกลางคือพิกัดศุลกากรที่ระบุไว้มีเพียง 6 หลักคือ 6109.10 แต่ระบบ TARIC ของสหภาพยุโรปกำหนดให้ต้องระบุครบ 10 หลักคือ 6109.10.0010 จึงต้องเพิ่มหลักที่เหลือให้ครบก่อนยื่นศุลกากร และจุดที่สามคือเอกสารไม่ได้ระบุระยะเวลาการยื่นเอกสารตาม L/C ไว้อย่างชัดเจน ซึ่งตามกฎ UCP 600 ข้อ 14(c) หากไม่ระบุไว้จะถือว่ามีเวลายื่นเอกสารได้ 21 วันโดยอัตโนมัติ แต่ AI แนะนำว่าควรระบุไว้อย่างชัดเจนในเอกสารเพื่อป้องกันความเข้าใจผิด ส่วนจุดอื่นๆ ทั้งน้ำหนัก ราคา เงื่อนไขการส่งมอบ ชนิดสินค้า และจำนวน ตรวจสอบแล้วผ่านทั้งหมดไม่มีความเสี่ยง";

const RESULT4_3 = "สำหรับออเดอร์ที่จะส่งไปฮัมบูร์ก AI แนะนำให้เตรียมใบรับรองแหล่งกำเนิดสินค้าแบบ Form A ภายใต้สิทธิพิเศษ GSP ของสหภาพยุโรป ซึ่งขอได้ภายใน 2 วันผ่านสภาหอการค้าไทย ช่วยลดภาษีนำเข้าจาก 12% ลงเหลือ 0% ประหยัดได้ประมาณ 1,500 ดอลลาร์ต่อออเดอร์ เสียค่าธรรมเนียมเพียง 600 ถึง 800 บาท ส่วนเลข EORI ที่ยังขาดอยู่ต้องให้ผู้ซื้อเป็นผู้แจ้งมาเพิ่ม ส่วน Packing List สามารถให้ AI สร้างต่อจากข้อมูลที่สกัดไว้แล้วได้ทันที และใบตราส่งสินค้า (Bill of Lading) ต้องขอจากสายการเดินเรือที่ใช้บริการ AI เตือนเป็นกรณีพิเศษว่าถ้าสินค้านี้เป็นเสื้อผ้าเด็กจะต้องมีมาตรฐานเพิ่มอีกสามอย่างคือ EN 14682:2014 เรื่องสายรัดและเชือกผูกที่ปลอดภัย EN 14878:2007 เรื่องการติดไฟของเนื้อผ้า และต้องผ่านระเบียบ REACH ที่ตรวจสารเคมีอย่างสาร PFAS และสีย้อม AZO รวมถึงควรขอมาตรฐาน Oeko-Tex Standard 100 เพิ่มซึ่งจะช่วยเพิ่มมูลค่าสินค้าได้ถึง 20% หากเปลี่ยนไปส่งสหรัฐฯ แทน ต้องเตรียมต่างออกไปคือตรวจสอบสารตะกั่วในสีให้ไม่เกิน 100 ส่วนในล้านส่วนตามมาตรฐาน CPSC ติดป้ายข้อมูลการดูแลรักษาผ้าตามกฎ FTC และติดป้ายแหล่งกำเนิดสินค้าว่า Made in Thailand ให้ชัดเจนบนสินค้าทุกชิ้น";

async function buildHowTo4() {
  let page = 0; const total = 11;
  howToOpenSlide(H4); page++;
  docStorySlide(DOC4); page++;
  { const d = await imgDim("B1_HardCase_Invoice_INV-2026-LC-099.png");
    filePreviewSlide({ accent: H4.accent, label: H4.label, fileName: "B1_HardCase_Invoice_INV-2026-LC-099.pdf", previewImage: d.file, _imgDim: d, rows: [
    ["ผู้ขาย/ผู้ซื้อ", "Siam Garment Co. → Fashion Import GmbH ประเทศเยอรมนี พร้อมที่อยู่เต็มรูปแบบ"],
    ["สินค้า", "เสื้อยืดผ้าฝ้าย พิกัดศุลกากร 6109.10 จำนวน 5,000 ตัว"],
    ["เงื่อนไข", "FOB กรุงเทพฯ ชำระเงินแบบ L/C at sight — แต่ขาดเลข EORI ของผู้ซื้อ"],
  ] }); } page++;
  { const qr = await qrPngUrl(rawUrl("handoff/02_documents_assets/B1_HardCase_Invoice_INV-2026-LC-099.pdf"));
    fileLinkSlide({ accent: H4.accent, label: H4.label, fileName: "B1_HardCase_Invoice_INV-2026-LC-099.pdf", qr,
      desc: "ตัวอย่าง Invoice จริงที่มีจุดเสี่ยงซ่อนอยู่ (ขาดเลข EORI, พิกัดศุลกากรไม่ครบหลัก) — ใช้ฝึกให้ AI สกัดข้อมูลและตรวจความเสี่ยงในขั้นถัดไป",
      url: rawUrl("handoff/02_documents_assets/B1_HardCase_Invoice_INV-2026-LC-099.pdf") }); } page++;
  actionStepSlide({ accent: H4.accent, label: H4.label, stepNum: 1, stepTotal: total, headline: "เปิดแชตใหม่ที่ chatgpt.com", kind: "mock", mock: "browser", detail: "กด “New chat” เพื่อเริ่มหัวข้อใหม่สำหรับงานอ่านเอกสาร" });
  actionStepSlide({ accent: H4.accent, label: H4.label, stepNum: 2, stepTotal: total, headline: "กดปุ่ม “+” แล้วแนบไฟล์ Invoice", kind: "mock", mock: "attach", detail: "แนบไฟล์ Invoice INV-TX-2026-051 หรือเอกสารส่งออกจริงของคุณ" });
  actionStepSlide({ accent: H4.accent, label: H4.label, stepNum: 3, stepTotal: total, headline: "รอจนไฟล์อัปโหลดเสร็จ", kind: "mock", mock: "uploaded", detail: "เห็นชื่อไฟล์เป็นการ์ดในกล่องแชตแล้ว พร้อมพิมพ์คำสั่งต่อ" });
  { const qr = await qrPng(STEP4_1_PROMPT);
    actionStepSlide({ accent: H4.accent, label: H4.label, stepNum: 4, stepTotal: total, headline: "พิมพ์คำสั่งให้สกัดข้อมูลสำคัญออกมา", kind: "qr", qr, promptText: STEP4_1_PROMPT, detail: "สแกน QR ทางขวาเพื่อเปิดแชตพร้อมข้อความนี้บนมือถือ" }); }
  resultSlide({ accent: H4.accent, label: H4.label, title: "AI ตอบ — สกัดข้อมูล 15 ฟิลด์ใน 8 วินาที", body: RESULT4_1, fontSize: 15 });
  { const qr = await qrPng(STEP4_2_PROMPT);
    actionStepSlide({ accent: H4.accent, label: H4.label, stepNum: 5, stepTotal: total, headline: "พิมพ์คำสั่งให้ตรวจหาจุดเสี่ยง", kind: "qr", qr, promptText: STEP4_2_PROMPT, detail: "พิมพ์ต่อในแชตเดิม AI จะใช้ข้อมูลที่สกัดไว้แล้วมาตรวจต่อ" }); }
  resultSlide({ accent: H4.accent, label: H4.label, title: "AI ตอบ — พบ 3 จุดเสี่ยง พร้อมระดับความเสี่ยง", body: RESULT4_2, fontSize: 14.5 });
  { const qr = await qrPng(STEP4_3_PROMPT);
    actionStepSlide({ accent: H4.accent, label: H4.label, stepNum: 6, stepTotal: total, headline: "พิมพ์คำสั่งถามใบรับรองที่ต้องเตรียมเพิ่ม", kind: "qr", qr, promptText: STEP4_3_PROMPT, detail: "ระบุตลาดปลายทางและประเภทสินค้าเฉพาะให้ชัดเจน" }); }
  resultSlide({ accent: H4.accent, label: H4.label, title: "AI ตอบ — ใบรับรองที่ต้องเตรียม + กรณีพิเศษ", body: RESULT4_3, fontSize: 14.5 });
  closingSlide({
    num: 4,
    headline: "จาก Invoice หนึ่งใบ สู่ข้อมูลที่ตรวจสอบแล้วและความเสี่ยงที่รู้ล่วงหน้า",
    recap: [
      "สกัดข้อมูลสำคัญจากเอกสารได้ครบใน 8 วินาที พร้อมส่งออกไปใช้ต่อได้",
      "พบจุดเสี่ยงที่อาจทำให้สินค้าถูกกักหรือธนาคารปฏิเสธจ่ายเงิน",
      "รู้ว่าต้องอ้างอิงกฎข้อไหน (UCP 600 / EU Customs) เพื่อแก้ไขให้ถูกต้อง",
      "รู้ใบรับรองที่ต้องเตรียมเพิ่มตามตลาดปลายทางและกรณีพิเศษของสินค้า",
    ],
    next: "ขั้นต่อไป (HOW TO 5): ให้ AI ตรวจความสอดคล้องระหว่างเอกสารหลายชุดในออเดอร์เดียวกัน",
  });
  return page;
}

// ════════════════════════════════════════════════════════════════════════════
// HOW TO 5 CONTENT — ตรวจความสอดคล้องระหว่างเอกสารหลายชุด
// ════════════════════════════════════════════════════════════════════════════
const H5 = {
  num: 5, accent: P.d3, label: "HOW TO 5 · ตรวจความสอดคล้อง",
  title: "AI ตรวจความสอดคล้องระหว่าง Invoice, Packing List\nและสัญญาในออเดอร์เดียวกัน",
  objective: "ให้ AI ช่วยจับความขัดแย้งของตัวเลขระหว่างเอกสารหลายชุดในออเดอร์เดียวกัน ก่อนที่ความขัดแย้งนั้นจะกลายเป็นปัญหาที่ธนาคารหรือศุลกากร",
  scenario: "Siam Rice มีเอกสารสามชุดสำหรับออเดอร์เดียวกัน คือ Invoice, Packing List และสัญญาซื้อขาย (Sales Contract) ซึ่งร่างโดยคนละแผนกและคนละช่วงเวลา ความเสี่ยงคือตัวเลขอาจไม่ตรงกัน",
  problem: "เมื่อเอกสารถูกร่างโดยหลายแผนกแยกกัน ตัวเลขอาจคลาดเคลื่อนกันได้ง่าย เช่น จำนวนกระสอบหรือน้ำหนักที่พิมพ์ผิดไปจากเอกสารต้นทาง ซึ่งถ้าไม่ตรวจก่อนยื่นจะกลายเป็นปัญหาใหญ่ที่แก้ยากภายหลัง",
  aiTask: "ให้ AI อ่านเอกสารทั้งสามชุดพร้อมกัน แล้วเทียบตัวเลขทุกฟิลด์ระหว่างกัน ชี้จุดที่ขัดแย้งพร้อมระดับความรุนแรง อ้างอิงกฎสากลที่เกี่ยวข้อง และเสนอแผนแก้ไขเป็นขั้นตอนพร้อมกำหนดเวลา",
  outcome: "ได้รายงานความขัดแย้งที่ชี้จุดชัดเจนภายในไม่กี่สิบวินาที พร้อมแผนแก้ไขที่บอกว่าใครต้องทำอะไรภายในกี่ชั่วโมง ปกป้องมูลค่าออเดอร์ทั้งหมดไม่ให้เสียหาย",
};

const DOC5 = {
  accent: P.d3, label: "HOW TO 5 · เอกสาร/ข้อมูลที่ใช้",
  docName: "INV-2026-014 / PL-2026-014 / SC-2026-007 — เอกสารชุดเดียวกัน 3 ฉบับ",
  story: "ออเดอร์เดียวกันของ Siam Rice มีเอกสารสามชุดที่ร่างโดยสามแผนกต่างกัน ฝ่ายขายร่างสัญญาซื้อขาย ฝ่ายบัญชีออก Invoice และฝ่ายคลังสินค้าจัดทำ Packing List — ก่อนส่งเอกสารทั้งหมดให้ธนาคารและลูกค้า ต้องมั่นใจว่าตัวเลขทุกตัวตรงกัน",
  stats: [["3", "เอกสารที่ต้องเทียบ"], ["1,200 vs 1,180", "จำนวนกระสอบที่ไม่ตรงกัน"], ["FOB vs CIF", "เงื่อนไขที่ขัดแย้งกัน"], ["15 วิ", "เวลาที่ AI ใช้ตรวจทั้งหมด"]],
  useNext: "ในขั้นต่อไป เราจะให้ AI อ่านเอกสารทั้งสามชุดพร้อมกัน แล้วเทียบตัวเลขทุกฟิลด์เพื่อหาความขัดแย้งก่อนส่งเอกสารจริง",
  foot: "ไฟล์ตัวอย่างเอกสารทั้งสามชุดดาวน์โหลดได้จาก QR ในภาคผนวกท้ายเล่ม",
};

const STEP5_1_PROMPT = "อ่านเอกสารสามชุดนี้พร้อมกัน (Invoice INV-2026-014, Packing List PL-2026-014, Sales Contract SC-2026-007 ของออเดอร์เดียวกัน) แล้วเทียบตัวเลขทุกฟิลด์ระหว่างเอกสาร ทำเป็นตารางเปรียบเทียบที่ชี้จุดตรงกันและไม่ตรงกันให้ชัดเจน";
const STEP5_2_PROMPT = "จากความขัดแย้งที่พบ ช่วยอธิบายรายละเอียดแต่ละจุดว่าจะส่งผลอะไรตามมา อ้างอิงกฎ UCP 600 และ Incoterms 2020 ที่เกี่ยวข้อง พร้อมประเมินความเสียหายที่อาจเกิดขึ้นเป็นตัวเลข";
const STEP5_3_PROMPT = "ช่วยทำแผนปฏิบัติแก้ไขความขัดแย้งทั้งหมด แยกตามความเร่งด่วน ระบุว่าแผนกไหนต้องทำอะไรภายในกี่ชั่วโมง แล้วร่างประกาศแจ้งทีมภายในให้ด้วย";

const RESULT5_1 = "AI ใช้เวลาเพียง 15 วินาทีในการอ่านเอกสารทั้งสามชุดแล้วสร้างตารางเปรียบเทียบ พบว่าข้อมูลผู้ส่งสินค้า ผู้รับสินค้า และชนิดสินค้าตรงกันในทุกเอกสาร แต่พบความขัดแย้งสำคัญสี่จุด จุดแรกคือจำนวนกระสอบ ซึ่ง Invoice ระบุ 1,200 กระสอบแต่ Packing List ระบุเพียง 1,180 กระสอบ ไม่ตรงกัน จุดที่สองคือน้ำหนักสุทธิ ซึ่ง Invoice และสัญญาระบุตรงกันที่ 30,000 กิโลกรัม แต่ Packing List ระบุเพียง 29,500 กิโลกรัม ไม่ตรงกัน จุดที่สามคือเงื่อนไขการส่งมอบ ซึ่ง Invoice และ Packing List ใช้ FOB กรุงเทพฯ แต่สัญญาซื้อขายระบุเป็น CIF ฮัมบูร์ก ขัดแย้งกันโดยตรง และจุดที่สี่คือสัญญาซื้อขายไม่มีการระบุพิกัดศุลกากรและประเทศแหล่งกำเนิดสินค้าไว้เลย ในขณะที่เอกสารอีกสองชุดมีระบุครบ สรุปแล้วพบความขัดแย้งทั้งหมดห้าจุด แบ่งเป็นระดับวิกฤต 3 จุดและระดับกลาง 2 จุด ซึ่งถ้าเป็นการตรวจด้วยมือเองจะต้องใช้เวลา 30 ถึง 45 นาทีในการไล่เทียบตัวเลขทีละบรรทัด";

const RESULT5_2 = "AI อธิบายผลกระทบของความขัดแย้งแต่ละจุดอย่างละเอียด สำหรับจำนวนกระสอบและน้ำหนักที่ไม่ตรงกัน อ้างอิงกฎ UCP 600 ข้อ 18(c) ซึ่งระบุว่าหากจำนวนสินค้าในเอกสารไม่ตรงกัน ธนาคารมีสิทธิ์ปฏิเสธจ่ายเงินเต็มมูลค่า 36,000 ดอลลาร์ของออเดอร์นี้ได้ทันที สำหรับความขัดแย้งระหว่างเงื่อนไข FOB และ CIF อ้างอิงกฎ Incoterms 2020 ข้อ A3 และ B3 ซึ่งกำหนดว่าใครต้องรับผิดชอบค่าขนส่งและประกันภัย ความขัดแย้งนี้จะนำไปสู่ข้อพิพาทเรื่องต้นทุนที่ต่างกันถึง 1,800 ถึง 2,500 ดอลลาร์ต่อตู้คอนเทนเนอร์ขนาด 20 ฟุต ซึ่งทั้งสองฝ่ายต้องเจรจาตกลงกันใหม่ก่อนเรือออก และสำหรับการไม่มีพิกัดศุลกากรและแหล่งกำเนิดสินค้าในสัญญา อ้างอิงระเบียบศุลกากรสหภาพยุโรปปี 2021 ซึ่งอาจทำให้สินค้าถูกกักที่ท่าเรือฮัมบูร์กได้นานถึง 14 วันในกรณีที่เจ้าหน้าที่ต้องการเอกสารยืนยันเพิ่ม AI สรุปว่าความขัดแย้งเหล่านี้แม้จะดูเป็นรายละเอียดเล็กน้อย แต่ส่งผลกระทบโดยตรงต่อมูลค่าออเดอร์ทั้งหมด 36,000 ดอลลาร์ที่อาจไม่ได้รับการชำระตามกำหนด";

const RESULT5_3 = "AI จัดทำแผนปฏิบัติแก้ไขโดยแบ่งตามความเร่งด่วนเป็นสามระดับ ระดับวิกฤตที่ต้องทำภายใน 24 ชั่วโมงคือให้ฝ่ายคลังสินค้าและฝ่ายขนส่งแก้ไขตัวเลขใน Packing List จาก 1,180 กระสอบเป็น 1,200 กระสอบ และจาก 29,500 กิโลกรัมเป็น 30,000 กิโลกรัม ลงนามรับรองใหม่ แล้วส่งให้ธนาคารก่อนวันยื่นเอกสารจริง ระดับวิกฤตที่ต้องทำภายใน 48 ชั่วโมงคือให้ฝ่ายขาย ฝ่ายบัญชี และฝ่ายกฎหมายประชุมตกลงกันให้ชัดว่าจะใช้เงื่อนไข FOB หรือ CIF แล้วแก้ไขทั้ง Invoice และสัญญาให้ตรงกัน หากตกลงใช้ CIF ต้องจัดทำประกันภัยให้ครอบคลุมไม่น้อยกว่า 110% ของมูลค่า CIF ตามมาตรฐานสากล ส่วนระดับความเร่งด่วนปานกลางคือให้ฝ่ายกฎหมายเพิ่มข้อความในสัญญาว่า พิกัดศุลกากร 1006.30 และประเทศแหล่งกำเนิดสินค้าคือประเทศไทย ซึ่งมีสิทธิ์ใช้ RCEP พร้อมแนบ Form E แล้วให้ EuroFood ลงนามรับรองร่วมด้วย AI ยังร่างประกาศแจ้งทีมภายในให้พร้อมใช้ทันที สรุปว่าทุกแผนกต้องเร่งดำเนินการเพื่อปกป้องมูลค่าออเดอร์ 36,000 ดอลลาร์ไม่ให้เกิดความเสียหายจากความขัดแย้งของเอกสาร";

async function buildHowTo5() {
  let page = 0; const total = 11;
  howToOpenSlide(H5); page++;
  docStorySlide(DOC5); page++;
  { const d = await imgDim("B1_HardCase_Invoice_INV-2026-LC-099.png");
    filePreviewSlide({ accent: H5.accent, label: H5.label, fileName: "B1_HardCase_Invoice_INV-2026-LC-099.pdf", previewImage: d.file, _imgDim: d, rows: [
    ["จำนวน/น้ำหนัก", "ระบุ 1,200 กระสอบ น้ำหนักสุทธิ 30,000 กิโลกรัม"],
    ["เงื่อนไข", "FOB กรุงเทพฯ — ใช้ตัวเลขนี้เทียบกับอีกสองเอกสารในขั้นถัดไป"],
  ] }); } page++;
  { const qr = await qrPngUrl(rawUrl("handoff/02_documents_assets/B1_HardCase_Invoice_INV-2026-LC-099.pdf"));
    fileLinkSlide({ accent: H5.accent, label: H5.label, fileName: "B1_HardCase_Invoice_INV-2026-LC-099.pdf", qr,
      desc: "เอกสารชุดที่ 1 จาก 3 ชุดของออเดอร์เดียวกัน ใช้คู่กับ Packing List และ Sales Contract เพื่อตรวจความสอดคล้อง",
      url: rawUrl("handoff/02_documents_assets/B1_HardCase_Invoice_INV-2026-LC-099.pdf") }); } page++;
  { const d = await imgDim("B2_HardCase_PackingList_PL-2026-LC-099.png");
    filePreviewSlide({ accent: H5.accent, label: H5.label, fileName: "B2_HardCase_PackingList_PL-2026-LC-099.pdf", previewImage: d.file, _imgDim: d, rows: [
    ["จำนวน/น้ำหนัก", "ระบุเพียง 1,180 กระสอบ น้ำหนักสุทธิ 29,500 กิโลกรัม — ไม่ตรงกับ Invoice"],
    ["เงื่อนไข", "ระบุ FOB กรุงเทพฯ ตรงกับ Invoice"],
  ] }); } page++;
  { const qr = await qrPngUrl(rawUrl("handoff/02_documents_assets/B2_HardCase_PackingList_PL-2026-LC-099.pdf"));
    fileLinkSlide({ accent: H5.accent, label: H5.label, fileName: "B2_HardCase_PackingList_PL-2026-LC-099.pdf", qr,
      desc: "เอกสารชุดที่ 2 จาก 3 ชุด — สังเกตว่าจำนวนกระสอบและน้ำหนักไม่ตรงกับ Invoice ฉบับก่อนหน้า",
      url: rawUrl("handoff/02_documents_assets/B2_HardCase_PackingList_PL-2026-LC-099.pdf") }); } page++;
  { const d = await imgDim("B3_HardCase_SalesContract_SC-2026-JPN-055.png");
    filePreviewSlide({ accent: H5.accent, label: H5.label, fileName: "B3_HardCase_SalesContract_SC-2026-JPN-055.pdf", previewImage: d.file, _imgDim: d, rows: [
    ["เงื่อนไข", "ระบุเป็น CIF ฮัมบูร์ก — ขัดแย้งกับ FOB ในอีกสองเอกสาร"],
    ["ข้อมูลที่ขาด", "ไม่มีพิกัดศุลกากรและประเทศแหล่งกำเนิดสินค้าระบุไว้เลย"],
  ] }); } page++;
  { const qr = await qrPngUrl(rawUrl("handoff/02_documents_assets/B3_HardCase_SalesContract_SC-2026-JPN-055.pdf"));
    fileLinkSlide({ accent: H5.accent, label: H5.label, fileName: "B3_HardCase_SalesContract_SC-2026-JPN-055.pdf", qr,
      desc: "เอกสารชุดที่ 3 จาก 3 ชุด — เงื่อนไขการส่งมอบขัดแย้งกับอีกสองเอกสาร และขาดข้อมูลสำคัญที่ศุลกากรต้องใช้",
      url: rawUrl("handoff/02_documents_assets/B3_HardCase_SalesContract_SC-2026-JPN-055.pdf") }); } page++;
  actionStepSlide({ accent: H5.accent, label: H5.label, stepNum: 1, stepTotal: total, headline: "เปิดแชตใหม่ที่ chatgpt.com", kind: "mock", mock: "browser", detail: "กด “New chat” เพื่อเริ่มหัวข้อใหม่สำหรับงานตรวจความสอดคล้อง" });
  actionStepSlide({ accent: H5.accent, label: H5.label, stepNum: 2, stepTotal: total, headline: "กดปุ่ม “+” แล้วแนบเอกสารทั้ง 3 ชุดพร้อมกัน", kind: "mock", mock: "attach", detail: "เลือกแนบ Invoice, Packing List และ Sales Contract ทั้งสามไฟล์ในครั้งเดียว" });
  actionStepSlide({ accent: H5.accent, label: H5.label, stepNum: 3, stepTotal: total, headline: "รอจนไฟล์ทั้ง 3 ชุดอัปโหลดเสร็จ", kind: "mock", mock: "uploaded", detail: "เห็นการ์ดไฟล์ครบทั้งสามชื่อในกล่องแชตแล้ว พร้อมพิมพ์คำสั่งต่อ" });
  { const qr = await qrPng(STEP5_1_PROMPT);
    actionStepSlide({ accent: H5.accent, label: H5.label, stepNum: 4, stepTotal: total, headline: "พิมพ์คำสั่งให้เทียบตัวเลขทุกฟิลด์ระหว่างเอกสาร", kind: "qr", qr, promptText: STEP5_1_PROMPT, detail: "สแกน QR ทางขวาเพื่อเปิดแชตพร้อมข้อความนี้บนมือถือ" }); }
  resultSlide({ accent: H5.accent, label: H5.label, title: "AI ตอบ — พบความขัดแย้ง 5 จุดใน 15 วินาที", body: RESULT5_1, fontSize: 14.5 });
  { const qr = await qrPng(STEP5_2_PROMPT);
    actionStepSlide({ accent: H5.accent, label: H5.label, stepNum: 5, stepTotal: total, headline: "พิมพ์คำสั่งให้อธิบายผลกระทบของแต่ละจุด", kind: "qr", qr, promptText: STEP5_2_PROMPT, detail: "พิมพ์ต่อในแชตเดิม AI จะอ้างอิงกฎสากลที่เกี่ยวข้องให้" }); }
  resultSlide({ accent: H5.accent, label: H5.label, title: "AI ตอบ — ผลกระทบ + กฎอ้างอิง (UCP 600 / Incoterms)", body: RESULT5_2, fontSize: 14.5 });
  { const qr = await qrPng(STEP5_3_PROMPT);
    actionStepSlide({ accent: H5.accent, label: H5.label, stepNum: 6, stepTotal: total, headline: "พิมพ์คำสั่งให้ทำแผนแก้ไขพร้อมกำหนดเวลา", kind: "qr", qr, promptText: STEP5_3_PROMPT, detail: "AI จะแบ่งงานตามความเร่งด่วนและระบุว่าแผนกไหนต้องทำอะไร" }); }
  resultSlide({ accent: H5.accent, label: H5.label, title: "AI ตอบ — แผนปฏิบัติแก้ไข 3 ระดับความเร่งด่วน", body: RESULT5_3, fontSize: 14.5 });
  closingSlide({
    num: 5,
    headline: "จากเอกสาร 3 ชุดที่ขัดแย้งกัน สู่แผนแก้ไขที่ปกป้องมูลค่าออเดอร์",
    recap: [
      "เทียบตัวเลขทุกฟิลด์ระหว่างเอกสาร 3 ชุดได้ใน 15 วินาที",
      "รู้ผลกระทบของความขัดแย้งแต่ละจุด พร้อมกฎสากลอ้างอิง",
      "ได้แผนแก้ไขแบ่งตามความเร่งด่วน ระบุแผนกและกำหนดเวลาชัดเจน",
      "ปกป้องมูลค่าออเดอร์ทั้งหมดไม่ให้เสียหายจากความขัดแย้งของเอกสาร",
    ],
    next: "ขั้นต่อไป (Bonus): ให้ AI ทำงานเป็นทีมเอเจนต์ครบทุกขั้นในคำสั่งเดียว",
  });
  return page;
}

// ════════════════════════════════════════════════════════════════════════════
// BONUS 1 CONTENT — เลขา AI สั่งงานทีมเอเจนต์ 5 ตัวในคำสั่งเดียว
// ════════════════════════════════════════════════════════════════════════════
const HB1 = {
  num: "พิเศษ 1", kicker: "BONUS 1 · ทีมเอเจนต์อัตโนมัติ", accent: P.d6, label: "BONUS 1 · เลขา AI + ทีมเอเจนต์",
  title: "ให้ “เลขา AI” สั่งงานทีมเอเจนต์ 5 ตัว\nให้ทำงานทั้ง 5 HOW TO ในคำสั่งเดียว",
  objective: "ให้ AI ทำหน้าที่เป็นเลขาที่ประสานงานทีมผู้เชี่ยวชาญเฉพาะด้าน 5 คนพร้อมกัน แทนการสลับไปคุยกับ AI ทีละหัวข้อเหมือน 5 HOW TO ก่อนหน้า",
  scenario: "Siam Rice อยากได้แผนส่งออกที่ครบทั้งตลาด ภาษี เอกสาร และความสอดคล้อง แต่ไม่มีเวลานั่งพิมพ์คำสั่งทีละขั้นห้ารอบ จึงอยากให้สั่งครั้งเดียวแล้วได้ผลลัพธ์ครบ",
  problem: "การสลับงานไปมาระหว่างห้าหัวข้อด้วยตัวเองยังใช้เวลาและต้องจำลำดับขั้นตอนเอง ถ้ามีผู้ช่วยที่แบ่งงานให้ผู้เชี่ยวชาญแต่ละด้านพร้อมกันได้ จะประหยัดเวลาได้มากกว่าเดิม",
  aiTask: "ติดตั้งเครื่องมือ Claude Code และส่วนเสริม Pixel Agents ใน VS Code แล้วตั้งทีมเอเจนต์ 5 ตัว ได้แก่ Market Scout (หาตลาด+ผู้ซื้อ) Tariff Analyst (ภาษี+landed cost) Doc Drafter (ร่างเอกสาร) Doc Reader (อ่าน+สกัดข้อมูล) และ Compliance (ตรวจกฎสากล) ให้ทำงานพร้อมกันจากคำสั่งเดียว",
  outcome: "พิมพ์คำสั่งเดียว แล้วได้รับแผนปฏิบัติที่ครบทั้ง 6 ขั้น ตั้งแต่อ่านไฟล์ หาตลาด วิเคราะห์ภาษี ร่างเอกสาร ตรวจความสอดคล้อง จนถึงสรุปแผนพร้อมเอกสารแนบ — ภายในคำสั่งเดียวจริงๆ",
};

const DOCB1 = {
  accent: P.d6, label: "BONUS 1 · เครื่องมือที่ใช้",
  docName: "Claude Code + ส่วนเสริม Pixel Agents บน VS Code",
  story: "เครื่องมือหลักของ Bonus นี้ไม่ใช่เอกสาร แต่เป็นโปรแกรม Claude Code ที่ติดตั้งผ่าน VS Code แล้วใช้ฟังก์ชัน Task เพื่อแบ่งงานให้เอเจนต์ย่อยห้าตัวทำงานคนละหน้าที่พร้อมกัน เหมือนมีผู้ช่วยห้าคนทำงานให้พร้อมกันจากคำสั่งเดียว",
  stats: [["5", "เอเจนต์เฉพาะทาง"], ["1", "คำสั่งเดียวที่ต้องพิมพ์"], ["6", "ขั้นตอนที่ทำให้ครบอัตโนมัติ"], ["1", "เลขา AI ผู้ประสานงานทีม"]],
  useNext: "ในขั้นต่อไป เราจะติดตั้งเครื่องมือและพิมพ์คำสั่งมาสเตอร์เพียงคำสั่งเดียวที่สั่งให้ทีมเอเจนต์ทำงานครบทั้ง 6 ขั้นให้",
  foot: "ขั้นตอนติดตั้งนี้ทำครั้งเดียวบนเครื่อง ใช้ได้กับทุกออเดอร์ส่งออกต่อจากนี้",
};

const MASTER_PROMPT = "อัปโหลดไฟล์ข้อมูลส่งออกนี้ แล้วทำงานเป็นทีมเอเจนต์ให้ครบ 6 ขั้นในคำสั่งเดียว: (1) อ่านไฟล์ข้อมูล (2) หา Top 3 ตลาด + ผู้ซื้อ (3) วิเคราะห์ภาษีและ landed cost ของตลาดที่ดีที่สุด (4) ร่าง Commercial Invoice + Packing List (5) ตรวจความสอดคล้องและกฎปลายทาง (6) สรุปเป็นแผนปฏิบัติพร้อมเอกสารแนบ";

const RESULT_B1 = "เมื่อพิมพ์คำสั่งมาสเตอร์เพียงคำสั่งเดียว เลขา AI จะรับคำสั่งแล้วแบ่งงานออกเป็นหกขั้นให้ทีมเอเจนต์ทั้งห้าตัวทำงานเรียงต่อกันโดยไม่ต้องให้เราพิมพ์อะไรเพิ่ม ขั้นแรก Doc Reader จะอ่านไฟล์ข้อมูลส่งออกที่อัปโหลดไว้ทั้งหมดก่อน จากนั้น Market Scout จะใช้ความสามารถค้นเว็บหาตลาดและผู้ซื้อที่มีโอกาสมากที่สุดสามอันดับ ขั้นต่อมา Tariff Analyst จะคำนวณภาษีนำเข้าและ landed cost ของตลาดอันดับหนึ่งโดยอัตโนมัติ ต่อด้วย Doc Drafter ที่ร่าง Commercial Invoice และ Packing List ให้พร้อมสำหรับออเดอร์ไปยังตลาดนั้น จากนั้น Compliance จะตรวจความสอดคล้องของเอกสารทั้งหมดและตรวจกฎของประเทศปลายทางว่าต้องมีใบรับรองอะไรเพิ่ม และขั้นสุดท้ายเลขา AI จะรวบรวมผลงานจากทุกเอเจนต์มาสรุปเป็นแผนปฏิบัติฉบับเดียวพร้อมรายการเอกสารแนบที่พร้อมใช้งานจริง ทั้งหมดนี้เกิดขึ้นจากการพิมพ์คำสั่งเพียงครั้งเดียว ไม่ต้องสลับไปมาระหว่างหัวข้อต่างๆ ด้วยตัวเองเหมือนห้า HOW TO ก่อนหน้า ทำให้งานที่ปกติต้องใช้เวลาทำทีละขั้นรวมกันหลายชั่วโมง ย่อลงมาทำสำเร็จได้ในการสั่งงานครั้งเดียว";

async function buildBonus1() {
  let page = 0; const total = 6;
  howToOpenSlide(HB1); page++;
  docStorySlide(DOCB1); page++;
  { const d = await imgDim("Sample_Thai_Export_Data.png");
    filePreviewSlide({ accent: HB1.accent, label: HB1.label, fileName: "Sample_Thai_Export_Data.xlsx (ไฟล์เดียวกับ HOW TO 1)", previewImage: d.file, _imgDim: d, rows: [
    ["ขนาดไฟล์", "72 รายการส่งออก ปี 2025 ถึงต้นปี 2026 ครอบคลุมสินค้า 5 ประเภท"],
    ["ใช้ทำอะไร", "ทีมเอเจนต์ทั้ง 5 ตัวจะอ่านไฟล์นี้ไฟล์เดียวแล้วแบ่งงานกันทำครบ 6 ขั้น"],
  ] }); } page++;
  { const qr = await qrPngUrl(rawUrl("deck/Sample_Thai_Export_Data.xlsx"));
    fileLinkSlide({ accent: HB1.accent, label: HB1.label, fileName: "Sample_Thai_Export_Data.xlsx", qr,
      desc: "ไฟล์ข้อมูลส่งออกไฟล์เดียวกับที่ใช้ใน HOW TO 1 — แนบไฟล์นี้พร้อมกับคำสั่งมาสเตอร์ในขั้นถัดไปเพื่อให้ทีมเอเจนต์เริ่มทำงาน",
      url: rawUrl("deck/Sample_Thai_Export_Data.xlsx") }); } page++;
  actionStepSlide({ accent: HB1.accent, label: HB1.label, stepNum: 1, stepTotal: total, headline: "ติดตั้งโปรแกรม VS Code บนเครื่องคอมพิวเตอร์", kind: "body", bodyText: "ดาวน์โหลดและติดตั้ง Visual Studio Code จากเว็บไซต์ทางการ (code.visualstudio.com) — เป็นโปรแกรมแก้ไขโค้ดที่ใช้งานฟรี รองรับทั้ง Windows, Mac และ Linux", detail: "ถ้ามี VS Code อยู่แล้ว ข้ามขั้นนี้ไปขั้นต่อไปได้เลย" });
  actionStepSlide({ accent: HB1.accent, label: HB1.label, stepNum: 2, stepTotal: total, headline: "ติดตั้งส่วนเสริม Claude Code ผ่าน Extensions", kind: "body", bodyText: "เปิดแถบ Extensions ทางซ้ายของ VS Code (ไอคอนรูปสี่เหลี่ยมต่อกัน) พิมพ์ค้นหาคำว่า “Claude Code” แล้วกด Install", detail: "ส่วนเสริมนี้ช่วยให้สั่งงาน AI ได้โดยตรงจากภายใน VS Code" });
  actionStepSlide({ accent: HB1.accent, label: HB1.label, stepNum: 3, stepTotal: total, headline: "ติดตั้งส่วนเสริม Pixel Agents เพิ่มเติม", kind: "body", bodyText: "ค้นหาคำว่า “Pixel Agents” ในแถบ Extensions เดียวกัน แล้วกด Install — ส่วนเสริมนี้ช่วยตั้งทีมเอเจนต์ย่อยให้ทำงานคนละหน้าที่พร้อมกันได้", detail: "หลังติดตั้งเสร็จ ให้รีสตาร์ท VS Code หนึ่งครั้งเพื่อให้ส่วนเสริมทำงาน" });
  { const qr = await qrPng(MASTER_PROMPT);
    actionStepSlide({ accent: HB1.accent, label: HB1.label, stepNum: 4, stepTotal: total, headline: "พิมพ์คำสั่งมาสเตอร์นี้ในแชต Claude Code แล้วกดส่ง", kind: "qr", qr, promptText: MASTER_PROMPT, detail: "แนบไฟล์ข้อมูลส่งออกไปพร้อมกับคำสั่งนี้ในข้อความเดียวกัน" }); }
  resultSlide({ accent: HB1.accent, label: HB1.label, title: "AI ตอบ — ทีมเอเจนต์ทำงานครบ 6 ขั้นจากคำสั่งเดียว", body: RESULT_B1, fontSize: 15 });
  closingSlide({
    kicker: "BONUS 1 — สรุป", num: "พิเศษ 1",
    headline: "จากคำสั่งเดียว สู่แผนส่งออกที่ทำโดยทีมเอเจนต์ 5 ตัว",
    recap: [
      "ติดตั้ง VS Code + Claude Code + Pixel Agents ครั้งเดียว ใช้ได้ตลอด",
      "พิมพ์คำสั่งมาสเตอร์เพียงคำสั่งเดียว แทนการพิมพ์ทีละขั้น 5 รอบ",
      "ทีมเอเจนต์ 5 ตัวทำงานพร้อมกัน ครบทั้งตลาด ภาษี เอกสาร และความสอดคล้อง",
      "ได้แผนปฏิบัติพร้อมเอกสารแนบโดยไม่ต้องสลับหัวข้อด้วยตัวเอง",
    ],
    next: "ขั้นต่อไป (Bonus 2): ทำขั้นตอนเดียวกันทั้งหมดในแชตเดียว แบบไม่ต้องติดตั้งเครื่องมือเพิ่ม",
  });
  return page;
}

// ════════════════════════════════════════════════════════════════════════════
// BONUS 2 CONTENT — ทำครบ 6 ขั้นในแชตเดียว ไม่ต้องติดตั้งเครื่องมือเพิ่ม
// ════════════════════════════════════════════════════════════════════════════
const HB2 = {
  num: "พิเศษ 2", kicker: "BONUS 2 · ครบในแชตเดียว", accent: P.d7, label: "BONUS 2 · 6 ขั้นในแชตเดียว",
  title: "ทำครบทั้ง 6 ขั้นในแชตเดียวบน ChatGPT\nไม่ต้องติดตั้งเครื่องมือเพิ่มเลย",
  objective: "ให้ผู้ที่ไม่อยากติดตั้ง VS Code หรือเครื่องมือเพิ่มเติมตาม Bonus 1 ก็สามารถได้ผลลัพธ์ครบทั้ง 6 ขั้นเหมือนกัน โดยพิมพ์ทีละคำสั่งต่อเนื่องในแชตเดียวบน ChatGPT ธรรมดา",
  scenario: "เจ้าของกิจการบางคนอยากลองทำเองแบบง่ายที่สุดก่อน โดยใช้แค่เว็บเบราว์เซอร์และบัญชี ChatGPT ที่มีอยู่แล้ว ไม่ต้องติดตั้งโปรแกรมอะไรเพิ่มในเครื่อง",
  problem: "การเปิดแชตใหม่หรือใช้เครื่องมือหลายตัวอาจดูยุ่งยากสำหรับคนที่เพิ่งเริ่มใช้ AI ทำงาน จึงควรมีวิธีที่ง่ายที่สุดเป็นจุดเริ่มต้นก่อน แล้วค่อยขยับไปใช้ทีมเอเจนต์ตาม Bonus 1 เมื่อคุ้นมือแล้ว",
  aiTask: "เปิดแชตเดียวบน ChatGPT แล้วพิมพ์คำสั่งทีละขั้นต่อเนื่องกันทั้ง 6 ขั้น ตั้งแต่อัปโหลดไฟล์ หาตลาด วิเคราะห์ภาษี ร่างเอกสาร ตรวจความสอดคล้อง จนถึงสรุปแผนปฏิบัติ — โดยไม่ต้องออกจากแชตเดิมเลย",
  outcome: "ได้ผลลัพธ์ครบทั้ง 6 ขั้นเหมือน Bonus 1 ทุกประการ เพียงแต่ใช้เวลาพิมพ์คำสั่งทีละขั้นมากกว่าเล็กน้อย และไม่ต้องติดตั้งเครื่องมือใดๆ เพิ่มจากที่มีอยู่แล้ว",
};

const DOCB2 = {
  accent: P.d7, label: "BONUS 2 · เอกสาร/ข้อมูลที่ใช้",
  docName: "Sample_Thai_Export_Data.xlsx — ไฟล์เดียว ใช้ได้ตลอดทั้ง 6 ขั้น",
  story: "ไฟล์ข้อมูลส่งออกไฟล์เดียวที่ใช้ใน HOW TO 1 สามารถใช้ซ้ำได้ตลอดทั้ง 6 ขั้นของ Bonus นี้ เพราะอัปโหลดเข้าแชตครั้งเดียวแล้ว AI จะจดจำไว้ใช้ต่อในทุกคำสั่งถัดไปโดยไม่ต้องอัปโหลดซ้ำ",
  stats: [["1", "ไฟล์ที่อัปโหลดครั้งเดียว"], ["1", "แชตเดียวตลอดทั้งงาน"], ["6", "คำสั่งที่พิมพ์ต่อเนื่องกัน"], ["0", "เครื่องมือเพิ่มเติมที่ต้องติดตั้ง"]],
  useNext: "ในขั้นต่อไป เราจะอัปโหลดไฟล์นี้แล้วพิมพ์คำสั่งทีละขั้นต่อเนื่องกันทั้ง 6 ขั้นในแชตเดียว",
  foot: "ไฟล์ตัวอย่างนี้ดาวน์โหลดได้จาก QR ในภาคผนวกท้ายเล่ม เช่นเดียวกับ HOW TO 1",
};

const STEPB2_1 = "นี่คือข้อมูลส่งออกของฉัน ช่วยดูให้หน่อยว่ามีอะไรอยู่ในไฟล์นี้บ้าง";
const STEPB2_2 = "วิเคราะห์ Top 5 ตลาดส่งออกของฉันปี 2026 เรียงตามโอกาส พร้อมเหตุผล";
const STEPB2_3 = "ตลาดอันดับ 1 เจอภาษีนำเข้าเท่าไหร่ และ landed cost ต่อตันเท่าไหร่";
const STEPB2_4 = "ร่าง Commercial Invoice + Packing List สำหรับออเดอร์ไปตลาดนั้น";
const STEPB2_5 = "ตรวจว่าเอกสารสอดคล้องกันไหม และต้องมีใบรับรองอะไรตามกฎปลายทาง";
const STEPB2_6 = "สรุปทั้งหมดเป็นแผนปฏิบัติ + checklist เอกสารที่ต้องเตรียม";

const RESULTB2_1 = "AI เปิดไฟล์และสรุปภาพรวมให้ทันทีว่าไฟล์นี้มีบันทึกการส่งออก 72 รายการในช่วงปี 2025 ถึงต้นปี 2026 ครอบคลุมสินค้าหลัก 5 ประเภทและประเทศปลายทาง 10 ประเทศ พร้อมตั้งข้อสังเกตเบื้องต้นว่าเห็นแนวโน้มการส่งออกไปเอเชียใต้เพิ่มขึ้นในช่วงหลัง ทำให้พร้อมต่อยอดไปคำสั่งถัดไปได้ทันที โดยไม่ต้องอัปโหลดไฟล์ซ้ำอีก";

const RESULTB2_2 = "AI จัดลำดับ Top 5 ตลาดให้ทันที โดยอินเดียมาเป็นอันดับหนึ่งเพราะตลาดข้าวพรีเมียมเติบโต 28% และได้สิทธิภาษี 0% ผ่าน RCEP ตามมาด้วยจีนที่ราคาขายสูงและส่งถึงเร็ว เวียดนามที่เป็นจุดกระจายสินค้าในภูมิภาค เยอรมนีที่ให้มูลค่าสูงสุดถ้ามีใบรับรองออร์แกนิก และสหรัฐอาหรับเอมิเรตส์ที่เป็นศูนย์กลางกระจายต่อตะวันออกกลาง พร้อมเตือนว่าตลาดสหรัฐฯ มีความเสี่ยงสูงจากภาษีตอบโต้ที่เพิ่มขึ้น";

const RESULTB2_3 = "AI ตอบทันทีว่าตลาดอินเดียซึ่งเป็นอันดับหนึ่งได้ภาษีนำเข้า 0% เมื่อใช้สิทธิ์ RCEP ผ่าน Form D ทำให้ landed cost ใกล้เคียงกับราคา FOB ตั้งต้นมากคืออยู่ที่ประมาณ 1.49 ดอลลาร์ต่อกิโลกรัม ต่างจากตลาดสหรัฐฯ ที่ต้องบวกภาษีรวมเกือบ 19% ทำให้ landed cost พุ่งขึ้นไปถึง 1.82 ดอลลาร์ต่อกิโลกรัม";

const RESULTB2_4 = "AI ร่าง Commercial Invoice และ Packing List ให้ทันที โดยใช้ข้อมูลผู้ซื้อจากตลาดอินเดียที่เลือกไว้ ระบุจำนวน น้ำหนัก และราคาให้ตรงกันทั้งสองเอกสารโดยอัตโนมัติ พร้อมเลขที่เอกสารและเครื่องหมายหน้าหีบที่จัดให้ครบ ใช้เวลาไม่ถึงหนึ่งนาทีในการร่างเอกสารทั้งสองชุด";

const RESULTB2_5 = "AI ตรวจสอบเอกสารทั้งสองชุดและยืนยันว่าตัวเลขตรงกันทั้งหมด ไม่มีความขัดแย้ง พร้อมแจ้งว่าสำหรับตลาดอินเดียต้องเตรียมใบรับรองแหล่งกำเนิดสินค้า Form D ภายใต้ RCEP เพื่อขอใช้สิทธิ์ภาษี 0% และใบรับรองสุขอนามัยพืชจากกรมวิชาการเกษตรเพิ่มเติมก่อนส่งออกจริง";

const RESULTB2_6 = "AI สรุปทุกอย่างเป็นแผนปฏิบัติฉบับเดียว ระบุว่าควรเริ่มจากการขอใบรับรอง Form D และใบรับรองสุขอนามัยพืชก่อน จากนั้นยืนยันออเดอร์กับผู้ซื้อในอินเดีย แล้วส่งเอกสารที่ร่างไว้ให้ธนาคารและสายการเดินเรือ พร้อมแนบ checklist เอกสารที่ต้องเตรียมทั้งหมดให้ติ๊กถูกทีละรายการ — ครบทั้ง 6 ขั้นจากการสั่งงานต่อเนื่องในแชตเดียว ไม่ต้องสลับหน้าหรือเปิดแชตใหม่เลยตลอดทั้งกระบวนการ";

async function buildBonus2() {
  let page = 0; const total = 10;
  howToOpenSlide(HB2); page++;
  docStorySlide(DOCB2); page++;
  { const d = await imgDim("Sample_Thai_Export_Data.png");
    filePreviewSlide({ accent: HB2.accent, label: HB2.label, fileName: "Sample_Thai_Export_Data.xlsx (ไฟล์เดียวกับ HOW TO 1)", previewImage: d.file, _imgDim: d, rows: [
    ["ขนาดไฟล์", "72 รายการส่งออก ปี 2025 ถึงต้นปี 2026 ครอบคลุมสินค้า 5 ประเภท และ 10 ประเทศปลายทาง"],
    ["ใช้ทำอะไร", "อัปโหลดครั้งเดียวในแชตเดียว แล้วใช้ซ้ำได้ตลอดทั้ง 6 คำสั่งถัดไป"],
  ] }); } page++;
  { const qr = await qrPngUrl(rawUrl("deck/Sample_Thai_Export_Data.xlsx"));
    fileLinkSlide({ accent: HB2.accent, label: HB2.label, fileName: "Sample_Thai_Export_Data.xlsx", qr,
      desc: "ไฟล์ข้อมูลส่งออกไฟล์เดียวกับที่ใช้ใน HOW TO 1 — แนบไฟล์นี้ในขั้นแรกของแชตเดียว แล้วใช้ต่อได้ตลอดทั้ง 6 ขั้น",
      url: rawUrl("deck/Sample_Thai_Export_Data.xlsx") }); } page++;
  actionStepSlide({ accent: HB2.accent, label: HB2.label, stepNum: 1, stepTotal: total, headline: "เปิดแชตใหม่ที่ chatgpt.com แล้วแนบไฟล์ข้อมูลส่งออก", kind: "mock", mock: "attach", detail: "แนบไฟล์ Sample_Thai_Export_Data.xlsx ครั้งเดียว ใช้ได้ตลอดทั้ง 6 ขั้น" });
  actionStepSlide({ accent: HB2.accent, label: HB2.label, stepNum: 2, stepTotal: total, headline: "รอจนไฟล์อัปโหลดเสร็จ", kind: "mock", mock: "uploaded", detail: "เห็นชื่อไฟล์เป็นการ์ดในกล่องแชตแล้ว พร้อมพิมพ์คำสั่งขั้นที่ 1" });
  { const qr = await qrPng(STEPB2_1);
    actionStepSlide({ accent: HB2.accent, label: HB2.label, stepNum: 3, stepTotal: total, headline: "ขั้นที่ 1 — พิมพ์คำสั่งให้ AI ดูข้อมูลในไฟล์", kind: "qr", qr, promptText: STEPB2_1, detail: "สแกน QR ทางขวาเพื่อเปิดแชตพร้อมข้อความนี้บนมือถือ" }); }
  { const qr = await qrPng(STEPB2_2);
    actionStepSlide({ accent: HB2.accent, label: HB2.label, stepNum: 4, stepTotal: total, headline: "ขั้นที่ 2 — พิมพ์คำสั่งหาตลาดที่มีโอกาส", kind: "qr", qr, promptText: STEPB2_2, detail: "พิมพ์ต่อในแชตเดิม ไม่ต้องเปิดแชตใหม่" }); }
  { const qr = await qrPng(STEPB2_3);
    actionStepSlide({ accent: HB2.accent, label: HB2.label, stepNum: 5, stepTotal: total, headline: "ขั้นที่ 3 — พิมพ์คำสั่งถามภาษีและต้นทุน", kind: "qr", qr, promptText: STEPB2_3, detail: "AI จะใช้ตลาดอันดับ 1 จากคำตอบขั้นที่ 2 มาคำนวณต่อ" }); }
  { const qr = await qrPng(STEPB2_4);
    actionStepSlide({ accent: HB2.accent, label: HB2.label, stepNum: 6, stepTotal: total, headline: "ขั้นที่ 4 — พิมพ์คำสั่งให้สร้างเอกสารส่งออก", kind: "qr", qr, promptText: STEPB2_4, detail: "AI จะร่าง Invoice และ Packing List จากตลาดที่เลือกไว้" }); }
  { const qr = await qrPng(STEPB2_5);
    actionStepSlide({ accent: HB2.accent, label: HB2.label, stepNum: 7, stepTotal: total, headline: "ขั้นที่ 5 — พิมพ์คำสั่งให้ตรวจเอกสาร + กฎปลายทาง", kind: "qr", qr, promptText: STEPB2_5, detail: "AI จะตรวจความสอดคล้องและบอกใบรับรองที่ต้องเตรียมเพิ่ม" }); }
  { const qr = await qrPng(STEPB2_6);
    actionStepSlide({ accent: HB2.accent, label: HB2.label, stepNum: 8, stepTotal: total, headline: "ขั้นที่ 6 — พิมพ์คำสั่งให้สรุปเป็นแผนปฏิบัติ", kind: "qr", qr, promptText: STEPB2_6, detail: "ขั้นสุดท้าย AI จะรวบรวมทุกคำตอบก่อนหน้าเป็นแผนเดียว" }); }
  resultSlide({ accent: HB2.accent, label: HB2.label, title: "AI ตอบ — สรุปผลลัพธ์ทั้ง 6 ขั้นจากแชตเดียว", body: RESULTB2_1 + "\n\n" + RESULTB2_2 + "\n\n" + RESULTB2_3 + "\n\n" + RESULTB2_4 + "\n\n" + RESULTB2_5 + "\n\n" + RESULTB2_6, fontSize: 11.5 });
  closingSlide({
    kicker: "BONUS 2 — สรุป", num: "พิเศษ 2",
    headline: "จากไฟล์เดียว ในแชตเดียว สู่แผนส่งออกที่ครบทั้ง 6 ขั้น",
    recap: [
      "ใช้แค่เว็บเบราว์เซอร์และบัญชี ChatGPT ที่มีอยู่แล้ว ไม่ต้องติดตั้งอะไรเพิ่ม",
      "อัปโหลดไฟล์ครั้งเดียว ใช้ซ้ำได้ตลอดทั้ง 6 คำสั่งในแชตเดียว",
      "ได้ผลลัพธ์ครบเหมือน Bonus 1 ทุกประการ เพียงพิมพ์เองทีละขั้น",
      "เหมาะเป็นจุดเริ่มต้นก่อนขยับไปใช้ทีมเอเจนต์อัตโนมัติใน Bonus 1",
    ],
    next: "จบคู่มือ — กลับไปเริ่มที่ HOW TO 1 ได้ทุกเมื่อด้วยไฟล์ข้อมูลส่งออกของกิจการคุณเอง",
  });
  return page;
}

// ════════════════════════════════════════════════════════════════════════════
// BONUS 3 — เอาคำตอบ AI ไปกรอกฟอร์มจริงบนเว็บผู้รับขนส่ง (สาธิตสด)
// ════════════════════════════════════════════════════════════════════════════
const HB3 = {
  num: "พิเศษ 3", kicker: "BONUS 3 · ใช้คำตอบ AI กรอกฟอร์มจริง", accent: P.d2, label: "BONUS 3 · กรอกฟอร์มขอใบเสนอราคาขนส่ง",
  title: "เอาคำตอบจาก AI ไปกรอกฟอร์มขอใบเสนอราคา\nขนส่งสินค้าบนเว็บผู้รับขนส่งจริง",
  objective: "แสดงให้เห็นว่าคำตอบจาก AI (ตลาด เส้นทาง น้ำหนัก ประเภทตู้คอนเทนเนอร์) เอาไปกรอกลงฟอร์มขอใบเสนอราคาขนส่งจริงบนเว็บไซต์ผู้รับขนส่งได้ทันที ไม่ต้องแปลงข้อมูลเอง",
  scenario: "ใช้ไฟล์ข้อมูลส่งออกเดียวกับ HOW TO 1 ถาม AI ให้สรุปฟิลด์ที่ต้องใช้ขอใบเสนอราคาขนส่ง แล้วเอาคำตอบนั้นไปกรอกฟอร์ม “Request a quote” ของผู้รับขนส่งจริง (SeaRates)",
  problem: "ฟอร์มขอใบเสนอราคาขนส่งมีฟิลด์เฉพาะทาง (ประเภทตู้ Incoterm ท่าเรือต้นทาง/ปลายทาง) ที่ผู้ใช้ทั่วไปไม่คุ้นเคย ต้องแปลงจากข้อมูลส่งออกดิบเอง",
  aiTask: "ถาม AI ว่า “จากไฟล์นี้ ฟิลด์ใบเสนอราคาขนส่งควรกรอกอะไรบ้าง” แล้วเอาคำตอบไปกรอกในฟอร์มจริงทีละฟิลด์",
  outcome: "ฟิลด์มาตรฐานของฟอร์มขอใบเสนอราคาขนส่งเกือบทุกฟิลด์กรอกได้ตรงจากคำตอบของ AI ทันที — ส่วนที่ไม่มีฟิลด์ตรงตัว (เช่น Incoterm บางแบบ) ใส่ไว้ในช่อง “Additional Information” แทน",
};

async function buildBonus3() {
  let page = 0;
  howToOpenSlide(HB3); page++;
  { const d = await liveProofDim("bonus3_form_cargo.png");
    liveProofSlide({ accent: HB3.accent, label: HB3.label, image: d.file, _imgDim: d,
      title: "ภาพหน้าจอจริง — กรอกฟอร์ม SeaRates ด้วยค่าที่ AI แนะนำ (สินค้า/เส้นทาง/น้ำหนัก/ตู้คอนเทนเนอร์)",
      foot: "ตัวอย่างใช้ข้อมูลติดต่อสมมติ ไม่กดส่งฟอร์มจริง — ใช้เพื่อสาธิตว่าคำตอบ AI กรอกลงฟอร์มจริงได้ตรง" }); } page++;
  { const d = await liveProofDim("bonus3_form_contact.png");
    liveProofSlide({ accent: HB3.accent, label: HB3.label, image: d.file, _imgDim: d,
      title: "ภาพหน้าจอจริง — ส่วนข้อมูลติดต่อ + ช่อง Additional Information",
      foot: "Incoterm และตู้คอนเทนเนอร์ลำที่สองไม่มีฟิลด์ตรงตัวในฟอร์มนี้ — ใส่ไว้ในช่อง Additional Information แทน" }); } page++;
  closingSlide({
    kicker: "BONUS 3 — สรุป", num: "พิเศษ 3",
    headline: "จากคำตอบ AI สู่ฟอร์มขอใบเสนอราคาขนส่งจริง",
    recap: [
      "คำตอบจาก AI (ตลาด/เส้นทาง/น้ำหนัก/ตู้คอนเทนเนอร์) กรอกลงฟอร์มจริงได้ตรงเกือบทุกฟิลด์",
      "ฟิลด์ที่ฟอร์มไม่มีตรงตัว (เช่น Incoterm) ใส่ในช่อง Additional Information แทนได้",
      "ใช้ได้กับฟอร์มขอใบเสนอราคาของผู้รับขนส่งรายอื่นในลักษณะเดียวกัน",
      "ทดสอบกรอกจริงแล้ว แต่ไม่กดส่งฟอร์มจริงเพื่อความปลอดภัยของข้อมูล",
    ],
    next: "จบคู่มือ — กลับไปเริ่มที่ HOW TO 1 ได้ทุกเมื่อด้วยไฟล์ข้อมูลส่งออกของกิจการคุณเอง",
  });
  return page;
}

(async () => {
  const ICraw = await buildIcons(P);
  IC = { ...ICraw };
  IC.file = await ICraw.file(P.d5);
  IC.rocket = await ICraw.rocket(P.green);

  guideIntroSlide();
  await buildHowTo1();
  await buildHowTo2();
  await buildHowTo3();
  await buildHowTo4();
  await buildHowTo5();
  await buildBonus1();
  await buildBonus2();
  await buildBonus3();

  await pres.writeFile({ fileName: "/home/user/krungsri/deck/out3.pptx" });
  console.log("WROTE out3.pptx — total slides:", pres.slides.length);
})();
