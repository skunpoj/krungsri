// build3.js — v22 "Follow-Along Manual" deck builder
// Prototype: HOW TO 1 only, per REDESIGN_SPEC.md
// One step per page, biggest possible type, full button-by-button walkthrough,
// AI answers written as flowing essay paragraphs (not bullets).
const pptxgen = require("pptxgenjs");
const QRCode = require("qrcode");
const { buildIcons } = require("./icons.js");

const P = {
  bg: "F4ECDA", panel: "EFE4CD", card: "FFFFFF", cardAlt: "FBF6EC", border: "E0D3B8",
  ink: "2B2A26", ink2: "514C42", muted: "8A8170",
  d5: "0E7490", d5t: "E1EEF1",
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

async function qrPng(text) {
  const url = "https://chatgpt.com/?q=" + encodeURIComponent(text);
  const d = await QRCode.toDataURL(url, { errorCorrectionLevel: "L", margin: 1, width: 760, color: { dark: "#2B2A26", light: "#FFFFFF" } });
  return d.replace(/^data:/, "");
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
  s.addText(`HOW TO ${o.num}`, { x: 0.55, y: 0.18, w: 6, h: 0.5, fontFace: F, fontSize: 17, bold: true, color: "FFFFFF", charSpacing: 3, align: "left", valign: "middle", margin: 0 });
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
    s.addText("เลือก “เพิ่มรูปและไฟล์” แล้วเลือกไฟล์ Sample_Thai_Export_Data.xlsx จากเครื่องของคุณ", { x: x + 1.55, y: y, w: w - 2.0, h, fontFace: F, fontSize: 16, bold: true, color: P.ink, align: "left", valign: "middle", lineSpacingMultiple: 1.1, margin: 0 });
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

function closingSlide(o) {
  const s = pres.addSlide(); bg(s, P.cap); const A = P.gold;
  s.addText(`HOW TO ${o.num} — สรุป`, { x: 0.6, y: 0.9, w: 12.13, h: 0.5, fontFace: F, fontSize: 17, bold: true, color: A, charSpacing: 3, align: "center", margin: 0 });
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
const STEP2_PROMPT = "ในตลาดอินเดีย ใครคือผู้นำเข้า/ผู้จัดจำหน่ายข้าวหอมมะลิรายใหญ่? ช่วยหารายชื่อบริษัท ประเภทธุรกิจ และช่องทางติดต่อที่หาได้ พร้อมแนะนำว่าควรเข้าหาอย่างไร";
const STEP3_PROMPT = "ร่างอีเมลแนะนำสินค้าและบริษัทเราถึง ITC Limited เป็นภาษาอังกฤษ โทนมืออาชีพ กระชับ เน้นคุณภาพ ราคา และใบรับรอง แล้วเตรียมคำตอบสำหรับคำถามที่เขาน่าจะถาม";

const RESULT1 = "AI อ่านไฟล์บันทึกการส่งออกทั้ง 72 รายการแล้วสรุปว่า อินเดียคือโอกาสที่สูงที่สุดของปีนี้ เพราะตลาดข้าวพรีเมียมที่นั่นมีขนาดถึง 22 ล้านตันต่อปีและเติบโตถึง 28% ในช่วง 3 ปีที่ผ่านมา ชนชั้นกลางใหม่กว่า 300 ล้านคนยินดีจ่ายราคาสูงกว่าสำหรับสินค้าที่มีตรารับรองสิ่งบ่งชี้ทางภูมิศาสตร์ (GI) และที่สำคัญคือเมื่อใช้สิทธิ์ภายใต้ความตกลง RCEP ผ่าน Form D ภาษีนำเข้าจะลดจาก 70% เหลือ 0% ทันที ทำให้ข้าวหอมมะลิไทยได้เปรียบคู่แข่งจากปากีสถานและอินโดนีเซียอย่างชัดเจน ส่วนจีนตามมาเป็นอันดับสองด้วยมูลค่าสูงและส่งถึงเร็ว เพราะผู้บริโภคในเซี่ยงไฮ้และปักกิ่งยอมจ่ายแพงกว่าข้าวทั่วไปถึง 5-8 เท่า บวกกับ RCEP Form E ที่ให้ภาษี 0% เช่นกัน และเวลาขนส่งจากแหลมฉบังไปเซี่ยงไฮ้เพียง 7 วัน อันดับสามคือเวียดนามซึ่งเป็นจุดกระจายสินค้าของอาเซียนที่ค่าขนส่งถูกและส่งต่อไปยุโรปหรือสหรัฐฯ ได้สะดวก ตามมาด้วยเยอรมนีที่ให้มูลค่าต่อหน่วยสูงสุดหากมีใบรับรองออร์แกนิก เพราะตลาดออร์แกนิกในสหภาพยุโรปเติบโต 12% ต่อปี และสุดท้ายคือสหรัฐอาหรับเอมิเรตส์ที่เป็นศูนย์กลางกระจายสินค้าไปทั่วตะวันออกกลาง 22 ประเทศด้วยภาษีเพียง 5% และไม่มีโควต้า อย่างไรก็ตาม AI เตือนว่าตลาดสหรัฐอเมริกาตอนนี้มีความเสี่ยงสูงเพราะภาษีตอบโต้ (reciprocal tariff) อยู่ที่ประมาณ 19% จึงแนะนำให้กระจายไปสามตลาดหลักเพื่อลดความเสี่ยงจากการพึ่งพานโยบายของประเทศเดียว";

const RESULT2 = "เมื่อให้ AI เจาะลึกเฉพาะตลาดอินเดีย AI ได้รวบรวมรายชื่อผู้นำเข้าข้าวรายใหญ่สามแห่งที่น่าติดต่อที่สุด อันดับแรกคือ ITC Limited จากเมืองมุมไบ ซึ่งมีแผนกอาหารที่ทำรายได้ถึง 2,100 ล้านดอลลาร์ในปี 2025 และนำเข้าข้าวพรีเมียมปีละ 5,000 ถึง 8,000 ตัน ขายผ่านแบรนด์ Aashirvaad ที่มีวางขายในซูเปอร์มาร์เก็ตทั่วประเทศ โดยบริษัทนี้ต้องการใบรับรอง SGS ใบรับรองสุขอนามัยพืช และใบรับรอง GI ก่อนพิจารณาสั่งซื้อ อันดับสองคือ Amira Nature Foods จากเดลี ซึ่งเชี่ยวชาญด้านข้าวพิเศษ ข้าว GI และข้าวออร์แกนิก มีลูกค้าเป็นห้างค้าปลีกรายใหญ่อย่าง Big Bazaar, Reliance Fresh และ D-Mart และส่งออกต่อไปกว่า 60 ประเทศทั่วโลก ส่วนอันดับสามคือ KRBL Limited จากเมือง Noida ผู้ส่งออกข้าวอันดับหนึ่งของอินเดียภายใต้แบรนด์ India Gate ซึ่งมักซื้อในปริมาณมากเพื่อนำไปผสมและบรรจุใหม่ก่อนส่งออกต่อไปยังตะวันออกกลาง ทำให้ออเดอร์มีขนาดใหญ่แต่กำไรต่อหน่วยจะต่ำกว่า AI แนะนำว่าวิธีเข้าหาที่ได้ผลดีที่สุดคือการส่งอีเมลภาษาอังกฤษพร้อมแนบสเปกสินค้า ใบรับรองสุขอนามัยพืช ใบรับรองออร์แกนิก และใบรับรอง GI ไปพร้อมกัน เสนอตัวอย่างสินค้าฟรี 5 กิโลกรัมก่อนให้สั่งซื้อทดลองจริงที่ 20 ถึง 50 ตัน และควรลงทะเบียนในระบบ APEDA ของอินเดียเพื่อให้ผู้ซื้อค้นหาเราเจอได้เอง รวมถึงขอคำแนะนำเพิ่มเติมผ่านสำนักงาน DITP ประจำมุมไบ";

const RESULT3 = "ขั้นสุดท้าย AI ร่างอีเมลภาษาอังกฤษให้ทันที โดยตั้งหัวเรื่องว่า Premium Thai Hom Mali Rice — Grade A Organic, GI Certified | New Supplier Inquiry และเปิดอีเมลด้วยการแนะนำตัวว่า Siam Rice Co., Ltd. เป็นผู้ส่งออกข้าวออร์แกนิกที่มีใบรับรองมาตรฐานจากประเทศไทย ต้องการสร้างความร่วมมือระยะยาวกับแผนกอาหารของ ITC ตัวอีเมลระบุรายละเอียดสินค้าอย่างครบถ้วน ทั้งเลขทะเบียน GI ความชื้นไม่เกิน 14.5% เมล็ดหักไม่เกิน 5% ความบริสุทธิ์ 99.7% กำลังผลิต 200 ตันต่อเดือน ราคาส่งมอบที่ท่าเรือกรุงเทพ 1.45 ดอลลาร์ต่อกิโลกรัมซึ่งได้สิทธิ์ภาษี 0% ภายใต้ RCEP และเสนอตัวอย่างสินค้าทดลอง 5 กิโลกรัมโดยไม่มีข้อผูกมัด ปิดท้ายด้วยการขอนัดคุยทางโทรศัพท์ 20 นาทีในสัปดาห์นั้น นอกจากตัวอีเมลแล้ว AI ยังเตรียมคำถามที่ผู้ซื้อมักถามไว้ให้ล่วงหน้าพร้อมคำตอบ เช่น ทำไมต้องเลือกข้าวไทยแทนเวียดนาม คำตอบคือมีใบรับรอง GI และออร์แกนิกพร้อมกลิ่นหอมที่ได้รับการยืนยันมาตรฐาน ISO ปริมาณขั้นต่ำในการสั่งซื้อคือ 20 ตันสำหรับรอบทดลองและ 50 ตันสำหรับรอบปกติ การชำระเงินรับได้ทั้งแบบ L/C at sight หรือโอนล่วงหน้า 30% และเอกสารที่พร้อมแนบมีทั้งใบรับรองสุขอนามัยพืช ใบรับรองออร์แกนิก ใบรับรอง GI และใบตรวจสอบจาก SGS — ทำให้ทีมขายพร้อมส่งอีเมลได้ทันทีโดยไม่ต้องเขียนเองตั้งแต่ต้น";

async function buildHowTo1() {
  let page = 0;
  const total = 13;

  howToOpenSlide(H1); page++;
  docStorySlide(DOC1); page++;

  // Step block 1 — find markets
  actionStepSlide({ accent: H1.accent, label: H1.label, stepNum: 1, stepTotal: total, headline: "เปิดเว็บเบราว์เซอร์ แล้วไปที่ chatgpt.com", kind: "mock", mock: "browser", detail: "ล็อกอินด้วยบัญชีของคุณ แล้วเริ่มแชตใหม่ (กดปุ่ม “New chat” มุมซ้ายบน ถ้ามีแชตเก่าเปิดอยู่)" });
  actionStepSlide({ accent: H1.accent, label: H1.label, stepNum: 2, stepTotal: total, headline: "กดปุ่ม “+” ข้างกล่องพิมพ์ข้อความ", kind: "mock", mock: "plusButton", detail: "ปุ่มนี้อยู่ทางซ้ายของกล่องพิมพ์ข้อความ ด้านล่างของหน้าจอ" });
  actionStepSlide({ accent: H1.accent, label: H1.label, stepNum: 3, stepTotal: total, headline: "เลือก “เพิ่มรูปและไฟล์” แล้วแนบไฟล์ Excel", kind: "mock", mock: "attach", detail: "เลือกไฟล์ Sample_Thai_Export_Data.xlsx (หรือไฟล์ข้อมูลส่งออกจริงของคุณ) จากเครื่อง" });
  actionStepSlide({ accent: H1.accent, label: H1.label, stepNum: 4, stepTotal: total, headline: "รอจนไฟล์อัปโหลดเสร็จ เห็นการ์ดไฟล์ในกล่องแชต", kind: "mock", mock: "uploaded", detail: "เมื่อเห็นชื่อไฟล์ขึ้นเป็นการ์ดแล้ว แสดงว่าพร้อมให้พิมพ์คำสั่งต่อได้" });
  { const qr = await qrPng(STEP1_PROMPT);
    actionStepSlide({ accent: H1.accent, label: H1.label, stepNum: 5, stepTotal: total, headline: "พิมพ์คำสั่งนี้ แล้วกดส่ง", kind: "qr", qr, promptText: STEP1_PROMPT, detail: "หรือสแกน QR ทางขวาเพื่อเปิดแชตพร้อมข้อความนี้ทันทีบนมือถือ" }); }
  resultSlide({ accent: H1.accent, label: H1.label, title: "AI ตอบ — Top 5 ตลาดส่งออกปี 2026", body: RESULT1, fontSize: 15.5 });

  // Step block 2 — find buyers (continue same chat)
  { const qr = await qrPng(STEP2_PROMPT);
    actionStepSlide({ accent: H1.accent, label: H1.label, stepNum: 6, stepTotal: total, headline: "พิมพ์ต่อในแชตเดิม ไม่ต้องเริ่มใหม่", kind: "qr", qr, promptText: STEP2_PROMPT, detail: "AI จำไฟล์และบทสนทนาก่อนหน้าได้ จึงตอบต่อเนื่องโดยไม่ต้องอัปโหลดไฟล์ซ้ำ" }); }
  resultSlide({ accent: H1.accent, label: H1.label, title: "AI ตอบ — ผู้นำเข้า/ผู้ซื้อตัวจริงในอินเดีย", body: RESULT2, fontSize: 15.5 });

  // Step block 3 — draft email
  { const qr = await qrPng(STEP3_PROMPT);
    actionStepSlide({ accent: H1.accent, label: H1.label, stepNum: 7, stepTotal: total, headline: "พิมพ์คำสั่งให้ร่างอีเมลถึงผู้ซื้อที่เลือก", kind: "qr", qr, promptText: STEP3_PROMPT, detail: "เปลี่ยนชื่อบริษัท/ผู้ซื้อในข้อความให้ตรงกับที่คุณเลือกจากขั้นที่แล้ว" }); }
  resultSlide({ accent: H1.accent, label: H1.label, title: "AI ตอบ — อีเมลพร้อมส่ง + คำตอบเตรียมไว้ล่วงหน้า", body: RESULT3, fontSize: 15 });

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

(async () => {
  const ICraw = await buildIcons(P);
  IC = { ...ICraw };
  IC.file = await ICraw.file(P.d5);
  IC.rocket = await ICraw.rocket(P.green);

  await buildHowTo1();

  await pres.writeFile({ fileName: "/home/user/krungsri/deck/out3.pptx" });
  console.log("WROTE out3.pptx");
})();
