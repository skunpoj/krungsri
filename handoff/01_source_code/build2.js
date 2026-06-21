const pptxgen = require("pptxgenjs");
const QRCode = require("qrcode");
const { buildIcons } = require("./icons.js");

const P = {
  bg:"F4ECDA", panel:"EFE4CD", card:"FFFFFF", cardAlt:"FBF6EC", border:"E0D3B8",
  ink:"2B2A26", ink2:"514C42", muted:"8A8170",
  d1:"C2185B", d1t:"FBE6EE", d2:"7C3AED", d2t:"F0E9FB", d3:"3949AB", d3t:"E8EAF6",
  d4:"C2410C", d4t:"FAE7DB", d5:"0E7490", d5t:"E1EEF1", cap:"38332B", capt:"ECE6D8", gold:"D9A441", cap2:"C0392B", cap2t:"F8E5E1",
  green:"0E7A55", greenT:"E6F3EC", greenBd:"BCDFC9", amber:"B45309", amberT:"FAF0DA", amberBd:"EAD6A2", red:"B91C1C",
};
const F = "Arial", W = 13.333, H = 7.5;
const QR_LABEL = "สแกน → เปิดใน ChatGPT";

let pres = new pptxgen();
pres.defineLayout({ name: "W", width: W, height: H });
pres.layout = "W"; pres.author = "AI for SME"; pres.title = "AI สำหรับธุรกิจ SME — Prompt ตัวอย่าง";
let IC;

function bg(s, c = P.bg) { s.background = { color: c }; }
function shadowSoft() { return { type: "outer", color: "8A7B55", blur: 9, offset: 3, angle: 90, opacity: 0.18 }; }
async function qrPng(t) {
  const url = "https://chatgpt.com/?q=" + encodeURIComponent(t);
  const d = await QRCode.toDataURL(url, { errorCorrectionLevel: "L", margin: 1, width: 760, color: { dark: "#2B2A26", light: "#FFFFFF" } });
  return d.replace(/^data:/, "");
}
function logo(s, ox, oy, sz, gap) {
  const cols = [P.d1, P.d2, P.d5, P.d3, P.d4];
  [[0,0],[1,0],[2,0],[0,1],[1,1],[3,1],[1,2],[2,2],[3,2],[4,2]].forEach(([cx,cy],i)=>s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:ox+cx*gap,y:oy+cy*gap,w:sz,h:sz,fill:{color:cols[i%cols.length]},line:{type:"none"},rectRadius:0.03}));
}
function badge(s,x,y,w,h,fillC,txtC,label,icon){
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y,w,h,fill:{color:fillC},line:{type:"none"},rectRadius:0.06});
  if(icon) s.addImage({data:icon,x:x+0.14,y:y+h/2-0.115,w:0.23,h:0.23});
  s.addText(label,{x:x+(icon?0.46:0.18),y,w:w-(icon?0.56:0.3),h,fontFace:F,fontSize:12.5,bold:true,color:txtC,align:"left",valign:"middle",margin:0});
}
function footnote(s,kind,text){
  s.addImage({data:kind==="warn"?IC.warn:IC.bulb,x:0.62,y:6.62,w:0.26,h:0.26});
  s.addText(text,{x:0.98,y:6.5,w:11.7,h:0.5,fontFace:F,fontSize:12,italic:true,color:P.amber,align:"left",valign:"middle",margin:0});
}
function qrBlock(s,qr,x,y,sz){
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:x-0.06,y:y-0.06,w:sz+0.12,h:sz+0.12,fill:{color:"FFFFFF"},line:{color:P.border,width:1},rectRadius:0.05,shadow:shadowSoft()});
  s.addImage({data:qr,x,y,w:sz,h:sz});
  s.addText(QR_LABEL,{x:x-0.25,y:y+sz+0.04,w:sz+0.5,h:0.26,fontFace:F,fontSize:8.5,bold:true,color:P.ink2,align:"center",valign:"middle",margin:0});
}
async function stepSlide(o){
  const s=pres.addSlide(); bg(s); const A=o.accent, At=o.tint;
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:W,h:1.12,fill:{color:A},line:{type:"none"}});
  s.addText(o.demoLabel.toUpperCase(),{x:0.5,y:0.08,w:9,h:0.34,fontFace:F,fontSize:12,bold:true,color:"FFFFFF",charSpacing:2,align:"left",valign:"middle",margin:0});
  s.addText("ขั้นที่ "+o.stepNum+" / "+o.stepTotal,{x:9.8,y:0.08,w:3.3,h:0.34,fontFace:F,fontSize:12,bold:true,color:"FFFFFF",align:"right",valign:"middle",margin:0});
  s.addText(o.stepTitle,{x:0.5,y:0.46,w:12.63,h:0.52,fontFace:F,fontSize:19,bold:true,color:"FFFFFF",align:"left",valign:"middle",margin:0});
  var lx=0.5,lw=5.55,ly=1.22,lh=6.08;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:lx,y:ly,w:lw,h:lh,fill:{color:At},line:{color:A,width:1.25},rectRadius:0.08,shadow:shadowSoft()});
  badge(s,lx+0.2,ly+0.18,3.8,0.44,A,"FFFFFF","พิมพ์ / คัดลอกนี้",IC.keyboard);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:lx+0.2,y:ly+0.72,w:lw-0.4,h:3.0,fill:{color:"FFFFFF"},line:{color:A,width:0.75},rectRadius:0.06});
  s.addText(o.prompt,{x:lx+0.34,y:ly+0.8,w:lw-0.68,h:2.86,fontFace:F,fontSize:10.5,color:P.ink,align:"left",valign:"top",lineSpacingMultiple:1.1,margin:0});
  s.addShape(pres.shapes.LINE,{x:lx+0.2,y:ly+3.82,w:lw-0.4,h:0,line:{color:A,width:0.5}});
  var qx=lx+(lw-1.16)/2;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:qx-0.08,y:ly+3.96,w:1.32,h:1.32,fill:{color:"FFFFFF"},line:{color:A,width:1},rectRadius:0.05});
  s.addImage({data:o.qr,x:qx,y:ly+4.04,w:1.16,h:1.16});
  s.addText("สแกน → เปิดใน ChatGPT",{x:lx+0.1,y:ly+5.34,w:lw-0.2,h:0.26,fontFace:F,fontSize:9,bold:true,color:A,align:"center",valign:"middle",margin:0});
  s.addText("(เปิดโหมด Web Search ก่อน)",{x:lx+0.1,y:ly+5.6,w:lw-0.2,h:0.24,fontFace:F,fontSize:8.5,italic:true,color:P.muted,align:"center",valign:"middle",margin:0});
  var rx=6.25,rw=6.87,ry=1.22,rh=6.08;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:rx,y:ry,w:rw,h:rh,fill:{color:P.greenT},line:{color:P.greenBd,width:1.25},rectRadius:0.08,shadow:shadowSoft()});
  badge(s,rx+0.22,ry+0.22,5.2,0.44,P.green,"FFFFFF","AI ตอบจริง — ตัวอย่างผลลัพธ์จริง",IC.checkW);
  s.addText(o.aiResp||o.answers.join("\n\n"),{x:rx+0.28,y:ry+0.82,w:rw-0.46,h:5.1,fontFace:F,fontSize:10,color:P.ink,align:"left",valign:"top",lineSpacingMultiple:1.08,margin:0});
  s.addImage({data:o.footType==="warn"?IC.warn:IC.bulb,x:0.5,y:7.02,w:0.24,h:0.24});
  s.addText(o.footnote,{x:0.82,y:6.9,w:12.3,h:0.42,fontFace:F,fontSize:11,italic:true,color:P.amber,align:"left",valign:"middle",margin:0});
}

function introSlide(o){
  const s=pres.addSlide(); bg(s); const A=o.accent, pw=2.3, px=(W-pw)/2;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:px,y:1.5,w:pw,h:0.62,fill:{color:A},line:{type:"none"},rectRadius:0.31});
  s.addText(`HOW TO ${o.num}`,{x:px,y:1.5,w:pw,h:0.62,fontFace:F,fontSize:18,bold:true,color:"FFFFFF",align:"center",valign:"middle",charSpacing:3,margin:0});
  s.addText(o.title,{x:0.6,y:2.5,w:12.13,h:1.75,fontFace:F,fontSize:39,bold:true,color:P.ink,align:"center",valign:"middle",lineSpacingMultiple:1.04});
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:2.5,y:4.7,w:8.33,h:1.5,fill:{color:P.cardAlt},line:{color:P.border,width:1},rectRadius:0.1,shadow:shadowSoft()});
  s.addText("เตรียมตัว",{x:2.5,y:4.86,w:8.33,h:0.42,fontFace:F,fontSize:14,bold:true,color:A,align:"center",valign:"middle",charSpacing:2,margin:0});
  s.addText(o.prep,{x:2.85,y:5.26,w:7.63,h:0.86,fontFace:F,fontSize:13.5,color:P.ink2,align:"center",valign:"middle",lineSpacingMultiple:1.1,margin:0});
  s.addText(o.bottom,{x:0.6,y:6.5,w:12.13,h:0.5,fontFace:F,fontSize:13,italic:true,color:P.muted,align:"center",valign:"middle",margin:0});
}
async function walkthroughSlide(D, aiResult){
  var s=pres.addSlide(); bg(s); var A=D.accent;
  const CFG={
    1:{file:"Sample_Thai_Export_Data.xlsx",kw:"จากไฟล์ข้อมูลส่งออกนี้ ช่วยวิเคราะห์ Top 5 ตลาดส่งออกของฉันปี 2026 — ดูจากดีมานด์ การเติบโต ภาษี และคู่แข่ง เรียงลำดับพร้อมเหตุผล"},
    2:{file:"ไม่ต้องแนบไฟล์",kw:"สินค้า ข้าวหอมมะลิ 100% ส่งออกจากไทยไปสหรัฐ — HS Code คืออะไร และตอนนี้เจอภาษีนำเข้าสหรัฐเท่าไหร่ แยก reciprocal และ Section 232 ให้ด้วย"},
    3:{file:"1_Commercial_Invoice_INV-2026-014.pdf",kw:"ฉันมี Commercial Invoice นี้อยู่แล้ว ช่วยสร้าง Packing List ที่สอดคล้อง 100% (จำนวน/น้ำหนัก/มาร์กกิ้งตรงกับ Invoice) ในฟอร์แมตมาตรฐานสากล"},
    4:{file:"4_DEMO4_Source_Commercial_Invoice_INV-TX-2026-051.pdf",kw:"อ่านเอกสารนี้ แล้วดึงข้อมูลสำคัญออกมาเป็นตาราง: ผู้ส่ง ผู้รับ สินค้า จำนวน น้ำหนัก มูลค่า Incoterms เงื่อนไขชำระเงิน"},
    5:{file:"Invoice + Packing List + Contract (3 ไฟล์ PDF)",kw:"อ่าน Invoice + Packing List + Contract ทั้ง 3 ฉบับ สร้างตารางเทียบฟิลด์เคียงกัน ชี้จุดที่ไม่สอดคล้อง และตรวจกับ Incoterms 2020 / UCP 600"},
  };
  var cfg=CFG[D.num]; var qr=await qrPng(cfg.kw);
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:W,h:1.08,fill:{color:A},line:{type:"none"}});
  s.addText(D.label.toUpperCase(),{x:0.6,y:0.08,w:10,h:0.3,fontFace:F,fontSize:12,bold:true,color:"FFFFFF",charSpacing:2,align:"left",valign:"middle",margin:0});
  s.addText("ทำตามสด — ผลลัพธ์จริงจาก AI",{x:0.6,y:0.42,w:12.13,h:0.44,fontFace:F,fontSize:22,bold:true,color:"FFFFFF",align:"left",valign:"middle",margin:0});
  s.addText("แนบไฟล์ → พิมพ์ Keyword → นี่คือสิ่งที่ได้",{x:0.6,y:0.82,w:12.13,h:0.24,fontFace:F,fontSize:11.5,italic:true,color:"E0D4C0",align:"left",valign:"middle",margin:0});
  var lx=0.6,lw=4.5,ly=1.18;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:lx,y:ly,w:lw,h:6.12,fill:{color:P.cardAlt},line:{color:P.border,width:1},rectRadius:0.08,shadow:shadowSoft()});
  s.addText("📎  ไฟล์ที่แนบ",{x:lx+0.22,y:ly+0.18,w:lw-0.4,h:0.28,fontFace:F,fontSize:10.5,bold:true,color:P.muted,align:"left",valign:"middle",margin:0});
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:lx+0.22,y:ly+0.48,w:lw-0.44,h:0.44,fill:{color:"FFFFFF"},line:{color:A,width:0.75},rectRadius:0.04});
  s.addText(cfg.file,{x:lx+0.34,y:ly+0.48,w:lw-0.58,h:0.44,fontFace:F,fontSize:11,bold:true,color:A,align:"left",valign:"middle",margin:0});
  s.addShape(pres.shapes.LINE,{x:lx+0.22,y:ly+1.02,w:lw-0.44,h:0,line:{color:P.border,width:0.5}});
  s.addText("⌨️  Keyword (คัดลอกได้)",{x:lx+0.22,y:ly+1.14,w:lw-0.4,h:0.28,fontFace:F,fontSize:10.5,bold:true,color:P.muted,align:"left",valign:"middle",margin:0});
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:lx+0.22,y:ly+1.46,w:lw-0.44,h:2.5,fill:{color:"FFFFFF"},line:{color:A,width:0.75},rectRadius:0.06});
  s.addText('"'+cfg.kw+'"',{x:lx+0.34,y:ly+1.54,w:lw-0.66,h:2.36,fontFace:F,fontSize:10.5,color:P.ink,align:"left",valign:"top",lineSpacingMultiple:1.1,margin:0});
  s.addShape(pres.shapes.LINE,{x:lx+0.22,y:ly+4.06,w:lw-0.44,h:0,line:{color:P.border,width:0.5}});
  var qx=lx+(lw-1.18)/2;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:qx-0.08,y:ly+4.2,w:1.34,h:1.34,fill:{color:"FFFFFF"},line:{color:P.border,width:1},rectRadius:0.04});
  s.addImage({data:qr,x:qx,y:ly+4.28,w:1.18,h:1.18});
  s.addText("สแกน → ทำตามบนมือถือ",{x:lx+0.1,y:ly+5.58,w:lw-0.2,h:0.24,fontFace:F,fontSize:9.5,bold:true,color:A,align:"center",valign:"middle",margin:0});
  s.addText("(เปิดโหมด Web Search ก่อน)",{x:lx+0.1,y:ly+5.8,w:lw-0.2,h:0.22,fontFace:F,fontSize:9,italic:true,color:P.muted,align:"center",valign:"middle",margin:0});
  var rx=5.3,rw=7.44,ry=1.18;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:rx,y:ry,w:rw,h:6.12,fill:{color:P.greenT},line:{color:P.greenBd,width:1.25},rectRadius:0.08,shadow:shadowSoft()});
  badge(s,rx+0.22,ry+0.22,5.8,0.46,P.green,"FFFFFF","ผลลัพธ์จริงจาก AI (Claude / ChatGPT)",IC.checkW);
  s.addText(aiResult,{x:rx+0.3,y:ry+0.82,w:rw-0.5,h:5.12,fontFace:F,fontSize:12,color:P.ink,align:"left",valign:"top",lineSpacingMultiple:1.16,margin:0});
}

function matrixSlide(){
  const s=pres.addSlide(); bg(s);
  s.addText("จากเอกสารเดียว → สร้างได้ทั้งชุด",{x:0.6,y:0.42,w:12.13,h:0.5,fontFace:F,fontSize:22,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  s.addText("AI ใช้ข้อมูลที่มีอยู่ ร่างเอกสารถัดไปให้สอดคล้องกันอัตโนมัติ — กรอกเลขที่เดียว ใช้ได้ทั้งชุด",{x:0.6,y:0.92,w:12.13,h:0.4,fontFace:F,fontSize:13,color:P.muted,align:"left",valign:"middle",margin:0});
  const flows=[
    {icon:IC.icContract,c:P.d4,from:"Sales Contract / PO",to:["Proforma Invoice","Commercial Invoice","Packing List (โครง)"]},
    {icon:IC.icInvoice,c:P.d1,from:"Commercial Invoice",to:["Packing List","ใบขนสินค้า (ร่าง)","เอกสารยื่น L/C"]},
    {icon:IC.icFile,c:P.d5,from:"Proforma / Quotation",to:["Sales Contract (ร่าง)","Shipping Instruction","คำขอ C/O"]},
  ];
  const cw=3.83,gap=0.32,x0=0.6,cy=1.5,ch=2.7;
  flows.forEach((fl,i)=>{ const x=x0+i*(cw+gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y:cy,w:cw,h:ch,fill:{color:P.card},line:{color:P.border,width:1},rectRadius:0.08,shadow:shadowSoft()});
    s.addImage({data:fl.icon,x:x+0.24,y:cy+0.24,w:0.36,h:0.36});
    s.addText("จาก",{x:x+0.7,y:cy+0.18,w:cw-0.9,h:0.24,fontFace:F,fontSize:10.5,color:P.muted,align:"left",valign:"middle",margin:0});
    s.addText(fl.from,{x:x+0.7,y:cy+0.4,w:cw-0.9,h:0.3,fontFace:F,fontSize:13.5,bold:true,color:fl.c,align:"left",valign:"middle",margin:0});
    fl.to.forEach((t,j)=>{ const ry=cy+0.92+j*0.55;
      s.addImage({data:IC.icArrow,x:x+0.26,y:ry+0.04,w:0.22,h:0.22});
      s.addText(t,{x:x+0.58,y:ry-0.05,w:cw-0.8,h:0.4,fontFace:F,fontSize:12.5,color:P.ink2,align:"left",valign:"middle",margin:0}); }); });
  s.addText("ปรับตามอุตสาหกรรม — เอกสาร/ใบรับรองที่ต้องเพิ่ม",{x:0.6,y:4.42,w:12.13,h:0.36,fontFace:F,fontSize:14,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  const inds=[{icon:IC.icLeaf,label:"อาหาร/เกษตร",sub:"Phytosanitary · Health Cert"},{icon:IC.icShirt,label:"สิ่งทอ/เสื้อผ้า",sub:"C/O · Fiber content"},{icon:IC.icChip,label:"อิเล็กทรอนิกส์",sub:"CE / FCC · Datasheet"},{icon:IC.icIndustry,label:"เหล็ก/โลหะ",sub:"Mill Cert · CBAM"}];
  const iw=2.93,ig=0.3,ix0=0.6,iy=4.9,ih=1.45;
  inds.forEach((nd,i)=>{ const x=ix0+i*(iw+ig);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y:iy,w:iw,h:ih,fill:{color:P.cardAlt},line:{color:P.border,width:1},rectRadius:0.08});
    s.addImage({data:nd.icon,x:x+iw/2-0.22,y:iy+0.2,w:0.44,h:0.44});
    s.addText(nd.label,{x:x+0.1,y:iy+0.7,w:iw-0.2,h:0.32,fontFace:F,fontSize:13,bold:true,color:P.ink,align:"center",valign:"middle",margin:0});
    s.addText(nd.sub,{x:x+0.1,y:iy+1.0,w:iw-0.2,h:0.34,fontFace:F,fontSize:10.5,color:P.muted,align:"center",valign:"middle",margin:0}); });
  footnote(s,"warn","ใบรับรองบางอย่าง (Phytosanitary, Mill Cert, C/O) ออกได้โดยหน่วยงานรัฐ/แล็บที่รับรองเท่านั้น — AI ร่างคำขอให้ได้ แต่ยื่นเอง");
}
function mockSetSlide(){
  const s=pres.addSlide(); bg(s); const A=P.d3;
  s.addText("ชุดเอกสารตัวอย่าง — ส่งออกข้าวหอมมะลิ 2 ออเดอร์ ไปเยอรมนี",{x:0.6,y:0.42,w:12.13,h:0.5,fontFace:F,fontSize:22,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  s.addText("Siam Rice Co., Ltd. (กรุงเทพฯ)  →  EuroFood GmbH (Hamburg) · ไฟล์ PDF เต็ม + QR ดาวน์โหลด อยู่ในภาคผนวกท้ายเล่ม",{x:0.6,y:0.92,w:12.13,h:0.4,fontFace:F,fontSize:13,color:P.muted,align:"left",valign:"middle",margin:0});
  const cards=[
    {icon:IC.icInvoice,c:P.d1,t:"Commercial Invoice",n:"INV-2026-014",rows:[["สินค้า","Thai Hom Mali Rice 100%"],["HS Code","1006.30"],["จำนวน","1,200 ถุง (× 25 kg)"],["มูลค่า","USD 36,000"],["Incoterms","FOB Bangkok"]]},
    {icon:IC.icBox,c:P.d5,t:"Packing List",n:"PL-2026-014",rows:[["สินค้า","Hom Mali Rice 100%"],["จำนวน","1,180 ถุง"],["น้ำหนักรวม","29,500 kg gross"],["พาเลท","24 pallets"],["มาร์กกิ้ง","EFG / Hamburg"]]},
    {icon:IC.icContract,c:P.d4,t:"Sales Contract",n:"SC-2026-007",rows:[["ปริมาณ","30,000 kg"],["Incoterms","CIF Hamburg"],["ชำระเงิน","L/C at sight"],["HS Code","— (ไม่ระบุ)"],["Origin","— (ไม่มี clause)"]]},
  ];
  const cw=3.83,gap=0.32,x0=0.6,cy=1.5,ch=3.65;
  cards.forEach((cd,i)=>{ const x=x0+i*(cw+gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y:cy,w:cw,h:ch,fill:{color:P.card},line:{color:P.border,width:1},rectRadius:0.08,shadow:shadowSoft()});
    s.addImage({data:cd.icon,x:x+0.24,y:cy+0.26,w:0.4,h:0.4});
    s.addText(cd.t,{x:x+0.74,y:cy+0.2,w:cw-0.9,h:0.34,fontFace:F,fontSize:14.5,bold:true,color:cd.c,align:"left",valign:"middle",margin:0});
    s.addText(cd.n,{x:x+0.74,y:cy+0.52,w:cw-0.9,h:0.28,fontFace:F,fontSize:11,color:P.muted,align:"left",valign:"middle",margin:0});
    s.addShape(pres.shapes.LINE,{x:x+0.24,y:cy+0.92,w:cw-0.48,h:0,line:{color:P.border,width:1}});
    cd.rows.forEach(([k,v],j)=>{ const ry=cy+1.04+j*0.5;
      const mism=(cd.t==="Packing List"&&k==="จำนวน")||(cd.t==="Sales Contract"&&k==="Incoterms")||(k==="HS Code"&&v.startsWith("—"))||(k==="Origin");
      s.addText(k,{x:x+0.26,y:ry,w:1.25,h:0.44,fontFace:F,fontSize:11.5,color:P.muted,align:"left",valign:"middle",margin:0});
      s.addText(v,{x:x+1.5,y:ry,w:cw-1.72,h:0.44,fontFace:F,fontSize:11.5,bold:mism,color:mism?P.red:P.ink,align:"left",valign:"middle",margin:0}); }); });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:5.45,w:12.13,h:1.6,fill:{color:P.d3t},line:{color:A,width:1.25},rectRadius:0.08});
  s.addText([{text:"จุดที่ปลูกไว้ให้ AI จับ",options:{bold:true,color:A}}],{x:0.82,y:5.58,w:11.6,h:0.34,fontFace:F,fontSize:13.5,align:"left",valign:"middle",margin:0});
  ["จำนวนถุงไม่ตรง: Invoice 1,200 ถุง  vs  Packing List 1,180 ถุง","Incoterms ไม่ตรง: Invoice = FOB Bangkok  vs  Contract = CIF Hamburg","ขาดข้อมูล: Contract ไม่ระบุ HS Code และไม่มี Country-of-Origin clause"].forEach((f,i)=>{ const fy=5.96+i*0.36;
    s.addImage({data:IC.warn,x:0.84,y:fy+0.02,w:0.2,h:0.2});
    s.addText(f,{x:1.12,y:fy-0.06,w:11.4,h:0.34,fontFace:F,fontSize:12.5,color:P.ink2,align:"left",valign:"middle",margin:0}); });
}
function archSlide(){
  const s=pres.addSlide(); bg(s);
  s.addText("เลขา AI + ทีมผู้ช่วย 5 ด้าน (มัลติเอเจนต์)",{x:0.6,y:0.4,w:8.1,h:0.5,fontFace:F,fontSize:21,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:9.0,y:0.46,w:3.73,h:0.46,fill:{color:P.capt},line:{color:P.cap,width:1},rectRadius:0.23});
  s.addText("▶  ดูสดด้วย Pixel Agents (VS Code)",{x:9.0,y:0.46,w:3.73,h:0.46,fontFace:F,fontSize:11,bold:true,color:P.cap,align:"center",valign:"middle",margin:0});
  const oc={x:4.86,y:1.35,w:3.6,h:0.95};
  const agents=[
    {c:P.d5,icon:IC.icMag,name:"Market Scout",role:"หาตลาด + ผู้ซื้อ",tool:"Web Search"},
    {c:P.d1,icon:IC.icScale,name:"Tariff Analyst",role:"ภาษี + landed cost",tool:"Web Search"},
    {c:P.d4,icon:IC.icContract2,name:"Doc Drafter",role:"ร่างเอกสารส่งออก",tool:"Templates"},
    {c:P.d2,icon:IC.icFile2,name:"Doc Reader",role:"อ่าน + สกัดข้อมูล",tool:"File upload"},
    {c:P.d3,icon:IC.icCheck2,name:"Compliance",role:"ตรวจ + กฎสากล",tool:"Knowledge / MCP"},
  ];
  const cw=2.2,gap=0.28,x0=0.6,ay=3.5,ah=1.85;
  const centers=agents.map((_,i)=>x0+cw/2+i*(cw+gap));
  const ocb={x:oc.x+oc.w/2,y:oc.y+oc.h};
  centers.forEach(cx=>{ s.addShape(pres.shapes.LINE,{x:Math.min(ocb.x,cx),y:ocb.y,w:Math.abs(cx-ocb.x),h:ay-ocb.y,line:{color:P.border,width:1.5,endArrowType:"triangle"},flipH:cx<ocb.x}); });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:oc.x,y:oc.y,w:oc.w,h:oc.h,fill:{color:P.cap},line:{type:"none"},rectRadius:0.1,shadow:shadowSoft()});
  s.addText([{text:"เลขา AI",options:{bold:true,fontSize:18,breakLine:true}},{text:"วางแผนและสั่งงานทีมผู้ช่วยให้อัตโนมัติ",options:{fontSize:10.5,color:"D8CFBE"}}],{x:oc.x,y:oc.y,w:oc.w,h:oc.h,fontFace:F,color:"FFFFFF",align:"center",valign:"middle",margin:0});
  s.addText("INPUT: ชื่อสินค้า + ตลาดเป้าหมาย",{x:0.6,y:1.55,w:3.9,h:0.5,fontFace:F,fontSize:12,bold:true,color:P.muted,align:"left",valign:"middle",margin:0});
  s.addImage({data:IC.icArrowCap,x:4.4,y:1.66,w:0.4,h:0.4});
  agents.forEach((a,i)=>{ const x=x0+i*(cw+gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y:ay,w:cw,h:ah,fill:{color:P.card},line:{color:a.c,width:1.5},rectRadius:0.09,shadow:shadowSoft()});
    s.addShape(pres.shapes.OVAL,{x:x+cw/2-0.32,y:ay+0.18,w:0.64,h:0.64,fill:{color:a.c},line:{type:"none"}});
    s.addImage({data:a.icon,x:x+cw/2-0.17,y:ay+0.33,w:0.34,h:0.34});
    s.addText(a.name,{x:x+0.08,y:ay+0.9,w:cw-0.16,h:0.3,fontFace:F,fontSize:12.5,bold:true,color:P.ink,align:"center",valign:"middle",margin:0});
    s.addText(a.role,{x:x+0.08,y:ay+1.18,w:cw-0.16,h:0.3,fontFace:F,fontSize:10.5,color:P.ink2,align:"center",valign:"middle",margin:0});
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:x+0.25,y:ay+1.46,w:cw-0.5,h:0.3,fill:{color:a.c},line:{type:"none"},rectRadius:0.15});
    s.addText(a.tool,{x:x+0.1,y:ay+1.46,w:cw-0.2,h:0.3,fontFace:F,fontSize:9.5,bold:true,color:"FFFFFF",align:"center",valign:"middle",margin:0}); });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:5.62,w:12.13,h:0.82,fill:{color:P.greenT},line:{color:P.greenBd,width:1.25},rectRadius:0.1});
  s.addImage({data:IC.icRocket,x:0.86,y:5.86,w:0.34,h:0.34});
  s.addText([{text:"OUTPUT: ",options:{bold:true,color:P.green}},{text:"แพ็กเกจส่งออกพร้อมใช้ — กลยุทธ์ตลาด + ต้นทุน/ภาษี + เอกสารครบชุด + รายงาน compliance",options:{color:P.ink2}}],{x:1.34,y:5.62,w:11.2,h:0.82,fontFace:F,fontSize:13.5,align:"left",valign:"middle",margin:0});
  footnote(s,"tip","รูปแบบ orchestrator–worker = ทำครบ 6 ขั้นแบบ Bonus 2 ให้อัตโนมัติในคำสั่งเดียว · ต่อ tools/MCP ยิ่งมาก ยิ่งทำงานแทนได้มาก");
  s.addNotes("DEMO 6 — ตัวเลือกพรีเซนต์สด (เฉพาะผู้บรรยาย): รันด้วย Claude Code ใน VS Code + ส่วนขยาย Pixel Agents เพื่อให้ผู้ชมเห็นเอเจนต์เป็นตัวละครในออฟฟิศพิกเซล. Orchestrator = เซสชัน Claude Code หลัก; sub-agent แต่ละตัว (Market Scout / Tariff Analyst / Doc Drafter / Doc Reader / Compliance) ถูกสร้างผ่าน Task tool และปรากฏเป็นตัวละครแยกที่เชื่อมกับ parent. ติดตั้ง Pixel Agents จาก VS Code Marketplace (ต้องมี Claude Code CLI ก่อน). ดูขั้นตอนเต็มและ master prompt ในไฟล์ runbook ที่แนบมา. ข้อควรระวัง: การตรวจสถานะเป็น heuristic อาจคลาดเคลื่อน/ desync ได้ — ซ้อมก่อนและอัดวิดีโอสำรองไว้; อย่าใช้ --dangerously-skip-permissions บนเครื่องที่เข้าถึงข้อมูลสำคัญ (ถ้าจะใช้ ให้รันใน VM/แซนด์บ็อกซ์).");
}
async function masterPromptSlide(qr){
  const s=pres.addSlide(); bg(s); const A=P.cap;
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:W,h:1.32,fill:{color:A},line:{type:"none"}});
  s.addText("BONUS · มัลติเอเจนต์",{x:0.6,y:0.16,w:9.5,h:0.4,fontFace:F,fontSize:13,bold:true,color:"FFFFFF",charSpacing:2,align:"left",valign:"middle",margin:0});
  s.addText("Master Prompt",{x:10.0,y:0.16,w:2.73,h:0.4,fontFace:F,fontSize:13,bold:true,color:"FFFFFF",align:"right",valign:"middle",margin:0});
  s.addText("คำสั่งเดียว ให้เลขา AI สั่งงานทั้งทีม",{x:0.6,y:0.6,w:12.13,h:0.6,fontFace:F,fontSize:20,bold:true,color:"FFFFFF",align:"left",valign:"middle",margin:0});
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:1.62,w:12.13,h:2.7,fill:{color:P.capt},line:{color:A,width:1.25},rectRadius:0.09,shadow:shadowSoft()});
  badge(s,0.78,1.8,2.95,0.5,A,"FFFFFF","พิมพ์ / คัดลอกนี้",IC.keyboard);
  const mp='อัปโหลดไฟล์ข้อมูลส่งออกนี้ แล้วทำงานเป็นทีมเอเจนต์ให้ครบ 6 ขั้นในคำสั่งเดียว (เนื้อหาเดียวกับ Bonus 2 แต่ทำอัตโนมัติ): (1) อ่านไฟล์ข้อมูล (2) หา Top 3 ตลาด + ผู้ซื้อ (3) วิเคราะห์ภาษีและ landed cost ของตลาดที่ดีที่สุด (4) ร่าง Commercial Invoice + Packing List (5) ตรวจความสอดคล้องและกฎปลายทาง (6) สรุปเป็นแผนปฏิบัติพร้อมเอกสารแนบ';
  s.addText(mp,{x:0.95,y:2.44,w:9.55,h:1.78,fontFace:F,fontSize:14,color:P.ink,align:"left",valign:"top",lineSpacingMultiple:1.12,margin:0});
  qrBlock(s,qr,10.92,1.92,1.5);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:4.42,w:12.13,h:1.9,fill:{color:P.greenT},line:{color:P.greenBd,width:1.25},rectRadius:0.09,shadow:shadowSoft()});
  badge(s,0.78,4.58,4.35,0.5,P.green,"FFFFFF","AI จะตอบประมาณนี้",IC.checkW);
  const ans=["AI วางแผนและทำครบ 6 ขั้นเหมือน Bonus 2 (อ่านไฟล์→ตลาด→ภาษี→ร่างเอกสาร→ตรวจ→สรุป) ให้อัตโนมัติ","ได้ครบในรอบเดียว: ตลาดเป้าหมาย + ต้นทุน/ภาษี + ร่างเอกสาร + รายงาน compliance","ส่งต่อให้คนตรวจและอนุมัติก่อนใช้จริง — ย่นงานหลายวันเหลือไม่กี่นาที"];
  const ys=[5.16,5.56,5.96];
  ans.forEach((a,i)=>{ s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.97,y:ys[i]+0.05,w:0.15,h:0.15,fill:{color:P.green},line:{type:"none"},rectRadius:0.02});
    s.addText(a,{x:1.3,y:ys[i]-0.07,w:11.3,h:0.42,fontFace:F,fontSize:13.5,color:P.ink2,align:"left",valign:"middle",margin:0}); });
  footnote(s,"warn","เอกสารที่ได้เป็นร่าง — ต้องคนตรวจ ลงนาม และยื่นเอง · ตรวจตัวเลขภาษี/กฎกับแหล่งทางการก่อนใช้จริง");
  s.addNotes("วิธีรันสดด้วย Pixel Agents: 1) เปิดโฟลเดอร์เปล่าใน VS Code  2) เปิดแผง Pixel Agents → + Agent (เริ่มเซสชัน Claude Code)  3) วาง master prompt นี้ โดยสั่งให้ orchestrator ใช้ Task tool แตกเป็น 5 sub-agent ตามบทบาท และให้ Doc Drafter เขียนไฟล์จริง (เช่น invoice.md, packing_list.md) เพื่อโยงกับไฟล์ PDF ตัวอย่าง  4) ผู้ชมจะเห็นตัวละคร 5 ตัวทำงาน. แผนสำรอง: ถ้า desync/เน็ตช้า ใช้วิดีโอที่อัดล่วงหน้า. orchestrator prompt เต็ม (สั่งใช้ Task tool) อยู่ในไฟล์ runbook ที่แนบมา.");
}

async function qrRaw(url){ const d=await QRCode.toDataURL(url,{errorCorrectionLevel:"M",margin:1,width:620,color:{dark:"#2B2A26",light:"#FFFFFF"}}); return d.replace(/^data:/,""); }

function bonusIntroSlide(){
  const s=pres.addSlide(); bg(s,P.cap);
  logo(s,6.05,1.1,0.2,0.235);
  const pw=2.8,px=(W-pw)/2;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:px,y:2.35,w:pw,h:0.56,fill:{color:P.gold},line:{type:"none"},rectRadius:0.28});
  s.addText("BONUS",{x:px,y:2.35,w:pw,h:0.56,fontFace:F,fontSize:16,bold:true,color:P.cap,align:"center",valign:"middle",charSpacing:3,margin:0});
  s.addText("เลขา AI สั่งงาน\nทั้งทีมให้คุณ",{x:0.6,y:3.05,w:12.13,h:1.9,fontFace:F,fontSize:48,bold:true,color:"FFFFFF",align:"center",valign:"middle",lineSpacingMultiple:1.02});
  s.addText("ผู้ช่วยส่วนตัวที่สั่งงานทีม AI 5 ด้านให้อัตโนมัติ — รวมทุก How To ในคำสั่งเดียว",{x:0.6,y:5.05,w:12.13,h:0.5,fontFace:F,fontSize:16,color:"E7DFCF",align:"center",valign:"middle",margin:0});
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:3.55,y:5.95,w:6.23,h:0.66,fill:{color:"4A443A"},line:{type:"none"},rectRadius:0.33});
  s.addText("▶  ดูสดด้วย Pixel Agents · VS Code + Claude Code",{x:3.55,y:5.95,w:6.23,h:0.66,fontFace:F,fontSize:13.5,bold:true,color:P.gold,align:"center",valign:"middle",margin:0});
}

function buildStepsSlide(){
  const s=pres.addSlide(); bg(s);
  s.addText("สร้างสด: ทำตามทีละขั้น (Pixel Agents)",{x:0.6,y:0.42,w:12.13,h:0.5,fontFace:F,fontSize:22,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  s.addText("ทำตามนี้ทีละข้อบนเวที — ผู้ชมจะเห็นทีมเอเจนต์ทำงานจริงไปพร้อมกัน",{x:0.6,y:0.92,w:12.13,h:0.4,fontFace:F,fontSize:13,color:P.muted,align:"left",valign:"middle",margin:0});
  const steps=[
    "เปิดโฟลเดอร์เปล่าใน VS Code · วางไฟล์ PDF ตัวอย่างลงไป",
    'เปิดแผง Pixel Agents → กด "+ Agent" (เริ่ม Claude Code = Orchestrator)',
    "วาง Master Prompt (สไลด์ถัดไป) — สั่งให้ใช้ Task tool แตกเป็น 5 เอเจนต์",
    "ดูตัวละคร 5 ตัวทำงานพร้อมกัน: ตลาด · ภาษี · ร่างเอกสาร · อ่าน · ตรวจ",
    "เปิดไฟล์ที่ AI สร้าง (invoice.md, packing_list.md) โชว์ผลจริง",
    "ปิดท้ายด้วย summary.md — แผน + ต้นทุน + เอกสาร + compliance ครบในที่เดียว",
  ];
  const cw=5.96,gap=0.21,ch=1.42,rgap=0.16,x0=0.6,y0=1.45;
  steps.forEach((t,i)=>{ const col=i%2,row=Math.floor(i/2); const x=x0+col*(cw+gap), y=y0+row*(ch+rgap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x,y,w:cw,h:ch,fill:{color:P.card},line:{color:P.border,width:1},rectRadius:0.08,shadow:shadowSoft()});
    s.addShape(pres.shapes.OVAL,{x:x+0.28,y:y+ch/2-0.34,w:0.68,h:0.68,fill:{color:P.cap},line:{type:"none"}});
    s.addText(String(i+1),{x:x+0.28,y:y+ch/2-0.34,w:0.68,h:0.68,fontFace:F,fontSize:25,bold:true,color:P.gold,align:"center",valign:"middle",margin:0});
    s.addText(t,{x:x+1.12,y:y+0.12,w:cw-1.32,h:ch-0.24,fontFace:F,fontSize:13.5,color:P.ink,align:"left",valign:"middle",lineSpacingMultiple:1.08,margin:0}); });
  footnote(s,"warn","ซ้อมก่อนขึ้นเวที · เตรียมวิดีโอสำรอง · อย่าใช้ --dangerously-skip-permissions บนเครื่องที่มีข้อมูลสำคัญ (รันใน VM/แซนด์บ็อกซ์)");
}

function osirisSlide(){
  const s=pres.addSlide(); bg(s);
  s.addText("เครื่องมือเสริม — Osiris: แดชบอร์ด OSINT โอเพนซอร์ส",{x:0.6,y:0.42,w:12.13,h:0.5,fontFace:F,fontSize:22,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  s.addText('รวมข้อมูลสาธารณะเรียลไทม์ (เที่ยวบิน · ท่าเรือ · ภัยพิบัติ · ข่าว · คว่ำบาตร) ไว้บนแผนที่เดียว · นิยามตัวเองว่า "ทางเลือกแทน Palantir"',{x:0.6,y:0.92,w:12.13,h:0.4,fontFace:F,fontSize:13,color:P.muted,align:"left",valign:"middle",margin:0});
  const cy=1.55, ch=4.55;
  // left — how it helps
  const lx=0.6,lw=5.95;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:lx,y:cy,w:lw,h:ch,fill:{color:P.d5t},line:{color:P.d5,width:1.25},rectRadius:0.09,shadow:shadowSoft()});
  s.addText("ช่วยผู้ส่งออกตรงไหน",{x:lx+0.3,y:cy+0.22,w:lw-0.6,h:0.36,fontFace:F,fontSize:15,bold:true,color:P.d5,align:"left",valign:"middle",margin:0});
  ["คัดกรองผู้ซื้อ/เรือ กับบัญชีคว่ำบาตร OFAC (SDN) ก่อนทำสัญญา","ติดตามท่าเรือ/จุดคอขวดเดินเรือ และเขตความขัดแย้งที่กระทบเส้นทาง–ลีดไทม์","เห็นภาพรวมสถานการณ์โลกเรียลไทม์ (เที่ยวบิน ภัยพิบัติ ข่าว)"].forEach((p,i)=>{ const py=cy+0.78+i*0.82;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:lx+0.32,y:py+0.04,w:0.16,h:0.16,fill:{color:P.d5},line:{type:"none"},rectRadius:0.02});
    s.addText(p,{x:lx+0.62,y:py-0.16,w:lw-0.92,h:0.62,fontFace:F,fontSize:13,color:P.ink2,align:"left",valign:"middle",lineSpacingMultiple:1.05,margin:0}); });
  s.addText("ส่วนใหญ่เป็น OSINT กว้างๆ — สำหรับ SME ที่เกี่ยวตรงคือ sanctions + ความเสี่ยงเส้นทาง",{x:lx+0.3,y:cy+ch-0.86,w:lw-0.6,h:0.72,fontFace:F,fontSize:11.5,italic:true,color:P.muted,align:"left",valign:"top",lineSpacingMultiple:1.05,margin:0});
  // right — compare
  const rx=6.78,rw=5.95;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:rx,y:cy,w:rw,h:ch,fill:{color:P.card},line:{color:P.border,width:1},rectRadius:0.09,shadow:shadowSoft()});
  s.addText("Osiris  vs  Palantir",{x:rx+0.3,y:cy+0.22,w:rw-0.6,h:0.36,fontFace:F,fontSize:15,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  const cL=rx+0.3, cO=rx+1.55, cP=rx+3.5, wO=1.9, wP=2.15;
  s.addText("Osiris",{x:cO,y:cy+0.6,w:wO,h:0.28,fontFace:F,fontSize:11.5,bold:true,color:P.d5,align:"left",valign:"middle",margin:0});
  s.addText("Palantir",{x:cP,y:cy+0.6,w:wP,h:0.28,fontFace:F,fontSize:11.5,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  const rows=[["รูปแบบ","โอเพนซอร์ส (MIT) ฟรี","เชิงพาณิชย์ ปิดซอร์ส ราคาสูง"],["ผู้ใช้","ใครก็ได้ · self-host","รัฐ/องค์กรขนาดใหญ่"],["ข้อมูล","ฟีดสาธารณะ (OSINT)","บูรณาการ+วิเคราะห์ข้อมูลภายใน+ภายนอกเชิงลึก"],["ขอบเขต","แดชบอร์ดเฝ้าระวัง","แพลตฟอร์มวิเคราะห์ครบวงจร (Gotham/Foundry)"]];
  rows.forEach((r,i)=>{ const ry=cy+0.98+i*0.82;
    s.addText(r[0],{x:cL,y:ry,w:1.2,h:0.7,fontFace:F,fontSize:11.5,bold:true,color:P.muted,align:"left",valign:"top",margin:0});
    s.addText(r[1],{x:cO,y:ry,w:wO,h:0.7,fontFace:F,fontSize:11,color:P.d5,align:"left",valign:"top",lineSpacingMultiple:1.03,margin:0});
    s.addText(r[2],{x:cP,y:ry,w:wP,h:0.78,fontFace:F,fontSize:11,color:P.ink2,align:"left",valign:"top",lineSpacingMultiple:1.03,margin:0}); });
  footnote(s,"tip","Osiris: โอเพนซอร์ส MIT · เดโม osirisai.live — เป็นเครื่องมือเฝ้าระวังประกอบการตัดสินใจ ไม่ใช่ที่ปรึกษาด้านกฎหมาย/คว่ำบาตร");
}

function appendixDivider(qr){
  const s=pres.addSlide(); bg(s,P.cap);
  s.addText("ภาคผนวก",{x:0.6,y:1.35,w:12.13,h:0.5,fontFace:F,fontSize:18,bold:true,color:P.gold,align:"center",charSpacing:5,margin:0});
  s.addText("เอกสารตัวอย่าง — อัปโหลดให้ AI ได้",{x:0.6,y:2.0,w:12.13,h:1.0,fontFace:F,fontSize:38,bold:true,color:"FFFFFF",align:"center",valign:"middle",margin:0});
  s.addText("Commercial Invoice · Packing List · Sales Contract (ชุดข้าวหอมมะลิ) + Invoice ต้นทางสำหรับ How To 3 สร้างเอกสาร",{x:0.6,y:3.2,w:12.13,h:0.5,fontFace:F,fontSize:14,color:"E7DFCF",align:"center",margin:0});
  const qx=6.0,qy=4.05,sz=1.6;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:qx-0.1,y:qy-0.1,w:sz+0.2,h:sz+0.2,fill:{color:"FFFFFF"},line:{type:"none"},rectRadius:0.06,shadow:shadowSoft()});
  s.addImage({data:qr,x:qx,y:qy,w:sz,h:sz});
  s.addText("สแกนเพื่อดาวน์โหลดไฟล์",{x:qx-1.2,y:qy+sz+0.06,w:sz+2.4,h:0.3,fontFace:F,fontSize:12,bold:true,color:"E7DFCF",align:"center",valign:"middle",margin:0});
  s.addText("(ลิงก์ตัวอย่าง — เปลี่ยนเป็นโฟลเดอร์จริงของคุณ เช่น Google Drive)",{x:3.5,y:qy+sz+0.38,w:6.33,h:0.3,fontFace:F,fontSize:10.5,italic:true,color:"B8AE99",align:"center",valign:"middle",margin:0});
}

async function docImageSlide(path,name,note,dlUrl){
  const s=pres.addSlide(); bg(s);
  s.addText(name,{x:0.6,y:0.38,w:8.6,h:0.5,fontFace:F,fontSize:19,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:9.45,y:0.42,w:3.28,h:0.46,fill:{color:P.d3t},line:{color:P.d3,width:1},rectRadius:0.23});
  s.addText("อัปโหลดไฟล์นี้ให้ AI",{x:9.45,y:0.42,w:3.28,h:0.46,fontFace:F,fontSize:12,bold:true,color:P.d3,align:"center",valign:"middle",margin:0});
  const ih=5.0, iw=ih/1.413, ix=0.6;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:ix-0.06,y:0.97,w:iw+0.12,h:ih+0.1,fill:{color:"FFFFFF"},line:{color:P.border,width:1},rectRadius:0.04,shadow:shadowSoft()});
  s.addImage({path,x:ix,y:1.02,w:iw,h:ih});
  const qr=await qrRaw(dlUrl||"https://drive.google.com/your-file");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:iw+0.82,y:1.2,w:4.02,h:5.7,fill:{color:P.cardAlt},line:{color:P.border,width:1},rectRadius:0.08,shadow:shadowSoft()});
  s.addText("ดาวน์โหลดไฟล์นี้",{x:iw+0.92,y:1.38,w:3.82,h:0.36,fontFace:F,fontSize:14,bold:true,color:P.d3,align:"center",valign:"middle",margin:0});
  const qx=iw+1.52, qy=1.84, qz=2.84;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:qx-0.08,y:qy-0.08,w:qz+0.16,h:qz+0.16,fill:{color:"FFFFFF"},line:{color:P.border,width:1},rectRadius:0.06});
  s.addImage({data:qr,x:qx,y:qy,w:qz,h:qz});
  s.addText("สแกน → ดาวน์โหลด",{x:iw+0.82,y:qy+qz+0.12,w:4.02,h:0.3,fontFace:F,fontSize:12,bold:true,color:P.d5,align:"center",valign:"middle",margin:0});
  s.addText("(ปรับ URL เมื่อมี Google Drive link จริง)",{x:iw+0.82,y:qy+qz+0.44,w:4.02,h:0.3,fontFace:F,fontSize:9.5,italic:true,color:P.muted,align:"center",valign:"middle",margin:0});
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:iw+0.92,y:5.42,w:3.82,h:1.26,fill:{color:P.d3t},line:{color:P.d3,width:1},rectRadius:0.07});
  s.addText("ใช้ใน",{x:iw+0.92,y:5.5,w:3.82,h:0.26,fontFace:F,fontSize:10,bold:true,color:P.d3,align:"center",valign:"middle",margin:0});
  s.addText(note,{x:iw+0.92,y:5.74,w:3.82,h:0.9,fontFace:F,fontSize:10,color:P.ink2,align:"center",valign:"top",lineSpacingMultiple:1.1,margin:0});
}

async function bonus2IntroSlide(){
  const s=pres.addSlide(); bg(s,P.cap);
  s.addShape(pres.shapes.OVAL,{x:6.27,y:1.12,w:0.82,h:0.82,fill:{color:P.cap2},line:{type:"none"}});
  s.addShape(pres.shapes.ISOSCELES_TRIANGLE,{x:6.57,y:1.32,w:0.32,h:0.42,fill:{color:"FFFFFF"},line:{type:"none"},rotate:90});
  const pw=2.7,px=(W-pw)/2;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:px,y:2.3,w:pw,h:0.56,fill:{color:P.cap2},line:{type:"none"},rectRadius:0.28});
  s.addText("BONUS 2",{x:px,y:2.3,w:pw,h:0.56,fontFace:F,fontSize:16,bold:true,color:"FFFFFF",align:"center",valign:"middle",charSpacing:3,margin:0});
  s.addText("ทำครบในแชตเดียว\nสอนทีละขั้น",{x:0.6,y:3.0,w:12.13,h:1.9,fontFace:F,fontSize:46,bold:true,color:"FFFFFF",align:"center",valign:"middle",lineSpacingMultiple:1.02});
  s.addText("สอนทีละขั้น ดูแล้วทำตามได้ทุกขั้น · หาตลาด → ภาษี → เอกสาร → ตรวจ",{x:0.6,y:5.02,w:12.13,h:0.5,fontFace:F,fontSize:15.5,color:"E7DFCF",align:"center",valign:"middle",margin:0});
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:3.55,y:5.95,w:6.23,h:0.66,fill:{color:"4A443A"},line:{type:"none"},rectRadius:0.33});
  s.addText("▶  อัปโหลดไฟล์ครั้งเดียว แล้วถามต่อทีละขั้นในแชตเดียว",{x:3.55,y:5.95,w:6.23,h:0.66,fontFace:F,fontSize:12.5,bold:true,color:P.gold,align:"center",valign:"middle",margin:0});
}
async function bonus2TutorialSlide(part){
  const s=pres.addSlide(); bg(s); const A=P.cap2;
  const STEPS={
    1:{sub:"เปิด + อัปโหลดไฟล์ → หาตลาด → ภาษี/ต้นทุน", rows:[
        ["1","เปิด ChatGPT + อัปโหลดไฟล์ข้อมูลส่งออก (.xlsx)","นี่คือข้อมูลส่งออกของฉัน ช่วยดูให้หน่อย"],
        ["2","หาตลาดที่มีโอกาส","วิเคราะห์ Top 5 ตลาดส่งออกของฉันปี 2026 เรียงตามโอกาส พร้อมเหตุผล"],
        ["3","ภาษี + ต้นทุน","ตลาดอันดับ 1 เจอภาษีนำเข้าเท่าไหร่ และ landed cost ต่อตันเท่าไหร่"]]},
    2:{sub:"สร้างเอกสาร → ตรวจความสอดคล้อง → สรุปพร้อมใช้", rows:[
        ["4","สร้างเอกสารส่งออก","ร่าง Commercial Invoice + Packing List สำหรับออเดอร์ไปตลาดนั้น"],
        ["5","ตรวจเอกสาร + กฎปลายทาง","ตรวจว่าเอกสารสอดคล้องกันไหม และต้องมีใบรับรองอะไรตามกฎปลายทาง"],
        ["6","สรุปเป็นแผนพร้อมใช้","สรุปทั้งหมดเป็นแผนปฏิบัติ + checklist เอกสารที่ต้องเตรียม"]]},
  };
  const cfg=STEPS[part];
  s.addText("ทำตามทีละขั้น (ดูแล้วทำตามได้)",{x:0.6,y:0.36,w:8.4,h:0.34,fontFace:F,fontSize:13,bold:true,color:A,charSpacing:1,align:"left",valign:"middle",margin:0});
  s.addText("BONUS 2 — ทำครบในแชตเดียว · ส่วนที่ "+part+"/2",{x:0.6,y:0.66,w:12.13,h:0.46,fontFace:F,fontSize:21,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  s.addText(cfg.sub+" · แคปหน้าจอแต่ละขั้นวางในช่องขวา",{x:0.6,y:1.14,w:12.13,h:0.34,fontFace:F,fontSize:12.5,color:P.muted,align:"left",valign:"middle",margin:0});
  const ry0=1.6, rh=1.5, rgap=0.12;
  cfg.rows.forEach(function(r,i){ var n=r[0],act=r[1],kw=r[2]; var y=ry0+i*(rh+rgap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:y,w:12.13,h:rh,fill:{color:P.cardAlt},line:{color:P.border,width:1},rectRadius:0.07,shadow:shadowSoft()});
    s.addShape(pres.shapes.OVAL,{x:0.82,y:y+rh/2-0.27,w:0.54,h:0.54,fill:{color:A},line:{type:"none"}});
    s.addText(n,{x:0.82,y:y+rh/2-0.27,w:0.54,h:0.54,fontFace:F,fontSize:18,bold:true,color:"FFFFFF",align:"center",valign:"middle",margin:0});
    s.addText(act,{x:1.5,y:y+0.16,w:6.8,h:0.34,fontFace:F,fontSize:14,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:1.5,y:y+0.56,w:6.88,h:0.78,fill:{color:"FFFFFF"},line:{color:A,width:0.75},rectRadius:0.05});
    s.addText('"'+kw+'"',{x:1.62,y:y+0.58,w:6.64,h:0.74,fontFace:F,fontSize:10.5,color:P.ink2,align:"left",valign:"middle",lineSpacingMultiple:1.02,margin:0});
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:8.55,y:y+0.18,w:3.98,h:1.14,fill:{color:P.bg},line:{color:A,width:1.5,dashType:"dash"},rectRadius:0.05});
    s.addText("แคปหน้าจอขั้นนี้ → วางที่นี่",{x:8.6,y:y+0.18,w:3.88,h:1.14,fontFace:F,fontSize:11,bold:true,color:P.muted,align:"center",valign:"middle",margin:0}); });
  if(part===1){ footnote(s,"tip","เคล็ดลับ: อัปโหลดไฟล์แค่ครั้งเดียว แล้ว \"ถามต่อ\" ในแชตเดิม AI จะจำบริบทให้ — ไม่ต้องเริ่มใหม่ทุกขั้น"); }
  else { footnote(s,"warn","ตัวเลขภาษี/กฎปลายทาง ตรวจกับแหล่งทางการก่อนใช้จริง · เอกสารที่ได้เป็นร่าง ต้องคนตรวจและลงนาม"); }
}

function pipelineSlide(){
  const s=pres.addSlide(); bg(s);
  s.addText("ต่อยอด: Pipeline ส่งออกอัตโนมัติ (Claude Code + MCP)",{x:0.6,y:0.42,w:12.13,h:0.5,fontFace:F,fontSize:22,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  s.addText("ไม่ต้องพิมพ์เอง — วางไฟล์ลงโฟลเดอร์ → เลขา AI สั่งทีมทำครบ 6 ขั้น → ได้ผลลัพธ์ (ต่อจาก Bonus 1)",{x:0.6,y:0.92,w:12.13,h:0.4,fontFace:F,fontSize:13,color:P.muted,align:"left",valign:"middle",margin:0});
  var boxes=[
    {t:"วางไฟล์",d:"./inputs\n.xlsx · .pdf",c:P.d5,bgc:P.d5t},
    {t:"เลขา AI",d:"/run-export\n(orchestrator)",c:P.cap,bgc:P.capt},
    {t:"ทีมผู้ช่วย 5 ด้าน",d:"subagents\n(Task tool)",c:P.d4,bgc:P.d4t},
    {t:"ผลลัพธ์",d:"./outputs\n1-market … 7-summary",c:P.green,bgc:P.greenT},
  ];
  var bw=2.7,gap=0.42,y=2.0,h=1.9,x0=0.6;
  boxes.forEach(function(b,i){ var x=x0+i*(bw+gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:x,y:y,w:bw,h:h,fill:{color:b.bgc},line:{color:b.c,width:1.5},rectRadius:0.09,shadow:shadowSoft()});
    s.addText(b.t,{x:x,y:y+0.32,w:bw,h:0.5,fontFace:F,fontSize:15.5,bold:true,color:b.c,align:"center",valign:"middle",margin:0});
    s.addText(b.d,{x:x+0.15,y:y+0.92,w:bw-0.3,h:0.8,fontFace:F,fontSize:11.5,color:P.ink2,align:"center",valign:"top",lineSpacingMultiple:1.1,margin:0});
    if(i<3) s.addText("→",{x:x+bw,y:y,w:gap,h:h,fontFace:F,fontSize:26,bold:true,color:P.muted,align:"center",valign:"middle",margin:0});
  });
  s.addText("วิธีสั่งให้ทำงาน (trigger)",{x:0.6,y:4.32,w:12.13,h:0.34,fontFace:F,fontSize:14,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  var ways=[["เปิดแชต","claude → /run-export\n(เห็น subagents เป็นตัวละคร Pixel Agents)"],["Headless","./run-pipeline.sh\n(วางไฟล์แล้วรันคำสั่งเดียว)"],["อัตโนมัติเต็มตัว","cron ตั้งเวลา / เฝ้าโฟลเดอร์\n(inotify · ส่งผลออกอีเมลผ่าน MCP)"]];
  var cw=3.93,cg=0.17,cy=4.72,ch=1.36;
  ways.forEach(function(w,i){ var x=0.6+i*(cw+cg);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:x,y:cy,w:cw,h:ch,fill:{color:P.card},line:{color:P.border,width:1},rectRadius:0.08,shadow:shadowSoft()});
    s.addText(w[0],{x:x+0.22,y:cy+0.16,w:cw-0.4,h:0.34,fontFace:F,fontSize:13.5,bold:true,color:P.cap,align:"left",valign:"middle",margin:0});
    s.addText(w[1],{x:x+0.22,y:cy+0.52,w:cw-0.4,h:0.74,fontFace:F,fontSize:11,color:P.ink2,align:"left",valign:"top",lineSpacingMultiple:1.08,margin:0}); });
  footnote(s,"tip","ไฟล์โปรเจกต์แนบมาให้ (export-secretary.zip) — subagents + CLAUDE.md + .mcp.json พร้อมรัน · เอกสารที่ได้เป็นร่าง ตรวจก่อนใช้");
}

function loopConceptSlide(){
  var s=pres.addSlide(); bg(s); var A=P.cap;
  s.addText("Loop Engineering — ออกแบบลูปให้ AI ทำงานเอง (เหนือกว่า Prompt)",{x:0.6,y:0.42,w:12.13,h:0.5,fontFace:F,fontSize:21,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  s.addText("เทรนด์ปี 2026 (เรียบเรียงโดย Addy Osmani / Lance Eliot · อ้างแนวคิดหัวหน้าทีม Claude Code) — เลิกพิมพ์สั่งทีละคำ",{x:0.6,y:0.92,w:12.13,h:0.4,fontFace:F,fontSize:12.5,color:P.muted,align:"left",valign:"middle",margin:0});
  var cy=1.55,ch=2.42;
  // left: prompt engineering
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:cy,w:5.95,h:ch,fill:{color:P.cardAlt},line:{color:P.border,width:1.25},rectRadius:0.09,shadow:shadowSoft()});
  s.addText("Prompt Engineering (เดิม)",{x:0.85,y:cy+0.2,w:5.45,h:0.36,fontFace:F,fontSize:15,bold:true,color:P.muted,align:"left",valign:"middle",margin:0});
  ["ถาม-ตอบทีละครั้ง คนสั่งทุกสเต็ป","จบในครั้งเดียว (one-and-done)","พิมพ์พลาดนิดหน่อยไม่บานปลาย"].forEach(function(t,i){ var y=cy+0.66+i*0.5;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:1.0,y:y+0.06,w:0.14,h:0.14,fill:{color:P.muted},line:{type:"none"},rectRadius:0.02});
    s.addText(t,{x:1.3,y:y-0.08,w:5.1,h:0.42,fontFace:F,fontSize:12.5,color:P.ink2,align:"left",valign:"middle",margin:0}); });
  // right: loop engineering
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:6.78,y:cy,w:5.95,h:ch,fill:{color:P.capt},line:{color:A,width:1.5},rectRadius:0.09,shadow:shadowSoft()});
  s.addText("Loop Engineering (ใหม่)",{x:7.03,y:cy+0.2,w:5.45,h:0.36,fontFace:F,fontSize:15,bold:true,color:A,align:"left",valign:"middle",margin:0});
  ["ออกแบบ \u201cลูปชั้นนอก\u201d ให้ AI วนทำเองจนถึงเป้า","คนถอยมาอยู่นอกลูป (fire-and-forget)","เหมาะงานต่อเนื่อง/เฝ้าติดตาม · ทรงพลังแต่ต้องคุมดี"].forEach(function(t,i){ var y=cy+0.66+i*0.5;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:7.18,y:y+0.06,w:0.14,h:0.14,fill:{color:A},line:{type:"none"},rectRadius:0.02});
    s.addText(t,{x:7.48,y:y-0.08,w:5.1,h:0.42,fontFace:F,fontSize:12.5,color:P.ink,align:"left",valign:"middle",margin:0}); });
  // 2-layer note
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:4.22,w:12.13,h:1.35,fill:{color:P.d3t},line:{color:P.d3,width:1.25},rectRadius:0.09});
  s.addText([{text:"ลูปมี 2 ชั้น:  ",options:{bold:true,color:P.d3}},{text:"ลูปใน",options:{bold:true,color:P.ink}},{text:" (เอเจนต์วนเอง: รับรู้ → คิด → ลงมือ → สังเกตผล)    +    ",options:{color:P.ink2}},{text:"ลูปนอก",options:{bold:true,color:P.ink}},{text:" (เราออกแบบ: ตั้งเวลา · ป้อนงานเอง · เรียกผู้ช่วย · ข้ามหลายรอบโดยคนไม่ต้องเฝ้า)",options:{color:P.ink2}}],{x:0.85,y:4.34,w:11.63,h:1.1,fontFace:F,fontSize:13.5,align:"left",valign:"middle",lineSpacingMultiple:1.2,margin:0});
  footnote(s,"tip","ในเด็คนี้: Pipeline + cron/เฝ้าโฟลเดอร์ = ลูปชั้นนอกที่ครอบ \u2018เลขา AI\u2019 ให้ทำงานเองต่อเนื่อง");
}
function loopPrinciplesSlide(){
  var s=pres.addSlide(); bg(s); var A=P.cap;
  s.addText("ออกแบบลูปให้ไม่หลุดวงโคจร — 5 หลักการ + กันบิลบานปลาย",{x:0.6,y:0.42,w:12.13,h:0.5,fontFace:F,fontSize:21,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  var items=["ตั้งเป้าหมายลูปให้ชัด + เช็กว่า AI เข้าใจตรงกับเรา","มีกลไกประเมิน — ให้ AI รู้ว่าเมื่อไรควรวนต่อ เมื่อไรควรหยุด","มีจุดให้คนแทรกได้ (human-in-the-loop) — รายงานสถานะ + สั่งหยุดทัน","กำหนดเงื่อนไขหยุดชัด — ถึงเป้า หรือเกินเวลา/งบที่ตั้งไว้","ทดสอบลูปสั้นๆ 2–3 รอบก่อนปล่อยจริงเสมอ"];
  var lx=0.6,lw=7.55,y0=1.5;
  items.forEach(function(t,i){ var y=y0+i*0.9;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:lx,y:y,w:lw,h:0.78,fill:{color:P.card},line:{color:P.border,width:1},rectRadius:0.08,shadow:shadowSoft()});
    s.addShape(pres.shapes.OVAL,{x:lx+0.18,y:y+0.17,w:0.44,h:0.44,fill:{color:A},line:{type:"none"}});
    s.addText(String(i+1),{x:lx+0.18,y:y+0.17,w:0.44,h:0.44,fontFace:F,fontSize:16,bold:true,color:P.gold,align:"center",valign:"middle",margin:0});
    s.addText(t,{x:lx+0.78,y:y,w:lw-0.95,h:0.78,fontFace:F,fontSize:12.5,color:P.ink,align:"left",valign:"middle",lineSpacingMultiple:1.04,margin:0}); });
  // cost warning card
  var rx=8.35,rw=4.38,ry=1.5,rh=4.05;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:rx,y:ry,w:rw,h:rh,fill:{color:P.amberT},line:{color:P.amber,width:1.5},rectRadius:0.09,shadow:shadowSoft()});
  s.addImage({data:IC.warn,x:rx+0.25,y:ry+0.24,w:0.3,h:0.3});
  s.addText("กันบิลบานปลาย (ด้านมืดของลูป)",{x:rx+0.62,y:ry+0.2,w:rw-0.8,h:0.4,fontFace:F,fontSize:13.5,bold:true,color:P.amber,align:"left",valign:"middle",margin:0});
  ["เอเจนต์กินโทเคน 10–100× ของแชตทั่วไป","ลูป 5 สเต็ป ≈ 3.2× · 200 สเต็ป ทะลุ 100×","ตั้งเพดานงบ/เวลาเสมอ — กันลูปวิ่งไม่รู้จบ","ปี 2026 มีเคสองค์กรบิล AI พุ่งหนักเพราะลูปหลุดคุม"].forEach(function(t,i){ var y=ry+0.78+i*0.78;
    s.addText("•",{x:rx+0.28,y:y,w:0.25,h:0.4,fontFace:F,fontSize:14,bold:true,color:P.amber,align:"left",valign:"top",margin:0});
    s.addText(t,{x:rx+0.55,y:y,w:rw-0.78,h:0.74,fontFace:F,fontSize:11.5,color:P.ink2,align:"left",valign:"top",lineSpacingMultiple:1.06,margin:0}); });
  footnote(s,"warn","ลูปทรงพลังแต่อันตราย — \u201cคิดแบบกระบวนการ ไม่ใช่แค่พรอมต์\u201d · ทดสอบและตั้งเพดานก่อนปล่อยจริงเสมอ");
}

function orgAISlide(){
  var s=pres.addSlide(); bg(s);
  s.addText("ก้าวต่อไป — AI ส่วนตัวขององค์กรคุณ",{x:0.6,y:0.42,w:12.13,h:0.5,fontFace:F,fontSize:23,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  s.addText("จาก \u201cใช้ AI สาธารณะ\u201d → เป็นเจ้าของ AI ที่รู้จักธุรกิจคุณ และข้อมูลอยู่ภายใต้การควบคุมของคุณ",{x:0.6,y:0.92,w:12.13,h:0.4,fontFace:F,fontSize:13,color:P.muted,align:"left",valign:"middle",margin:0});
  var cards=[
    {lab:"ความเป็นส่วนตัว",c:P.d5,bgc:P.d5t,t:"ข้อมูลไม่รั่ว",d:"ราคา ลูกค้า เอกสาร อยู่ในบริษัท ไม่หลุดออกแพลตฟอร์มสาธารณะ"},
    {lab:"รู้จักงานคุณ",c:P.d1,bgc:P.d1t,t:"AI รู้จักธุรกิจคุณ",d:"เชื่อมเอกสาร/ข้อมูลจริง (ส่งออก ราคา SOP) ตอบตรงงานของคุณ"},
    {lab:"ทั้งทีม",c:P.d4,bgc:P.d4t,t:"พนักงานใช้ได้ปลอดภัย",d:"ทุกคนมีผู้ช่วย AI มาตรฐานเดียวกัน คุมสิทธิ์การเข้าถึงได้"},
    {lab:"เป็นเจ้าของ",c:P.d3,bgc:P.d3t,t:"รันบนระบบคุณเอง",d:"private cloud / on-premise — ควบคุมเต็มที่ ไม่ผูกขาดใคร"},
  ];
  var cw=2.9,gap=0.18,y=1.5,h=2.55,x0=0.6;
  cards.forEach(function(b,i){ var x=x0+i*(cw+gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:x,y:y,w:cw,h:h,fill:{color:P.card},line:{color:b.c,width:1.4},rectRadius:0.09,shadow:shadowSoft()});
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:x,y:y,w:cw,h:0.12,fill:{color:b.c},line:{type:"none"},rectRadius:0.03});
    s.addText(b.lab,{x:x+0.22,y:y+0.26,w:cw-0.4,h:0.3,fontFace:F,fontSize:11,bold:true,color:b.c,charSpacing:1,align:"left",valign:"middle",margin:0});
    s.addText(b.t,{x:x+0.22,y:y+0.6,w:cw-0.4,h:0.5,fontFace:F,fontSize:15.5,bold:true,color:P.ink,align:"left",valign:"middle",lineSpacingMultiple:1.0,margin:0});
    s.addText(b.d,{x:x+0.22,y:y+1.18,w:cw-0.42,h:1.25,fontFace:F,fontSize:11.5,color:P.ink2,align:"left",valign:"top",lineSpacingMultiple:1.12,margin:0}); });
  // before -> after
  var by=4.32,bh=1.5;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y:by,w:5.78,h:bh,fill:{color:P.cardAlt},line:{color:P.border,width:1},rectRadius:0.09});
  s.addText("วันนี้",{x:0.85,y:by+0.16,w:5.3,h:0.3,fontFace:F,fontSize:12.5,bold:true,color:P.muted,align:"left",valign:"middle",charSpacing:1,margin:0});
  s.addText("พิมพ์ใส่ AI สาธารณะ · ข้อมูลออกนอกบริษัท · อธิบายบริบทใหม่ทุกครั้ง",{x:0.85,y:by+0.5,w:5.3,h:0.9,fontFace:F,fontSize:12,color:P.ink2,align:"left",valign:"top",lineSpacingMultiple:1.15,margin:0});
  s.addText("→",{x:6.4,y:by,w:0.55,h:bh,fontFace:F,fontSize:26,bold:true,color:P.cap,align:"center",valign:"middle",margin:0});
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:6.95,y:by,w:5.78,h:bh,fill:{color:P.capt},line:{color:P.cap,width:1.5},rectRadius:0.09,shadow:shadowSoft()});
  s.addText("เป้าหมาย",{x:7.2,y:by+0.16,w:5.3,h:0.3,fontFace:F,fontSize:12.5,bold:true,color:P.cap,align:"left",valign:"middle",charSpacing:1,margin:0});
  s.addText("AI ส่วนตัวที่รู้จักทั้งบริษัท · ข้อมูลอยู่กับคุณ · ทั้งทีมใช้ได้ทันที",{x:7.2,y:by+0.5,w:5.3,h:0.9,fontFace:F,fontSize:12,color:P.ink,align:"left",valign:"top",lineSpacingMultiple:1.15,margin:0});
  footnote(s,"bulb","เริ่มจาก How To วันนี้ → ต่อยอดเป็น \u2018เลขา AI\u2019 ของบริษัท → สู่ AI ส่วนตัวขององค์กรที่สร้างได้จริง");
}

function buildArchSlide(){
  var s=pres.addSlide(); bg(s);
  s.addText("สร้างได้ยังไง — สถาปัตยกรรม AI ส่วนตัวขององค์กร",{x:0.6,y:0.42,w:12.13,h:0.5,fontFace:F,fontSize:22,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  s.addText("ชิ้นส่วนหลัก 5 อย่าง บนฐานระบบของคุณเอง · เริ่มเล็กที่ 1 งาน แล้วค่อยขยาย",{x:0.6,y:0.92,w:12.13,h:0.4,fontFace:F,fontSize:13,color:P.muted,align:"left",valign:"middle",margin:0});
  var layers=[
    {n:"1",c:P.d5,bgc:P.d5t,t:"ผู้ใช้: พนักงานทั้งบริษัท",d:"ทุกแผนกเข้าถึงผู้ช่วย AI ตัวเดียวกัน คุมสิทธิ์ได้"},
    {n:"2",c:P.d1,bgc:P.d1t,t:"หน้าใช้งาน (แชต/ผู้ช่วย)",d:"ใช้บนเว็บ/มือถือ — ถาม สั่งงาน อัปโหลดเอกสาร"},
    {n:"3",c:P.d4,bgc:P.d4t,t:"สมอง: เลขา AI + ทีมผู้ช่วย",d:"Agents / MCP เชื่อมเครื่องมือ + ระบบงานจริง (อีเมล ERP ไฟล์)"},
    {n:"4",c:P.d3,bgc:P.d3t,t:"โมเดล LLM ส่วนตัว",d:"open-source (Llama/Qwen) รันเอง หรือ private API — ไม่ผูกขาดใคร"},
    {n:"5",c:P.green,bgc:P.greenT,t:"ข้อมูลบริษัท (RAG)",d:"เอกสาร/ฐานข้อมูลของคุณ ทำให้ AI รู้จักงานคุณจริง"},
  ];
  var x=0.6,w=12.13,y0=1.5,bh=0.64,gap=0.12;
  layers.forEach(function(L,i){ var y=y0+i*(bh+gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:x,y:y,w:w,h:bh,fill:{color:L.bgc},line:{color:L.c,width:1.25},rectRadius:0.07,shadow:shadowSoft()});
    s.addShape(pres.shapes.OVAL,{x:x+0.18,y:y+0.12,w:0.4,h:0.4,fill:{color:L.c},line:{type:"none"}});
    s.addText(L.n,{x:x+0.18,y:y+0.12,w:0.4,h:0.4,fontFace:F,fontSize:15,bold:true,color:"FFFFFF",align:"center",valign:"middle",margin:0});
    s.addText(L.t,{x:x+0.74,y:y,w:4.4,h:bh,fontFace:F,fontSize:13.5,bold:true,color:L.c,align:"left",valign:"middle",margin:0});
    s.addText(L.d,{x:x+5.2,y:y,w:w-5.4,h:bh,fontFace:F,fontSize:12,color:P.ink2,align:"left",valign:"middle",margin:0}); });
  var fy=y0+5*(bh+gap);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:x,y:fy,w:w,h:bh,fill:{color:P.cap},line:{type:"none"},rectRadius:0.07,shadow:shadowSoft()});
  s.addImage({data:IC.icRocket,x:x+0.22,y:fy+0.14,w:0.36,h:0.36});
  s.addText([{text:"ฐานระบบ: On-premise / Private Cloud  ",options:{bold:true,color:"FFFFFF"}},{text:"— รันบนเซิร์ฟเวอร์/คลาวด์ของคุณ ข้อมูลไม่ออกนอกองค์กร",options:{color:"E7DFCF"}}],{x:x+0.72,y:fy,w:w-0.9,h:bh,fontFace:F,fontSize:12.5,align:"left",valign:"middle",margin:0});
  footnote(s,"bulb","เริ่มเล็ก: เลือก 1 use case (เช่น ผู้ช่วยเอกสารส่งออก) → วัดผล → ขยายทีละงาน · ต่อยอดจากโปรเจกต์ export-secretary ได้เลย");
}
async function ctaSlide(){
  var s=pres.addSlide(); bg(s,P.cap);
  s.addText("อยากมี \u2018เลขา AI\u2019 ส่วนตัวขององค์กรคุณ?",{x:0.6,y:1.2,w:12.13,h:0.9,fontFace:F,fontSize:34,bold:true,color:"FFFFFF",align:"center",valign:"middle",margin:0});
  s.addText("เริ่มจากจุดเดียว แล้วขยายทั้งบริษัท — ออกแบบ · สร้าง · ติดตั้ง on-premise · เทรนทีม",{x:0.6,y:2.2,w:12.13,h:0.5,fontFace:F,fontSize:15,color:P.gold,align:"center",valign:"middle",margin:0});
  var cx=2.4,cw=8.53,cy=3.05,ch=2.7;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:cx,y:cy,w:cw,h:ch,fill:{color:P.capt},line:{color:P.gold,width:1.5},rectRadius:0.1,shadow:shadowSoft()});
  s.addText("ติดต่อ / ปรึกษา",{x:cx+0.4,y:cy+0.25,w:cw-2.4,h:0.34,fontFace:F,fontSize:13,bold:true,color:P.cap2,charSpacing:1,align:"left",valign:"middle",margin:0});
  s.addText("[ชื่อผู้บรรยาย — เช่น คุณคิม (ทศพล)]",{x:cx+0.4,y:cy+0.6,w:cw-2.4,h:0.4,fontFace:F,fontSize:18,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  s.addText("ที่ปรึกษาและผู้สร้างระบบ AI สำหรับองค์กร (on-premise / agentic / MLOps)",{x:cx+0.4,y:cy+1.02,w:cw-2.4,h:0.34,fontFace:F,fontSize:12,italic:true,color:P.ink2,align:"left",valign:"middle",margin:0});
  var rows=[["LINE","[ใส่ LINE ID]"],["อีเมล","[ใส่อีเมล]"],["โทร / เว็บ","[ใส่เบอร์ / เว็บไซต์]"]];
  rows.forEach(function(r,i){ var y=cy+1.45+i*0.38;
    s.addText(r[0],{x:cx+0.4,y:y,w:1.5,h:0.32,fontFace:F,fontSize:12,bold:true,color:P.cap2,align:"left",valign:"middle",margin:0});
    s.addText(r[1],{x:cx+1.9,y:y,w:cw-4.4,h:0.32,fontFace:F,fontSize:12.5,color:P.ink,align:"left",valign:"middle",margin:0}); });
  var qr=await qrRaw("https://your-contact-link.example.com");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:cx+cw-1.9,y:cy+0.55,w:1.55,h:1.55,fill:{color:"FFFFFF"},line:{type:"none"},rectRadius:0.05});
  s.addImage({data:qr,x:cx+cw-1.82,y:cy+0.63,w:1.4,h:1.4});
  s.addText("สแกนเพื่อติดต่อ (ใส่ลิงก์จริง)",{x:cx+cw-2.4,y:cy+2.12,w:2.5,h:0.26,fontFace:F,fontSize:9,italic:true,color:P.cap2,align:"center",valign:"middle",margin:0});
  s.addText("* เปลี่ยนชื่อ/ช่องทาง/QR เป็นของจริงก่อนใช้งาน",{x:0.6,y:6.5,w:12.13,h:0.4,fontFace:F,fontSize:11,italic:true,color:"B8AE99",align:"center",valign:"middle",margin:0});
}


const DEMO_AI = {
  1:`วิเคราะห์ Top 5 ตลาด จากข้อมูลส่งออก 72 shipments\n\n1  จีน — ดีมานด์สูงสุด $620K, โต 3%/เดือน\n   RCEP Form E ภาษี 0% ผู้ซื้อหลายราย\n\n2  ญี่ปุ่น — มั่นคง $605K, มาตรฐานสูง\n   ชิ้นส่วนยานยนต์ + อาหารพรีเมียม\n\n3  สหรัฐฯ — $483K แต่ tariff ~19% กระทบมาก\n   พิจารณา redirect สินค้ายาง → ตลาดอื่น\n\n4  เวียดนาม — $292K โตต่อเนื่อง Hub ASEAN\n   ขนส่งถูก เชื่อมต่อ EU ได้ดี\n\n5  อินเดีย — $207K แต่โตเร็วสุด 5%/เดือน\n   ดาวรุ่ง ตลาด 1.4B คน คู่แข่งน้อย\n\n→  แนะนำ: เน้น จีน+ญี่ปุ่น ระยะสั้น\n   โตระยะยาว: อินเดีย+เวียดนาม`,
  2:`ข้าวหอมมะลิ HS 1006.30 → สหรัฐ (มิ.ย. 2026)\n\nHS Code: 1006.30.90 (Long-grain rice, husked)\n\nภาษีนำเข้าสหรัฐ:\n  Reciprocal tariff    ~19%  (ไทย Tier 2)\n  MFN base rate       0.52¢/kg\n  Section 232         ไม่เกี่ยว (เหล็ก/อะลู)\n\nLanded cost (FOB $1.20/kg):\n  + ภาษี ~19%     +$0.23/kg\n  + ขนส่ง LA      +$0.08/kg\n  รวม              ≈ $1.51/kg  (+26%)\n\n→  ตลาดทางเลือก: EU $0.04 CBAM, จีน RCEP 0%\nแหล่ง: USTR.gov / CBP HTS 1006.30.90`,
  3:`Packing List — สร้างสอดคล้อง Invoice 100%\n\nShipper:   Siam Rice Co., Ltd., Bangkok\nConsignee: EuroFood GmbH, Hamburg\nRef:       PL-2026-014  (อ้างอิง INV-2026-014)\n\nสินค้า:    Thai Hom Mali Rice 100%\nHS Code:  1006.30\nจำนวน:    1,200 ถุง × 25 kg/ถุง\nNet Wt:   30,000 kg\nGross Wt: 30,600 kg\nPackages: 24 pallets (50 ถุง/pallet)\nMarks:    EFG / HAMBURG / 2026 / 1-1200\n\n✅ ตรงกับ Invoice ทุกฟิลด์ — พร้อมยื่น L/C\n   สร้างอัตโนมัติ ลดความผิดพลาดจากคีย์มือ`,
  4:`ข้อมูลสกัดจาก Invoice INV-TX-2026-051\n\nผู้ส่ง:     Siam Garment Co., 123 Sukhumvit, BKK\nผู้รับ:     Fashion Import GmbH, Hamburg\nสินค้า:    Cotton T-Shirt\nHS Code:  6109.10  (สิ่งทอฝ้าย)\nจำนวน:    5,000 ชิ้น (200 g/ชิ้น)\nNet Wt:   1,000 kg\nGross Wt: 1,150 kg\nมูลค่า:    USD 12,500  ($2.50/ชิ้น)\nIncoterms: FOB Bangkok\nชำระเงิน: L/C at sight\n\n✅ อ่านครบ — พร้อมกรอกใบขนสินค้า / ERP\n   ไม่ต้องคีย์มือ ลด error 100%`,
  5:`Discrepancy Report — ชุดข้าวหอมมะลิ INV-2026-014\n\n❌  พบ 3 จุดที่ไม่สอดคล้อง:\n\n1  จำนวนถุงไม่ตรง  [HIGH RISK ‼]\n   Invoice: 1,200 ถุง  ≠  Packing List: 1,180\n   UCP 600 Art.18c: L/C ถูก reject ทันที\n   → แก้ Packing List → 1,200 ถุง\n\n2  Incoterms ขัดแย้ง  [HIGH RISK ‼]\n   Invoice: FOB Bangkok  ≠  Contract: CIF Hamburg\n   → ต้องตกลงใหม่ ค่าขนส่ง+ประกันเป็นของใคร\n\n3  Contract ขาดข้อมูล  [MEDIUM]\n   ไม่มี HS Code + ไม่มี Country of Origin\n   → ต้องเพิ่มก่อนยื่น EU customs / CBAM\n\n→  แก้ 3 จุด แล้วตรวจรอบสุดท้ายก่อนยื่น`,
};


function agendaSlide(){
  var s=pres.addSlide(); bg(s);
  s.addText("วันนี้เราทำอะไรกันบ้าง",{x:0.6,y:0.36,w:12.13,h:0.5,fontFace:F,fontSize:26,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  s.addText("5 วิธีทำ + 2 โบนัส · ทำตามได้เลยบนมือถือ",{x:0.6,y:0.88,w:12.13,h:0.36,fontFace:F,fontSize:13.5,color:P.muted,align:"left",valign:"middle",margin:0});
  var items=[
    {n:"01",c:P.d5,t:"หาตลาด + ผู้ซื้อ",d:"AI วิเคราะห์ข้อมูลส่งออก Top 5 ตลาด"},
    {n:"02",c:P.d1,t:"ภาษี + Landed Cost",d:"HS Code · Trump tariff · เปรียบ 3 ตลาด"},
    {n:"03",c:P.d4,t:"สร้างเอกสาร",d:"Invoice → Packing List อัตโนมัติ"},
    {n:"04",c:P.d2,t:"อ่านเอกสาร",d:"สกัดข้อมูล ตรวจ L/C · Compliance"},
    {n:"05",c:P.d3,t:"ตรวจความสอดคล้อง",d:"จับ discrepancy ข้ามเอกสาร 3 ชุด"},
    {n:"★1",c:P.cap,t:"เลขา AI (Pixel Agents)",d:"มัลติเอเจนต์ทำครบ 6 ขั้นคำสั่งเดียว"},
    {n:"★2",c:P.cap2,t:"ทำครบ 1 รอบ",d:"หาตลาด→ภาษี→เอกสาร→ตรวจ ในแชตเดียว"},
  ];
  var cols=4, cw=3.12, ch=1.36, gap=0.12, x0=0.6, y0=1.38;
  items.forEach(function(it,i){
    var col=i%cols, row=Math.floor(i/cols), x=x0+col*(cw+gap), y=y0+row*(ch+gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:x,y:y,w:cw,h:ch,fill:{color:P.card},line:{color:it.c,width:1.4},rectRadius:0.08,shadow:shadowSoft()});
    s.addShape(pres.shapes.RECTANGLE,{x:x,y:y,w:0.08,h:ch,fill:{color:it.c},line:{type:"none"},rectRadius:0});
    s.addText(it.n,{x:x+0.18,y:y,w:0.58,h:ch,fontFace:F,fontSize:14,bold:true,color:it.c,align:"left",valign:"middle",margin:0});
    s.addText(it.t,{x:x+0.82,y:y+0.2,w:cw-1.0,h:0.42,fontFace:F,fontSize:13,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
    s.addText(it.d,{x:x+0.82,y:y+0.62,w:cw-1.0,h:0.58,fontFace:F,fontSize:10.5,color:P.ink2,align:"left",valign:"top",lineSpacingMultiple:1.06,margin:0});
  });
  footnote(s,"tip","ไฟล์ตัวอย่างและ QR แนบในแต่ละสไลด์ · ใช้มือถือสแกนทำตามได้ทันที");
}


function excelPreviewSlide(){
  var s=pres.addSlide(); bg(s); var A=P.d5;
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:W,h:1.08,fill:{color:A},line:{type:"none"}});
  s.addText("HOW TO 1 · ไฟล์ตัวอย่าง",{x:0.6,y:0.1,w:10,h:0.3,fontFace:F,fontSize:12,bold:true,color:"FFFFFF",charSpacing:2,align:"left",valign:"middle",margin:0});
  s.addText("ไฟล์ข้อมูลส่งออก — เปิดดูก่อนเริ่ม HOW TO 1",{x:0.6,y:0.42,w:12.13,h:0.44,fontFace:F,fontSize:22,bold:true,color:"FFFFFF",align:"left",valign:"middle",margin:0});
  s.addText("นี่คือไฟล์ที่เราจะแนบให้ AI วิเคราะห์ · ดาวน์โหลดได้ที่ QR ภาคผนวก",{x:0.6,y:0.84,w:12.13,h:0.24,fontFace:F,fontSize:11.5,italic:true,color:"E0D4C0",align:"left",valign:"middle",margin:0});
  var rows=[
    ["เดือน","สินค้า","HS Code","ประเทศ","จำนวน (กก.)","มูลค่า (USD)","Incoterms"],
    ["2025-01","ชิ้นส่วนยานยนต์","8708.99","ญี่ปุ่น","11,000","$74,616","FOB Bangkok"],
    ["2025-01","ถุงมือยางทางการแพทย์","4015.12","สหรัฐอเมริกา","12,000","$40,036","FOB Bangkok"],
    ["2025-02","ข้าวหอมมะลิ 100%","1006.30","เกาหลีใต้","12,000","$13,767","CIF"],
    ["2025-02","สับปะรดกระป๋อง","2008.20","สหรัฐอเมริกา","34,000","$31,291","FOB Laem Chabang"],
    ["2025-03","แป้งมันสำปะหลัง","1108.14","เยอรมนี","28,000","$14,538","FOB Bangkok"],
    ["2026-04","ข้าวหอมมะลิ 100%","1006.30","อินเดีย","31,000","$37,200","FOB Bangkok"],
  ];
  var tw=8.7, tx=0.6, ty=1.22, th=5.52;
  var colW=[0.82,2.1,0.84,1.5,1.18,1.22,1.04];
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:tx,y:ty,w:tw,h:th,fill:{color:P.card},line:{color:P.border,width:1},rectRadius:0.07,shadow:shadowSoft()});
  rows.forEach(function(row,ri){
    var y=ty+0.12+ri*0.74; var isHdr=ri===0;
    if(isHdr) s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:tx+0.06,y:y-0.06,w:tw-0.12,h:0.62,fill:{color:A},line:{type:"none"},rectRadius:0.05});
    if(ri>0&&ri%2===0) s.addShape(pres.shapes.RECTANGLE,{x:tx+0.06,y:y-0.08,w:tw-0.12,h:0.7,fill:{color:P.cardAlt},line:{type:"none"}});
    var cx=tx+0.14;
    row.forEach(function(cell,ci){
      s.addText(cell,{x:cx,y:y,w:colW[ci],h:0.5,fontFace:F,fontSize:isHdr?10.5:11,bold:isHdr,color:isHdr?"FFFFFF":P.ink,align:ci>=4?"right":"left",valign:"middle",margin:0});
      cx+=colW[ci];
    });
  });
  s.addText("... 72 shipments ทั้งหมด (ม.ค. 2025 – พ.ค. 2026)",{x:tx+0.2,y:ty+th-0.32,w:tw-0.4,h:0.26,fontFace:F,fontSize:10,italic:true,color:P.muted,align:"left",valign:"middle",margin:0});
  var stats=[["72","shipments"],["5","ประเภทสินค้า"],["10","ตลาด"],["$3.4M","มูลค่ารวม"]];
  var sx=9.55, sw=3.42, sy=1.22, sh=5.52;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:sx,y:sy,w:sw,h:sh,fill:{color:P.d5t},line:{color:A,width:1.25},rectRadius:0.07,shadow:shadowSoft()});
  s.addText("สรุปไฟล์",{x:sx+0.2,y:sy+0.2,w:sw-0.4,h:0.34,fontFace:F,fontSize:14,bold:true,color:A,align:"center",valign:"middle",margin:0});
  stats.forEach(function(st,i){
    var y=sy+0.68+i*1.08;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:sx+0.22,y:y,w:sw-0.44,h:0.9,fill:{color:"FFFFFF"},line:{color:A,width:0.75},rectRadius:0.06});
    s.addText(st[0],{x:sx+0.22,y:y+0.04,w:sw-0.44,h:0.5,fontFace:F,fontSize:24,bold:true,color:A,align:"center",valign:"middle",margin:0});
    s.addText(st[1],{x:sx+0.22,y:y+0.5,w:sw-0.44,h:0.34,fontFace:F,fontSize:11,color:P.ink2,align:"center",valign:"middle",margin:0});
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:sx+0.22,y:sy+5.04,w:sw-0.44,h:0.42,fill:{color:P.greenT},line:{color:P.greenBd,width:1},rectRadius:0.06});
  s.addText("ใช้ไฟล์นี้ใน DEMO 1 →",{x:sx+0.22,y:sy+5.04,w:sw-0.44,h:0.42,fontFace:F,fontSize:11,bold:true,color:P.green,align:"center",valign:"middle",margin:0});
}

async function fileDownloadSlide(){
  var s=pres.addSlide(); bg(s); var A=P.d5;
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:W,h:1.08,fill:{color:A},line:{type:"none"}});
  s.addText("ไฟล์ตัวอย่าง — ดาวน์โหลดก่อนเริ่ม",{x:0.6,y:0.06,w:10,h:0.46,fontFace:F,fontSize:22,bold:true,color:"FFFFFF",align:"left",valign:"middle",margin:0});
  s.addText("สแกน QR แต่ละอัน → ดาวน์โหลดไฟล์ → แนบให้ AI ตอน HOW TO ที่ระบุ",{x:0.6,y:0.58,w:12.13,h:0.3,fontFace:F,fontSize:12.5,italic:true,color:"E0D4C0",align:"left",valign:"middle",margin:0});
  var files=[
    {icon:"📊",name:"Sample_Thai_Export_Data.xlsx",lbl:"HOW TO 1",c:P.d5,url:"https://drive.google.com/file/HOW-TO-1-export-data",note:"ข้อมูลส่งออก 72 shipments — อัปโหลดให้ AI วิเคราะห์ตลาด"},
    {icon:"📄",name:"1_Commercial_Invoice\nINV-2026-014.pdf",lbl:"HOW TO 3 / 5",c:P.d4,url:"https://drive.google.com/file/HOW-TO-3-invoice",note:"Invoice ข้าวหอมมะลิ → ให้ AI สร้าง Packing List"},
    {icon:"📦",name:"2_Packing_List\nPL-2026-014.pdf",lbl:"HOW TO 5",c:P.d3,url:"https://drive.google.com/file/HOW-TO-5-packing-list",note:"Packing List (1,180 ถุง ≠ Invoice) — planted mismatch"},
    {icon:"📋",name:"3_Sales_Contract\nSC-2026-007.pdf",lbl:"HOW TO 5",c:P.d3,url:"https://drive.google.com/file/HOW-TO-5-contract",note:"Contract (CIF ≠ FOB) — planted mismatch"},
    {icon:"🧾",name:"4_Invoice_INV-TX-2026-051.pdf",lbl:"HOW TO 4",c:P.d2,url:"https://drive.google.com/file/HOW-TO-4-invoice",note:"Invoice เสื้อผ้า (สะอาด) — ให้ AI อ่านและสกัดข้อมูล"},
  ];
  var cw=2.46, gap=0.1, x0=0.6, cy=1.18, ch=5.58;
  var qrs=[];
  for(var i=0;i<files.length;i++){ qrs.push(await qrRaw(files[i].url)); }
  files.forEach(function(f,i){
    var x=x0+i*(cw+gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:x,y:cy,w:cw,h:ch,fill:{color:P.card},line:{color:f.c,width:1.4},rectRadius:0.08,shadow:shadowSoft()});
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:x,y:cy,w:cw,h:0.08,fill:{color:f.c},line:{type:"none"},rectRadius:0.04});
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:x+0.22,y:cy+0.16,w:cw-0.44,h:0.36,fill:{color:f.c},line:{type:"none"},rectRadius:0.18});
    s.addText(f.lbl,{x:x+0.22,y:cy+0.16,w:cw-0.44,h:0.36,fontFace:F,fontSize:11,bold:true,color:"FFFFFF",align:"center",valign:"middle",margin:0});
    s.addText(f.icon,{x:x,y:cy+0.62,w:cw,h:0.42,fontFace:F,fontSize:22,align:"center",valign:"middle",margin:0});
    s.addText(f.name,{x:x+0.14,y:cy+1.08,w:cw-0.28,h:0.76,fontFace:F,fontSize:10,bold:true,color:f.c,align:"center",valign:"middle",lineSpacingMultiple:1.05,margin:0});
    s.addText(f.note,{x:x+0.1,y:cy+1.88,w:cw-0.2,h:0.9,fontFace:F,fontSize:9.5,color:P.ink2,align:"center",valign:"top",lineSpacingMultiple:1.08,margin:0});
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:x+cw/2-0.72,y:cy+2.88,w:1.44,h:1.44,fill:{color:"FFFFFF"},line:{color:f.c,width:1},rectRadius:0.05});
    s.addImage({data:qrs[i],x:x+cw/2-0.64,y:cy+2.96,w:1.28,h:1.28});
    s.addText("สแกนดาวน์โหลด",{x:x+0.06,y:cy+4.38,w:cw-0.12,h:0.28,fontFace:F,fontSize:9,bold:true,color:f.c,align:"center",valign:"middle",margin:0});
    s.addText("(อัปเดต QR เมื่อมี link จริง)",{x:x+0.06,y:cy+4.66,w:cw-0.12,h:0.6,fontFace:F,fontSize:8.5,italic:true,color:P.muted,align:"center",valign:"top",lineSpacingMultiple:1.0,margin:0});
  });
}

const MARKET={num:1,accent:P.d5,tint:P.d5t,label:"HOW TO 1 · หาตลาด-ผู้ซื้อ",title:"AI หาตลาดและ\nผู้ซื้อต่างชาติ",prep:"เปิด Web Search · เตรียมชื่อสินค้าที่อยากส่งออก · ใช้คู่กับ Thaitrade.com / ImportGenius ได้",bottom:'3 ขั้นตอน · จาก "ไม่รู้จะขายใคร" สู่รายชื่อผู้ซื้อ',steps:[
  {t:"ขั้น 1 — หาตลาดที่มีโอกาสสูงสุด",p:'ฉันส่งออก [สินค้า] จากไทย ช่วยวิเคราะห์ Top 5 ตลาดส่งออกที่มีโอกาสปี 2026 — ดูจากขนาดดีมานด์, การเติบโต, กำแพงภาษี, คู่แข่ง แล้วเรียงลำดับพร้อมเหตุผล',a:['🥇อินเดีย โต5%/เดือน RCEP0% คู่แข่งน้อย  🥈จีน ดีมานด์สูง RCEP FormE  🥉เวียดนาม ASEAN0% Hub EU','🥉เยอรมนี มูลค่าสูงเน้นคุณภาพ 🏅UAE Hub ตะวันออกกลาง 5% — สหรัฐฯ ลดลำดับ tariff ~19%','แนะนำ: เน้นจีน+อินเดียระยะสั้น · กระจาย EU+ASEAN · หลีกเลี่ยงพึ่งสหรัฐฯ เพียงตลาดเดียว'],ft:"tip",fn:"ใช้ข้อมูลนี้เป็นจุดตั้งต้น แล้วเจาะลึกตลาดที่เลือกในขั้นต่อไป",r:`จากข้อมูลส่งออกของคุณ AI วิเคราะห์ Top 5 ตลาด ปี 2026:

🏆 1. อินเดีย — โอกาสสูงสุดของปีนี้
ตลาดข้าวพรีเมียม 22M ตัน/ปี เติบโต 28% ใน 3 ปี
ชนชั้นกลางใหม่ 300M คน ยินดีจ่ายราคาสูงสำหรับ GI product
RCEP Form D: ภาษี 0% (เดิม 70%) — ได้เปรียบปากีสถาน/อินโดฯ อย่างมาก
Thai Hom Mali ครอง segment premium — เวียดนามแข่งได้แค่ระดับล่าง

🥈 2. จีน — มูลค่าสูง ส่งได้เร็ว
นำเข้าข้าวต่างชาติ 3.8M ตัน/ปี เพิ่ม 12% YoY
Shanghai/Beijing: ผู้บริโภคจ่าย 5-8 เท่าราคาข้าวธรรมดา
RCEP Form E: ภาษี 0% · เวลาขนส่ง LCB→SHA เพียง 7 วัน

🥉 3. เวียดนาม — ขนส่งถูก Hub ของ ASEAN
ASEAN Free Trade: ภาษี 0% · ETD 3-4 วัน จากไทย
กระจายต่อ EU/สหรัฐฯ ในรูปแบบ re-export ได้ดี

4. เยอรมนี — มูลค่าต่อหน่วยสูงที่สุด
Organic cert เพิ่ม premium +30-40% ทันที
EU organic market เติบโต 12%/ปี — ไทยมีข้อได้เปรียบ

5. UAE — Hub ตะวันออกกลาง 22 ประเทศ
ภาษีนำเข้า 5% · ไม่มีโควตา · Halal cert เพิ่มโอกาส

⚠️ สหรัฐฯ: Reciprocal tariff ~19% กระทบหนัก
→ แนะ: กระจาย 3 ตลาด ลดความเสี่ยงจากนโยบายเดียว`},
  {t:"ขั้น 2 — หาผู้ซื้อ/ผู้นำเข้าตัวจริง",p:'ในตลาด [ประเทศที่เลือก] — ใครคือผู้นำเข้า/ผู้จัดจำหน่าย [สินค้า] รายใหญ่? ช่วยหารายชื่อบริษัท ประเภทธุรกิจ และช่องทางติดต่อที่หาได้ พร้อมแนะนำว่าควรเข้าหาอย่างไร',a:['🇯🇵 Tanaka Foods K.K. (Tokyo) | Kyushu Food Import Co. | Sapporo Natural Trading','ประเภท: Food importer / Organic distributor · ติดต่อผ่าน JETRO / importgenius.com','วิธีเข้าหา: อีเมล → แนบ spec sheet + organic cert + FOB price list (ภาษาญี่ปุ่น)'],ft:"tip",fn:"ใช้คู่กับ ImportGenius/Volza (ข้อมูลใบขนจริง) และ Thaitrade.com (DITP) เพื่อข้อมูลแม่นขึ้น",r:`ผู้นำเข้า/จัดจำหน่าย Thai Hom Mali ในอินเดีย:

● ITC Limited (Mumbai) — ตัวเลือกอันดับ 1
  Food Division รายได้: USD 2.1B ปี 2025
  นำเข้าข้าว Premium: 5,000-8,000 MT/ปี
  Brand: Aashirvaad → Supermarket ทั่วอินเดีย
  ต้องการ: SGS cert + phytosanitary + GI cert
  ติดต่อ: agri-imports@itcltd.com

● Amira Nature Foods Ltd. (Delhi NCR)
  เชี่ยวชาญ: Specialty, GI, Organic varieties
  ลูกค้า: Big Bazaar, Reliance Fresh, D-Mart
  ส่งออกต่อไป 60+ ประเทศ · รายได้: USD 180M
  ติดต่อ: procurement@amiraindia.com

● KRBL Limited (Noida) — ปริมาณมากที่สุด
  India's #1 rice exporter, India Gate brand
  ซื้อ bulk → blend/repack → re-export ME
  Volume: 10,000+ MT/ปี — ออเดอร์ใหญ่แต่ margin ต่ำ

วิธีเข้าหาที่ให้ผลดีที่สุด:
→ Email ภาษาอังกฤษ + Thai Hom Mali spec sheet
→ แนบ Phytosanitary + Organic ACT + GI certificate
→ Sample 5 kg ฟรี ก่อน trial order 20-50 MT
→ ลงทะเบียน APEDA portal ให้ผู้ซื้อค้นหาเราได้
→ ขอแนะนำผ่าน DITP สำนักงาน Mumbai`},
  {t:"ขั้น 3 — ร่างอีเมลเข้าหาผู้ซื้อ (หลายภาษา)",p:'ร่างอีเมลแนะนำสินค้าและบริษัทเรา ถึงผู้นำเข้ารายนี้ — เป็นภาษา [อังกฤษ/เยอรมัน/จีน] โทนมืออาชีพ กระชับ เน้นจุดเด่นเรื่องคุณภาพ ราคา และการรับรองมาตรฐาน แล้วเตรียมคำตอบสำหรับคำถามที่เขาน่าจะถาม',a:['Subject: Thai Hom Mali Rice — Premium Organic Inquiry | Siam Rice Co., Ltd.','Dear Mr. Tanaka, We are a certified organic exporter in Thailand, Grade A Hom Mali 2025 crop, capacity 500MT/month FOB Bangkok…','เตรียม Q&A: Price vs Vietnam? → GI cert + moisture 14.5% + organic premium. MOQ? → 20\'GP = 20MT.'],ft:"warn",fn:"ตรวจข้อมูลบริษัท/ติดต่อก่อนส่งจริง · ใช้ตาม PDPA/GDPR · เคารพกฎ spam แต่ละประเทศ",r:`Draft Email ถึง ITC Limited (ภาษาอังกฤษ):

Subject: Premium Thai Hom Mali Rice — Grade A
Organic, GI Certified | New Supplier Inquiry

Dear Mr. Gupta,

We are Siam Rice Co., Ltd., an established Thai
exporter of premium organic rice, reaching out to
explore a long-term supply partnership with ITC's
Food Division.

Product: Thai Hom Mali Rice 100% (GI Reg.No.1234)
Grade A, Crop 2025 · Organic ACT Certified
Moisture ≤14.5% · Broken ≤5% · Purity 99.7%
Capacity: 200 MT/month · FOB Bangkok
Price: USD 1.45/kg (RCEP eligible → 0% duty)
Certification: Phytosanitary + Organic ACT + GI

We offer a complimentary 5 kg sample for your
quality evaluation team, with no obligation.

May we schedule a 20-minute call this week?

—
Q&A ที่เตรียมไว้:
Q: Why Thailand vs Vietnam?
A: GI certification + Organic + Superior aroma
   Hom Mali = world's most fragrant rice (ISO)
Q: MOQ?  A: Trial 20 MT · Regular 50 MT/shipment
Q: Payment? A: L/C at sight or T/T 30% advance
Q: Docs? A: Phyto + Organic ACT + GI + SGS`},
]};
const TARIFF={num:2,accent:P.d1,tint:P.d1t,label:"HOW TO 2 · ภาษี Trump",title:"AI วิเคราะห์ภาษี Trump\nสำหรับสินค้าของคุณ",prep:"เปิด Claude.ai หรือ ChatGPT · เปิดโหมด Web Search · เตรียมชื่อสินค้าจริง 1 รายการ",bottom:"4 ขั้นตอน · พิมพ์ตามทีละขั้น · เห็นผลสดต่อหน้า",steps:[
  {t:"ขั้น 1 — หาพิกัด HS Code และอัตราภาษีปัจจุบัน",p:'สินค้า [ชื่อสินค้าของคุณ เช่น แป้งมันสำปะหลัง] ส่งออกจากไทยไปสหรัฐ — HS Code คืออะไร และตอนนี้ (มิถุนายน 2026) เจอภาษีนำเข้าสหรัฐเท่าไหร่? แยกเป็น reciprocal และ Section 232 ให้ด้วย',a:['HS Code 1006.30.90 — Long-grain rice, milled (Thai Hom Mali)','สหรัฐฯ: Reciprocal ~19% + MFN base 0.52¢/kg · Section 232 ไม่เกี่ยว (เหล็ก/อะลู)','แหล่ง: USTR.gov Tariff Annex · CBP HTS Chapter 10 · กรมศุลกากรไทย'],ft:"tip",fn:"ถ้า AI ไม่แน่ใจพิกัด ให้บอกรายละเอียดสินค้าเพิ่ม (วัสดุ การใช้งาน) แล้วถามใหม่",r:`AI ค้นหาและยืนยัน HS Code + ภาษีปัจจุบัน:

สินค้า: ข้าวหอมมะลิ 100% (Thai Hom Mali)
HS Code ที่ถูกต้อง: 1006.30.90
(Husked rice, milled or semi-milled, long-grain)

ภาษีนำเข้าสหรัฐฯ (มิ.ย. 2026) ตาม CBP HTS:

ประเภทภาษี          อัตรา      หมายเหตุ
MFN Base Rate:       0.52¢/kg   (ฐานเดิม)
Reciprocal Tariff:   +18.5%     Thailand Tier 2
Section 232:         N/A        (เหล็ก/อะลูมิเนียม)
Section 301:         N/A        (จีนเท่านั้น)
─────────────────────────────────────────────
อัตราจริง:           ~19.0%     ของ CIF value

ตัวอย่างคำนวณ (FOB $1.45/kg, 20 MT = 20,000 kg):
FOB value:           USD 29,000
ภาษีนำเข้า 19%:    + USD 5,510
Ocean freight:      + USD 1,600
Insurance:          + USD 350
─────────────────────────────────────────────
Landed LA:           USD 36,460 (~$1.82/kg)

แหล่งข้อมูลอ้างอิงที่ใช้:
→ USTR.gov — Thailand Tariff Annex 2026
→ CBP Harmonized Tariff Schedule Ch.10
→ กรมศุลกากรไทย — รหัสสินค้า 1006.30
⚠️ กฎเปลี่ยนได้ทุกเวลา ตรวจ CBP.gov ก่อนส่งจริง`},
  {t:"ขั้น 2 — คำนวณ Landed Cost เทียบหลายตลาด",p:'ถ้าราคาสินค้า FOB อยู่ที่ [เช่น $500/ตัน] ช่วยคำนวณ landed cost เมื่อส่งไป สหรัฐ vs EU vs จีน — รวมภาษีนำเข้า, ค่าขนส่งโดยประมาณ, และกฎพิเศษ (เช่น CBAM/EUDR ถ้าเกี่ยว) แล้วสรุปว่าตลาดไหนคุ้มสุด',a:['FOB $1.20/kg → สหรัฐฯ $1.51 (+26%) | EU $1.34 (+12%) | จีน $1.22 (+2%)','EU: CBAM ไม่เกี่ยว(ข้าว) | จีน: RCEP FormE 0% | อินเดีย: FormD -50% → น่าสนใจมาก','สรุป: จีนคุ้มสุด → EU รอง → สหรัฐฯ ควรชะลอ หรือหา FTA ลดภาษีก่อน'],ft:"tip",fn:"ตัวเลขค่าขนส่งเป็นการประมาณ — ใช้เทียบทิศทาง ไม่ใช่ราคาจริงเป๊ะ",r:`Landed Cost เปรียบเทียบ 5 ตลาด (FOB $1.45/kg):

ตลาด       ภาษี   Freight  Insurance  Landed   vs FOB
─────────────────────────────────────────────────────
สหรัฐฯ LA  19.0%  $0.080   $0.017    $1.820   +25.5%
EU Hamburg  12.0%  $0.060   $0.017    $1.700   +17.2%
จีน Shanghai 0.0%  $0.030   $0.017    $1.497   + 3.2%
อินเดีย     0.0%   $0.020   $0.017    $1.487   + 2.5%
เวียดนาม    0.0%   $0.020   $0.017    $1.487   + 2.5%

กฎพิเศษที่กระทบ (EU Market):
• CBAM: ไม่เกี่ยวข้าว ✅ ไม่มีค่าใช้จ่ายเพิ่ม
• EUDR: ไม่เกี่ยวข้าว ✅ ไม่ต้องแสดงหลักฐาน
• EU Organic certification: +30-40% ราคาพรีเมียม
  → EU Landed $1.70 → จำหน่าย Organic ได้ $2.20+

การวิเคราะห์: ถ้า FOB เท่ากัน
• จีน/อินเดีย: กำไร margin สูงกว่าสหรัฐฯ 22%
• EU + Organic: กำไรสูงสุดทุกตลาด
• เวียดนาม: เสนอราคาสู้ได้ สร้าง volume

แนะนำกลยุทธ์การกำหนดราคา:
จีน/อินเดีย → FOB $1.45 (margin 15-20%)
EU Organic → CIF $1.70 + 30% premium = $2.21
สหรัฐฯ → รอดู หรือเพิ่ม value-add ก่อนส่ง`},
  {t:"ขั้น 3 — หากลยุทธ์ลดภาษี (FTA, ทางเลือก)",p:'มีวิธีลดภาษีถูกกฎหมายไหมสำหรับสินค้านี้? เช็กสิทธิ FTA (RCEP, ASEAN-China Form E, ไทย-EFTA), การจัดพิกัดใหม่, หรือตลาดทางเลือกที่ภาษีต่ำกว่า แล้วเรียงลำดับตามผลกระทบ',a:['RCEP (ไทย-จีน): FormE ภาษี 0% เกณฑ์ RVC≥40% — ผ่านแน่นอนสำหรับข้าวไทย','ASEAN-India: FormD ภาษี 50%→0% (เกณฑ์ RVC35%) · ASEAN-Korea: 0% FormAK','⚠️ Transshipment >40% ถือว่าสวมสิทธิ→ผิดกฎหมาย กรมการค้าต่างประเทศตรวจเข้มขึ้น'],ft:"tip",fn:"ให้ AI อธิบายว่าสินค้าเราเข้าเกณฑ์ FTA ไหน — แล้วเอาไปคุยกับชิปปิ้ง/DFT ต่อ",r:`กลยุทธ์ลดภาษีถูกกฎหมาย — วิเคราะห์ครบทุก FTA:

FTA ที่ใช้ได้กับข้าวหอมมะลิ (HS 1006.30):

1. RCEP (ไทย-จีน) — ประหยัดมากที่สุด
   อัตราภาษีปกติ: 65% → ใช้ RCEP Form E: 0%
   เกณฑ์ถิ่นกำเนิด: RVC ≥40% หรือ CTH
   ข้าวไทย 100% → ผ่านเกณฑ์ทันที ไม่ต้องพิสูจน์เพิ่ม
   ยื่นขอ Form E: กรมการค้าต่างประเทศ (DFT)
   ค่าธรรมเนียม: ~500 บาท/ชิปเมนต์

2. ASEAN-India CEFTA — โอกาสใหม่ปี 2026
   Form D: ภาษี 50-70% → 0-5%
   เกณฑ์: RVC ≥35% — ข้าวไทยผ่านแน่นอน
   Timeline: ออก Form D ใน 2 วันทำการ

3. ASEAN-Korea (AKFTA)
   Form AK: ภาษี 0% สำหรับข้าวแปรรูป
   เส้นทาง: LCB → Busan 5 วัน

4. ASEAN Free Trade (เวียดนาม/อินโดฯ/มาเลย์)
   Form D: ภาษี 0% ทันที ไม่มีเงื่อนไขซับซ้อน

ตลาดทางเลือกแทนสหรัฐฯ (ไม่มี FTA):
→ อินเดีย: CEFTA 0% + โต 5%/เดือน (เทียบ US 19%)
→ จีน: RCEP 0% + มูลค่าสูง (เทียบ US 19%)
→ UAE: ภาษี 5% เท่านั้น + Hub ส่งต่อ MENA

⚠️ เตือน: Transshipment ผ่านประเทศที่ 3
เกิน 40% ของมูลค่า = สวมสิทธิ = ผิดกฎหมาย`},
  {t:"ขั้น 4 — สรุปเป็นเอกสารพร้อมใช้",p:'สรุปทั้งหมดเป็นตารางเดียว: สินค้า, HS Code, ภาษีแต่ละตลาด, landed cost, กลยุทธ์แนะนำ — แล้วร่างอีเมลภาษาอังกฤษถึงผู้ซื้อต่างชาติ อธิบายราคาและความได้เปรียบของเรา',a:['ตาราง: HS 1006.30 | US +19% $1.51 | EU +12% $1.34 | CN 0% $1.22 | IN -50% $1.18','Draft email: \'Dear Buyer, our rice is RCEP Form E eligible → your landed cost at Hamburg is $1.34/kg vs competitor $1.42/kg — 6% cheaper than Vietnam after tariff adjustment.\'','เวลาทำงาน: AI 3 นาที vs ค้นเอง 4+ ชม (CBP+USTR+กรมศุลฯ+คำนวณ)'],ft:"warn",fn:"ตรวจตัวเลขภาษีกับ CBP/USTR ก่อนใช้จริงเสมอ — กฎเปลี่ยนเร็ว",r:`สรุปรายงานฉบับเต็ม — ข้าวหอมมะลิ HS 1006.30:

ตาราง Landed Cost สรุปครบ (FOB $1.45/kg):
ตลาด       ภาษี  CIF+Duties  FTA ที่ใช้  แนะนำ
US-LA      19%   $1.82       ไม่มี      ⛔ ชะลอ
EU-Hamburg 12%   $1.70       TH-EU(เจรจา) ✅+Organic
China-SHA   0%   $1.50       RCEP       ✅✅ เน้น
India-MUM   0%   $1.49       CEFTA      ✅✅ เน้น
Vietnam     0%   $1.49       ASEAN      ✅ รอง
UAE-DXB     5%   $1.55       ไม่มี      ✅ Hub

Draft Email ถึงผู้ซื้อ EU (ตัวอย่างจริง):

Dear Mr. Weber,
Our CIF Hamburg price for GI-certified Thai Hom
Mali Rice is USD 1.70/kg. This is 8% below our
Vietnamese competitor's offer of USD 1.84/kg after
their EU import duty adjustment. Our Organic ACT
certification additionally qualifies your products
for EU premium shelf pricing at EUR 4.50-6.00/kg.

We can supply 50-200 MT/month, shipping within
21 days from confirmed L/C. References available.

—
ROI Analysis ที่ AI คำนวณให้:
ใช้ AI วิเคราะห์: 4 นาที
ทำเองโดยค้น CBP+USTR+DFT: 4-5 ชั่วโมง
ประหยัดเวลา: 98% · ข้อมูลแม่นยำ: มีแหล่งอ้างอิง`},
]};
const GENERATE={num:3,accent:P.d4,tint:P.d4t,label:"HOW TO 3 · สร้างเอกสาร",supporting:matrixSlide,title:"AI สร้างเอกสารส่งออก\nจากเอกสารที่มีอยู่",prep:"มีเอกสารตั้งต้น 1 ใบ (เช่น Invoice หรือ Contract) · บอก AI ว่าต้องการสร้างเอกสารอะไรต่อ",bottom:"3 ขั้นตอน · จากเอกสารเดียว สร้างเอกสารทั้งชุดให้สอดคล้องกัน",steps:[
  {t:"ขั้น 1 — สร้างเอกสารถัดไปจากใบเดียว",p:'ฉันมี Commercial Invoice นี้อยู่แล้ว [อัปโหลด] — ช่วยสร้าง Packing List ที่สอดคล้อง 100% (จำนวน/น้ำหนัก/มาร์กกิ้งตรงกับ Invoice) ในฟอร์แมตมาตรฐานสากล พร้อมช่อง gross/net weight, จำนวนหีบห่อ และ shipping marks',a:['Packing List: 1,200 ถุง × 25kg = 30,000 kg Net | Gross 30,600 kg | 24 pallets','Marks: EFG/HAMBURG/2026/1-1200 · 35×35×65 cm/ถุง · Container: 1×20\' GP','✅ ตรงกับ Invoice ทุกฟิลด์อัตโนมัติ — ลดงานคีย์มือ ลดโอกาสผิดพลาด 100%'],ft:"tip",fn:"เพราะสร้างจากต้นทางเดียวกัน เอกสารที่ได้จึง สอดคล้องโดยกำเนิด — ตรงข้ามกับ HOW TO 5",r:`AI ร่าง Packing List จาก Invoice INV-2026-014:
(เสร็จใน 28 วินาที, Zero Discrepancy)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PACKING LIST  No. PL-2026-014
Date: 25 February 2026
Ref Invoice:  INV-2026-014
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Shipper:   Siam Rice Co., Ltd., Bangkok
Consignee: EuroFood GmbH, Hamburg, Germany
Vessel:    EVER GIVEN 2 / VOY-2026-018
Port:      Laem Chabang → Hamburg

Marks:     EFG / HAMBURG / 2026 / NO.1-1200

Item  Description          HS Code  Qty     NW       GW
───────────────────────────────────────────────────────
1     Thai Hom Mali 100%   1006.30  1,200   30,000   30,600
      Grade A, PP Bag 25kg/bag     bags    kg       kg
      24 Pallets (50 bags each)
      Dimension: 35×35×65 cm/bag
      120×100×160 cm/pallet (ISPM-15)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:  1,200 bags / 24 Pallets
Net Wt: 30,000.00 kg
Gross:  30,600.00 kg
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ตรงกับ Invoice ทุกฟิลด์ 100% อัตโนมัติ
✅ คีย์มือ 0 ตัวอักษร — ลดผิดพลาดได้ทั้งหมด
→ เวลาประหยัด: 15-20 นาที ต่อเอกสาร`สอดคล้องโดยกำเนิด' — ตรงข้ามกับ DEMO 5"},
  {t:"ขั้น 2 — แปลงข้ามประเภท ตามอุตสาหกรรม",p:'ฉันอยู่ในอุตสาหกรรม [อาหาร/สิ่งทอ/เหล็ก ฯลฯ] จากเอกสารตั้งต้นนี้ ช่วยร่างเอกสารส่งออกที่อุตสาหกรรมนี้ต้องใช้: Proforma Invoice, คำขอ Certificate of Origin และระบุใบรับรองเฉพาะทาง (Phytosanitary, Mill Test, CE) พร้อมบอกว่าต้องขอจากหน่วยงานใด',a:['อาหาร/เกษตร: Invoice + PL + Phytosanitary (กรมวิชาการเกษตร) + Health Cert (อย.) + C/O','สิ่งทอ: Invoice + PL + C/O FormA + Fiber Content Certificate · เหล็ก: Mill Test Cert + CBAM','ใบรับรองออกได้: C/O → กรมการค้าต่างประเทศ | Phyto → กรมวิชาการเกษตร | SGS → เอกชน'],ft:"tip",fn:"บอกอุตสาหกรรมและตลาดปลายทางให้ชัด AI จะเลือกชุดเอกสารได้ตรงกว่า",r:`ชุดเอกสารที่ต้องมีตามอุตสาหกรรม:

🌾 อาหาร/เกษตร → EU (เช่น ข้าว พืชผล):
   Invoice + Packing List (บังคับ)
   Certificate of Origin Form A / EUR.1
   Phytosanitary Certificate
   → ออก: กรมวิชาการเกษตร (DOA) · ค่าธรรมเนียม 500 บ.
   Health Certificate (ถ้า Processed food)
   → ออก: สำนักงาน อย. (FDA Thailand)
   Organic Certificate (ถ้า Organic claim)
   → ออก: ACT, IFOAM accredited body
   AI ร่างคำขอได้ทุกใบ ยื่นหน่วยงานเอง

👕 สิ่งทอ/เสื้อผ้า → USA:
   Invoice + PL + C/O Form A (GSP)
   Fiber Content Declaration
   Country of Origin Label compliance
   ถ้าเสื้อผ้าเด็ก: CPSC certification บังคับ

🔩 เหล็ก/โลหะ → EU (2026 เป็นต้นไป):
   Invoice + PL + Mill Test Certificate
   CBAM Declaration Form (บังคับ ม.ค. 2026)
   → ถ้าไม่มี: ถูกปรับและกักสินค้า
   EUR.1 for preferential tariff

💊 Medical Devices → EU/USA:
   CE Mark (EU MDR 2017/745) / FDA 510(k)
   ISO 13485:2016 Certificate
   Declaration of Conformity (DoC)
   Batch Release Certificate

AI ช่วยร่างคำขอทุกใบได้ ระบุอุตสาหกรรมและตลาด
→ AI จะเลือกชุดเอกสารที่ถูกต้องให้ทันที`},
  {t:"ขั้น 3 — ปรับตามกฎปลายทาง + ตรวจย้อน",p:'ปรับร่างเอกสารทั้งหมดให้ตรงข้อกำหนดปลายทาง [ประเทศ] (ภาษา, สกุลเงิน, ฟิลด์บังคับ เช่น EORI ของ EU หรือ GACC ของจีน) แล้วตรวจย้อนว่าทุกเอกสารสอดคล้องกันก่อนใช้จริง',a:['EU: เพิ่ม EORI ผู้รับ (DE4567890123) ใน Invoice + ระบุ Net/Gross ต่อ package ใน PL','จีน: เพิ่ม GACC Registration No. ผู้ส่ง + ผู้รับ + ระบุ Country of Origin ทุกเอกสาร','ตรวจ consistency รอบสุดท้าย: จำนวน/น้ำหนัก/ราคา/Incoterms ตรงกัน ✅ ไม่พบ discrepancy'],ft:"warn",fn:"AI ช่วยร่าง — เอกสารทางการต้องคนตรวจ ลงนาม และยื่นเองเสมอ",r:`ผลปรับเอกสารตามกฎ EU (เยอรมนี):

AI ตรวจพบ 4 ฟิลด์ที่ต้องเพิ่มสำหรับ EU:

1. EORI Number ผู้รับ (บังคับ 2024+)
   ค่าที่ต้องใส่: DE4567890123
   ตำแหน่ง: บรรทัด Consignee ใน Invoice
   ถ้าขาด: ของถูกกักที่ Hamburg Customs ทันที

2. Country of Origin (ทุกเอกสาร)
   ระบุ "THAILAND" ใน Invoice, PL, B/L
   EU ต้องการเพื่อตรวจ FTA/anti-dumping

3. Net/Gross Weight per Line Item (ใน PL)
   EU Customs ต้องการทั้ง Net และ Gross
   แยกตามแต่ละรายการสินค้า ไม่ใช่รวม

4. HS Code ครบ 8 หลัก (EU ใช้ CN Code)
   1006.30.27 (Thai Hom Mali specifically)

ผลตรวจ Consistency รอบสุดท้าย (หลังปรับ):
✅ จำนวน:    1,200 ถุง ตรงทุกเอกสาร
✅ มูลค่า:   USD 36,000 ตรงกัน
✅ Incoterms: FOB Bangkok ตรงกัน
✅ EORI:     DE4567890123 ระบุครบ
✅ Origin:   Thailand ทุกเอกสาร
✅ HS Code:  1006.30.27 ตรงกัน

ชุดเอกสารพร้อมส่งธนาคาร 5 ฉบับ:
Invoice✅ · PL✅ · C/O✅ · Phyto✅ · B/L✅
→ ไม่พบ Discrepancy — L/C ผ่านได้แน่นอน`},
]};
const READ={num:4,accent:P.d2,tint:P.d2t,label:"HOW TO 4 · เอกสารส่งออก",title:"AI อ่านเอกสารส่งออก\n+ ตรวจ Compliance",prep:"เตรียมรูป/ไฟล์ Invoice หรือ Packing List ตัวอย่าง (ลบข้อมูลลับออก) · อัปโหลดให้ AI อ่าน",bottom:"3 ขั้นตอน · เห็น AI อ่านเอกสารและจับ error สดๆ",steps:[
  {t:"ขั้น 1 — ให้ AI อ่านและสกัดข้อมูลจากเอกสาร",p:'[อัปโหลดรูป Invoice] + "อ่านเอกสารนี้ แล้วดึงข้อมูลสำคัญออกมาเป็นตาราง: ผู้ส่ง, ผู้รับ, รายการสินค้า, จำนวน, น้ำหนัก, มูลค่า, Incoterms, เงื่อนไขการชำระเงิน"',a:['ผู้ส่ง: Siam Garment Co., 123 Sukhumvit, Bangkok | ผู้รับ: Fashion Import GmbH, Hamburg','สินค้า: Cotton T-Shirt HS 6109.10 | 5,000 pcs×200g | Net 1,000kg Gross 1,150kg | USD 12,500','Incoterms: FOB Bangkok | ชำระ: L/C at sight — อ่านและสกัดครบใน 10 วินาที พร้อมกรอก ERP'],ft:"tip",fn:"AI อ่านได้ทั้งภาษาไทยและอังกฤษในเอกสารเดียวกัน",r:`AI อ่านและสกัดข้อมูลจาก Invoice INV-TX-2026-051:
(8 วินาที, ครบ 15 ฟิลด์, Zero manual entry)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ฟิลด์              ค่าที่สกัดได้
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Invoice Number:    INV-TX-2026-051
Invoice Date:      15 January 2026
Exporter/Shipper:  Siam Garment Co., Ltd.
Shipper Address:   123 Sukhumvit Rd., BKK 10110
VAT Number:        0105562012345
Consignee:         Fashion Import GmbH
Consignee Addr:    44 Hammerbrook Str., Hamburg
Product Name:      Cotton T-Shirt (100% Cotton)
HS Code:           6109.10
Quantity:          5,000 pieces
Unit Weight:       200 g per piece
Net Weight:        1,000 kg (calculated ✅)
Gross Weight:      1,150 kg (+150 kg packaging)
Unit Price:        USD 2.50 per piece
Total Value:       USD 12,500.00
Incoterms:         FOB Bangkok (Incoterms 2020)
Payment Terms:     Irrevocable L/C at sight
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cross-check อัตโนมัติ:
✅ 5,000 pcs × 200g = 1,000 kg ตรง
✅ 5,000 pcs × $2.50 = $12,500 ตรง
✅ Gross 1,150 kg = Net + 15% (packaging) ✅

พร้อม Export: Excel · JSON · ใบขนสินค้า · ERP`},
  {t:"ขั้น 2 — ตรวจความถูกต้องและจุดเสี่ยง",p:'ตรวจเอกสารนี้ว่ามีข้อมูลขาดหรือผิดปกติไหม สำหรับการส่งออกไป [ประเทศปลายทาง] — เช็กว่าตรงเงื่อนไข L/C ไหม, มูลค่าและน้ำหนักสมเหตุสมผลไหม, มีอะไรที่อาจทำให้ติดด่านศุลกากร',a:['⚠️ พบ 2 จุดเสี่ยง: (1) ไม่ระบุ EORI ผู้รับ — EU บังคับตั้งแต่ 2024 (2) Invoice ไม่ระบุ HS full 10 digits','น้ำหนักสมเหตุสมผล: 5,000×200g = 1,000kg ✅ | Gross 1,150kg = +15% บรรจุภัณฑ์ ✅','L/C at sight ตาม UCP 600: ยื่น docs ภายใน 21 วันหลัง B/L date · ห้าม discrepancy'],ft:"tip",fn:'นี่คือจุดที่ AI เป็น ",r:`AI ตรวจความถูกต้องและจุดเสี่ยง Invoice นี้:

⚠️ พบ 3 จุดที่ต้องแก้ไขก่อนส่งเอกสาร:

──────────────────────────────────────────
❌ จุดที่ 1: EORI Number ขาดหาย (HIGH RISK)
──────────────────────────────────────────
EU Customs Regulation EC 2913/92 + Amendment 2024:
ทุก Consignee ที่รับสินค้าใน EU ต้องมี EORI Number
ปัจจุบัน Invoice ไม่ระบุ EORI ของ Fashion Import GmbH
ผลกระทบ: ของถูกกักที่ Hamburg หรือ Antwerp ทันที
การแก้ไข: ขอ EORI (DE…) จาก Fashion Import GmbH
ใส่ในบรรทัด Consignee ก่อนออก B/L

──────────────────────────────────────────
⚠️ จุดที่ 2: HS Code 6 หลัก (ควรเป็น 10 หลัก)
──────────────────────────────────────────
Invoice ระบุ: 6109.10 (6 หลัก)
EU TARIC ต้องการ: 6109.10.0010 (10 หลัก)
สำหรับ Cotton T-shirt ผู้ชาย ไม่ใช่เด็ก
ผลกระทบ: อาจเสียภาษีผิดอัตรา หรือถูกสอบถาม
การแก้ไข: ตรวจ EU TARIC database → ec.europa.eu/taxation_customs

──────────────────────────────────────────
⚠️ จุดที่ 3: L/C Presentation Period ไม่ระบุ
──────────────────────────────────────────
UCP 600 Article 14(c): ถ้าไม่ระบุ = 21 วัน
ต้องยื่นเอกสารภายใน 21 วันหลัง B/L date
การแก้ไข: ระบุ "Documents to be presented within
21 days after B/L date" ใน Invoice หรือ L/C

✅ จุดที่ผ่านทุกอย่าง:
น้ำหนัก · ราคา · Incoterms · สินค้า · จำนวน`ด่านกันพลาด" — จับ error ก่อนเสียเงิน/เสียเวลา'},
  {t:"ขั้น 3 — ตรวจกฎปลายทาง + ร่างเอกสารถัดไป",p:'สำหรับส่งสินค้านี้ไป [ประเทศ] — ต้องมีใบรับรอง/เอกสารอะไรเพิ่ม (เช่น C/O, phytosanitary, CBAM, GACC)? แล้วช่วยร่าง checklist เอกสารทั้งหมดที่ต้องเตรียม',a:['ส่ง Hamburg: ต้องมี C/O (FormA/EUR.1), EORI ผู้รับ, ใบรับรอง Oeko-Tex (ถ้าเสื้อผ้าเด็ก)','Checklist: Invoice ✅ | Packing List ⬜ (สร้างได้) | B/L ⬜ | C/O ⬜ | EORI ⚠️ (ต้องเพิ่ม)','ร่าง Packing List ให้อัตโนมัติจาก Invoice นี้ได้เลย — ต้องการหรือไม่?'],ft:"warn",fn:"AI ช่วยร่างและคัดกรอง — แต่เอกสารทางการต้องคนตรวจและยื่นเอง",r:`ใบรับรองและเอกสารที่ต้องมีเพิ่ม — ส่ง Hamburg:

เอกสารหลักที่บังคับ:
✅ C/O Form A (EU GSP)
   → Thai Chamber of Commerce ออกใน 2 วัน
   → ลดภาษี EU จาก 12% → 0% (ประหยัด $1,500)
   → ค่าธรรมเนียม: 600-800 บาท/ชิปเมนต์

⚠️ EORI ผู้รับ — ยังขาด (ต้องได้ก่อน B/L)

✅ Packing List (สร้างได้อัตโนมัติจาก Invoice นี้)

✅ Bill of Lading (ออกโดย Shipping Line)

กรณีพิเศษ — ถ้าเป็นเสื้อผ้าเด็ก (Children's wear):
→ EN 14682:2014 (Drawcord safety) บังคับ
→ EN 14878:2007 (Burning behavior) บังคับ
→ REACH Regulation: ตรวจสาร PFAS, AZO dyes
→ Oeko-Tex Standard 100: แนะนำ (เพิ่มมูลค่า +20%)

กรณีพิเศษ — ถ้าส่ง USA แทน:
→ CPSC 15 USC §1278a: Lead paint ห้ามเกิน 100ppm
→ FTC Care Label (wash instructions) ภาษาอังกฤษ
→ Country of Origin Label: "Made in Thailand"

Checklist ปัจจุบัน:
Invoice ✅ · PL ⬜(สร้าง) · B/L ⬜ · C/O ⬜
EORI ⚠️ · HS 10-digit ⚠️ · Presentation period ⚠️

ต้องการให้ร่าง Packing List จาก Invoice นี้ได้เลย`},
]};
const CONSIST={num:5,accent:P.d3,tint:P.d3t,label:"HOW TO 5 · ตรวจความสอดคล้อง",supporting:mockSetSlide,title:"AI ตรวจความสอดคล้อง\nเอกสารส่งออกทั้งชุด",prep:"เตรียมไฟล์ Invoice + Packing List + Contract ของชิปเมนต์เดียวกัน (ลบข้อมูลลับออก) · อัปโหลดทั้งชุด",bottom:"3 ขั้นตอน · จับจุดไม่ตรงข้ามเอกสาร + เทียบกฎสากล ก่อนยื่นจริง",steps:[
  {t:"ขั้น 1 — ให้ AI จับคู่ฟิลด์จากทั้ง 3 เอกสาร",p:'[อัปโหลด Invoice + Packing List + Contract] + "อ่านทั้ง 3 ฉบับ แล้วสร้างตารางเทียบฟิลด์สำคัญเคียงกัน: ผู้ขาย/ผู้ซื้อ, สินค้า, HS Code, จำนวน, น้ำหนัก, มูลค่า, Incoterms, เงื่อนไขชำระเงิน, ปลายทาง"',a:['ตาราง 3 เอกสาร 8 ฟิลด์หลัก: ผู้ส่ง ผู้รับ สินค้า HS Code จำนวน น้ำหนัก มูลค่า Incoterms','🔴 ไม่ตรง 3 ช่อง: จำนวนถุง · Incoterms · HS Code/Origin clause ใน Contract','สร้างตารางเสร็จใน 15 วินาที — คนทำมือต้องใช้ 30+ นาที + เสี่ยงพลาด'],ft:"tip",fn:"ยิ่งอัปโหลดครบทั้งชุด AI ยิ่งจับจุดขัดกันได้แม่น — รวม L/C ด้วยก็ได้",r:`AI ตรวจและสร้างตาราง Cross-reference 3 เอกสาร:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ฟิลด์          Invoice        Packing List   Contract
               INV-2026-014   PL-2026-014    SC-2026-007
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ผู้ส่ง          Siam Rice ✅   Siam Rice ✅   Siam Rice ✅
ผู้รับ          EuroFood ✅    EuroFood ✅    EuroFood ✅
สินค้า         Hom Mali ✅    Hom Mali ✅    Hom Mali ✅
จำนวนถุง       1,200    ❌    1,180    ❌    ─────
Net Weight     30,000kg ✅    29,500kg ❌    30,000kg ✅
Incoterms      FOB BKK  ❌    FOB BKK  ✅    CIF HAM  ❌
มูลค่า         $36,000  ✅    ─────────      $36,000  ✅
HS Code        1006.30  ⚠️   ─────────      ขาด      ❌
Country Origin Thailand ✅    Thailand ✅    ขาด      ❌
Payment        L/C sight✅   ─────────      L/C sight✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
สรุป: พบ 5 จุดที่ขัดแย้ง/ขาดหาย (3 CRITICAL + 2 MEDIUM)

เวลาที่ AI ใช้: 15 วินาที
เวลาที่คนทำเอง: 30-45 นาที (เสี่ยงพลาด)`},
  {t:"ขั้น 2 — ตรวจ consistency + เทียบกฎสากล",p:'เทียบ 3 เอกสารนี้ว่าจุดไหนไม่สอดคล้องกัน และตรวจกับกฎสากลที่เกี่ยวข้อง: Incoterms 2020 ตรงกันไหม, ปริมาณ/มูลค่าตรงเงื่อนไข L/C (UCP 600) ไหม, HS Code ถูกและตรงกันไหม, ส่งไป [เยอรมนี/EU] ต้องมีใบรับรองอะไรตามกฎปลายทาง',a:['❌ จำนวน: Invoice 1,200 ถุง ≠ PL 1,180 ถุง → UCP 600 Art.18c: L/C ถูก REJECT ทันที','❌ Incoterms: Invoice FOB Bangkok ≠ Contract CIF Hamburg → Incoterms 2020 violation (ประกันเป็นของใคร?)','⚠️ Contract ขาด HS Code + Country of Origin → ยื่น EU Customs CBAM ไม่ได้'],ft:"tip",fn:"ให้ AI อ้างอิงข้อ UCP 600 / Incoterms ที่ใช้ตัดสิน เพื่อเอาไปยืนยันกับธนาคารได้",r:`Discrepancy Report — UCP 600 / Incoterms 2020:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ DISCREPANCY #1 — CRITICAL (L/C Risk)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ฟิลด์: จำนวนสินค้า
Invoice INV-2026-014:     1,200 ถุง / 30,000 kg
Packing List PL-2026-014: 1,180 ถุง / 29,500 kg
ส่วนต่าง: 20 ถุง (1.67%) — เกินกว่าที่ยอมรับได้
กฎ: UCP 600 Art.18(c): ห้ามมีความแตกต่างของ
จำนวนระหว่าง Invoice กับ Packing List
ผลกระทบทางการเงิน: ธนาคาร Issuing Bank มีสิทธิ์
ปฏิเสธการชำระเงิน $36,000 ทั้งจำนวน

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ DISCREPANCY #2 — CRITICAL (Cost Risk)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ฟิลด์: Incoterms
Invoice: FOB Bangkok → ผู้ซื้อรับผิดชอบ freight
Contract: CIF Hamburg → ผู้ขายรับผิดชอบ freight
ค่าใช้จ่ายที่ต่างกัน: $1,800-2,500 ต่อ 20'GP
ใครแพ้: ถ้าใช้ Invoice = EuroFood เสีย
         ถ้าใช้ Contract = Siam Rice เสีย
กฎ: Incoterms 2020 Rule A3/B3: ต้องตกลงใหม่ก่อน

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCREPANCY #3 — MEDIUM (Customs Risk)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contract ขาด HS Code + Country of Origin clause
EU Customs Regulation 2021: ต้องระบุ Origin
ถ้าไม่มี: กักสินค้าที่ Hamburg ได้สูงสุด 14 วัน`},
  {t:"ขั้น 3 — สรุป Discrepancy Report + ร่างแจ้งทีม",p:'สรุปเป็นรายงาน discrepancy: แต่ละจุดที่ไม่ตรงอยู่เอกสารใด ควรแก้เป็นค่าใด และจัดลำดับความเร่งด่วน แล้วร่างข้อความแจ้งทีม/ชิปปิ้งให้แก้ก่อนยื่นกรมศุลฯ และก่อนเปิด L/C',a:['รายงาน: แก้ PL 1,180→1,200 ถุง | ตกลง Incoterms (FOB หรือ CIF) | เพิ่ม HS+Origin ใน Contract','ลำดับ: ①จำนวนถุง(CRITICAL-L/Creject) ②Incoterms(HIGH-liability) ③Contract clause(MEDIUM)','ร่างข้อความถึงทีม: \'แก้ PL+Invoice ก่อนยื่นกรมศุลฯ ภายใน 48 ชม หรือต้องเลื่อน ETD\''],ft:"warn",fn:"AI ชี้จุดเสี่ยงได้ดี — แต่ตัวเลขสุดท้ายในเอกสารทางการต้องคนยืนยันและลงนาม",r:`Action Plan ครบถ้วน — แก้ก่อนยื่นกรมศุลฯ:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
① CRITICAL — แก้จำนวนถุง (ภายใน 24 ชม.)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before: Packing List = 1,180 ถุง / 29,500 kg
After:  Packing List = 1,200 ถุง / 30,000 kg
ผู้รับผิดชอบ: ฝ่ายชิปปิ้ง/คลังสินค้า
ขั้นตอน: แก้ PL → ให้ผู้มีอำนาจลงนามใหม่
→ ส่ง PL ที่แก้แล้วให้ธนาคารก่อน Present docs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
② CRITICAL — ตกลง Incoterms (ภายใน 48 ชม.)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ประชุมกับ EuroFood GmbH ตกลงให้ชัดว่าใช้:
Options: FOB Bangkok หรือ CIF Hamburg
แก้ทั้ง Invoice + Contract ให้ตรงกัน
ถ้าเลือก CIF: Siam Rice ต้องจัดประกัน 110% CIF
ผู้รับผิดชอบ: ฝ่าย Sales + Finance + Legal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
③ MEDIUM — เพิ่ม HS Code + Origin ใน Contract
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
เพิ่มข้อความ: "HS Code: 1006.30 / Country of
Origin: Thailand (RCEP eligible, Form E attached)"
ผู้รับผิดชอบ: Legal → ให้ EuroFood counter-sign

ร่างข้อความแจ้งทีม:
"โปรดแก้ไขเอกสารตามรายการด่วน ก่อนยื่น
กรมศุลกากร ภายใน 48 ชั่วโมง มิฉะนั้น
ต้องเลื่อน ETD และอาจโดนค่า demurrage
จาก Shipping Line ประมาณ $150-200/วัน"

ประหยัดเงิน: ค้นพบก่อนส่ง = ปกป้อง $36,000`},
]};

const DEMOS=[MARKET,TARIFF,GENERATE,READ,CONSIST];

(async () => {
  IC = await buildIcons(P);
  IC.icInvoice=await IC.invoice(P.d1); IC.icBox=await IC.box(P.d5); IC.icContract=await IC.contract(P.d4);
  IC.icFile=await IC.file(P.d5); IC.icArrow=await IC.arrow(P.d4); IC.icLeaf=await IC.leaf(P.green);
  IC.icShirt=await IC.shirt(P.d2); IC.icChip=await IC.chip(P.d5); IC.icIndustry=await IC.industry(P.d4);
  IC.icMag=await IC.magnify("FFFFFF"); IC.icScale=await IC.scale("FFFFFF"); IC.icContract2=await IC.contract("FFFFFF");
  IC.icFile2=await IC.file("FFFFFF"); IC.icCheck2=IC.checkW; IC.icRocket=await IC.rocket(P.green); IC.icArrowCap=await IC.arrow(P.muted);

  // SLIDE 1 — TITLE
  { const s=pres.addSlide(); bg(s);
    logo(s,6.05,1.45,0.22,0.255);
    s.addText("AI สำหรับธุรกิจ SME",{x:0.6,y:2.78,w:12.13,h:0.55,fontFace:F,fontSize:19,bold:true,color:P.d1,align:"center",charSpacing:2,margin:0});
    s.addText("Prompt ตัวอย่าง — ทำตามได้เลย",{x:0.6,y:3.36,w:12.13,h:1.0,fontFace:F,fontSize:46,bold:true,color:P.ink,align:"center",valign:"middle",margin:0});
    s.addText("เปิด Claude.ai หรือ ChatGPT แล้วพิมพ์ตามทีละขั้น  ·  5 วิธีทำ + 2 โบนัส  ·  18 prompt",{x:0.6,y:4.55,w:12.13,h:0.5,fontFace:F,fontSize:15,color:P.ink2,align:"center",margin:0});
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:2.85,y:5.62,w:7.63,h:0.92,fill:{color:P.cardAlt},line:{color:P.border,width:1},rectRadius:0.46,shadow:shadowSoft()});
    s.addImage({data:IC.bulb,x:3.22,y:5.96,w:0.26,h:0.26});
    s.addText("เคล็ดลับ: สแกน QR ในแต่ละสไลด์ เปิดแชตพร้อม prompt ทันที",{x:3.57,y:5.62,w:6.6,h:0.92,fontFace:F,fontSize:13.5,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
  }
  // SLIDE 2 — HOW TO USE
  { const s=pres.addSlide(); bg(s);
    logo(s,0.6,0.46,0.1,0.12);
    s.addText("วิธีใช้สไลด์ชุดนี้",{x:1.2,y:0.4,w:11,h:0.62,fontFace:F,fontSize:28,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
    const steps=[["เปิดเครื่องมือ AI","เปิด Claude.ai หรือ ChatGPT บนคอม/มือถือ · เปิดโหมด Web Search ให้ดึงข้อมูลสด (ภาษี ราคา ข่าว)"],["สแกน QR หรือคัดลอก prompt",'สแกน QR เปิดแชตพร้อม prompt แล้วทำตามไปพร้อมกันบนมือถือ — หรือพิมพ์/คัดลอกจากกล่อง "พิมพ์/คัดลอกนี้"'],["แทนคำใน [วงเล็บ]","เปลี่ยน [ชื่อสินค้า] [ประเทศ] [ราคา] เป็นข้อมูลจริงของธุรกิจคุณ"],["ดูผล แล้วถามต่อ",'กล่อง "AI จะตอบประมาณนี้" บอกว่าจะได้อะไร · ถามต่อได้เรื่อยๆ จนได้คำตอบที่ใช้ได้']];
    const colCycle=[P.d5,P.d1,P.d4,P.d3], ys=[1.55,2.87,4.19,5.51];
    steps.forEach(([h,d],i)=>{ const y=ys[i],A=colCycle[i];
      s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:0.6,y,w:12.13,h:1.18,fill:{color:P.card},line:{color:P.border,width:1},rectRadius:0.08,shadow:shadowSoft()});
      s.addShape(pres.shapes.OVAL,{x:0.9,y:y+0.26,w:0.66,h:0.66,fill:{color:A},line:{type:"none"}});
      s.addText(String(i+1),{x:0.9,y:y+0.26,w:0.66,h:0.66,fontFace:F,fontSize:24,bold:true,color:"FFFFFF",align:"center",valign:"middle",margin:0});
      s.addText(h,{x:1.78,y:y+0.16,w:10.7,h:0.42,fontFace:F,fontSize:17,bold:true,color:P.ink,align:"left",valign:"middle",margin:0});
      s.addText(d,{x:1.78,y:y+0.58,w:10.7,h:0.5,fontFace:F,fontSize:13,color:P.ink2,align:"left",valign:"middle",margin:0}); });
    footnote(s,"warn","QR เปิดใน ChatGPT (พร้อม prompt) · ข้อมูลภาษี/กฎเปลี่ยนเร็ว — ตรวจกับแหล่งทางการ (CBP, USTR, กรมศุลฯ) ก่อนใช้จริงเสมอ");
  }

  agendaSlide();
  for (const D of DEMOS) {
    introSlide({num:D.num,accent:D.accent,title:D.title,prep:D.prep,bottom:D.bottom});
    if(D.num===1){ excelPreviewSlide(); await fileDownloadSlide(); }
    await walkthroughSlide(D, DEMO_AI[D.num]);
    if (D.supporting) D.supporting();
    let i=0;
    for (const st of D.steps) { i++; const qr=await qrPng(st.p);
      await stepSlide({demoLabel:D.label,accent:D.accent,tint:D.tint,stepNum:i,stepTotal:D.steps.length,stepTitle:st.t,prompt:st.p,aiResp:st.r||'',answers:st.a,footType:st.ft,footnote:st.fn,qr}); }
  }

  // BONUS DEMO — multi-agent (live build)
  bonusIntroSlide();
  archSlide();
  buildStepsSlide();
  { const mp='อัปโหลดไฟล์ข้อมูลส่งออกนี้ แล้วทำงานเป็นทีมเอเจนต์ให้ครบ 6 ขั้นในคำสั่งเดียว (เนื้อหาเดียวกับ Bonus 2 แต่ทำอัตโนมัติ): (1) อ่านไฟล์ข้อมูล (2) หา Top 3 ตลาด + ผู้ซื้อ (3) วิเคราะห์ภาษีและ landed cost ของตลาดที่ดีที่สุด (4) ร่าง Commercial Invoice + Packing List (5) ตรวจความสอดคล้องและกฎปลายทาง (6) สรุปเป็นแผนปฏิบัติพร้อมเอกสารแนบ';
    const qr=await qrPng(mp); await masterPromptSlide(qr); }
  pipelineSlide();
  loopConceptSlide();
  loopPrinciplesSlide();
  bonus2IntroSlide();
  await bonus2TutorialSlide(1);
  await bonus2TutorialSlide(2);
  // OSIRIS spotlight
  osirisSlide();

  orgAISlide();
  buildArchSlide();
  // CLOSING
  { const s=pres.addSlide(); bg(s);
    logo(s,6.05,1.35,0.2,0.235);
    s.addText("ลองเอง วันนี้เลย",{x:0.6,y:2.6,w:12.13,h:1.0,fontFace:F,fontSize:46,bold:true,color:P.ink,align:"center",valign:"middle",margin:0});
    s.addText("เอาสินค้าจริงของคุณ แทนคำใน [วงเล็บ] · สแกน QR เพื่อเปิดแชตพร้อม prompt",{x:0.6,y:3.78,w:12.13,h:0.5,fontFace:F,fontSize:16,color:P.ink2,align:"center",margin:0});
    s.addShape(pres.shapes.ROUNDED_RECTANGLE,{x:2.9,y:4.78,w:7.53,h:1.4,fill:{color:P.cardAlt},line:{color:P.border,width:1},rectRadius:0.12,shadow:shadowSoft()});
    s.addText([{text:"เริ่มที่:  ",options:{color:P.ink2}},{text:"Claude.ai",options:{color:P.d1,bold:true}},{text:"   หรือ   ",options:{color:P.muted}},{text:"chat.openai.com",options:{color:P.d5,bold:true}}],{x:3.1,y:4.86,w:7.13,h:0.7,fontFace:F,fontSize:21,align:"center",valign:"middle",margin:0});
    s.addText("อย่าลืมเปิด Web Search · ตรวจข้อมูลภาษี/กฎกับแหล่งทางการก่อนใช้จริง",{x:3.1,y:5.56,w:7.13,h:0.5,fontFace:F,fontSize:12.5,italic:true,color:P.muted,align:"center",valign:"middle",margin:0});
  }

  await ctaSlide();
  // APPENDIX — sample documents
  { const dlqr=await qrRaw("https://drive.google.com/your-shared-folder"); appendixDivider(dlqr); }
  await docImageSlide("mock-1.png","Commercial Invoice — INV-2026-014","HOW TO 3 · HOW TO 5\n(Invoice ที่มีจุดไม่ตรงกับ Packing List/Contract)","https://drive.google.com/file/HOW-TO-3-invoice");
  await docImageSlide("mock-2.png","Packing List — PL-2026-014","HOW TO 5\n(1,180 ถุง ≠ Invoice 1,200 — planted mismatch)","https://drive.google.com/file/HOW-TO-5-packing-list");
  await docImageSlide("mock-3.png","Sales Contract — SC-2026-007","HOW TO 5\n(CIF ≠ FOB · ขาด HS Code — planted mismatch)","https://drive.google.com/file/HOW-TO-5-contract");
  await docImageSlide("mock-4.png","Commercial Invoice (เสื้อผ้า) — INV-TX-2026-051","HOW TO 4\n(เอกสารสะอาด ให้ AI อ่านและสกัดข้อมูล)","https://drive.google.com/file/HOW-TO-4-invoice");

  await pres.writeFile({ fileName: "/home/claude/out2.pptx" });
  console.log("WROTE out2.pptx");
})();
