p='/home/claude/build2.js'; s=open(p,encoding='utf-8').read()
import re

RICH = {}

# ─────────────────────────────── HOW TO 1 ──────────────────────────────────────
RICH[(1,1)] = """จากข้อมูลส่งออกของคุณ AI วิเคราะห์ Top 5 ตลาด ปี 2026:

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
→ แนะ: กระจาย 3 ตลาด ลดความเสี่ยงจากนโยบายเดียว"""

RICH[(1,2)] = """ผู้นำเข้า/จัดจำหน่าย Thai Hom Mali ในอินเดีย:

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
→ ขอแนะนำผ่าน DITP สำนักงาน Mumbai"""

RICH[(1,3)] = """Draft Email ถึง ITC Limited (ภาษาอังกฤษ):

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
Q: Docs? A: Phyto + Organic ACT + GI + SGS"""

# ─────────────────────────────── HOW TO 2 ──────────────────────────────────────
RICH[(2,1)] = """AI ค้นหาและยืนยัน HS Code + ภาษีปัจจุบัน:

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
⚠️ กฎเปลี่ยนได้ทุกเวลา ตรวจ CBP.gov ก่อนส่งจริง"""

RICH[(2,2)] = """Landed Cost เปรียบเทียบ 5 ตลาด (FOB $1.45/kg):

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
สหรัฐฯ → รอดู หรือเพิ่ม value-add ก่อนส่ง"""

RICH[(2,3)] = """กลยุทธ์ลดภาษีถูกกฎหมาย — วิเคราะห์ครบทุก FTA:

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
เกิน 40% ของมูลค่า = สวมสิทธิ = ผิดกฎหมาย"""

RICH[(2,4)] = """สรุปรายงานฉบับเต็ม — ข้าวหอมมะลิ HS 1006.30:

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
ประหยัดเวลา: 98% · ข้อมูลแม่นยำ: มีแหล่งอ้างอิง"""

# ─────────────────────────────── HOW TO 3 ──────────────────────────────────────
RICH[(3,1)] = """AI ร่าง Packing List จาก Invoice INV-2026-014:
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
→ เวลาประหยัด: 15-20 นาที ต่อเอกสาร"""

RICH[(3,2)] = """ชุดเอกสารที่ต้องมีตามอุตสาหกรรม:

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
→ AI จะเลือกชุดเอกสารที่ถูกต้องให้ทันที"""

RICH[(3,3)] = """ผลปรับเอกสารตามกฎ EU (เยอรมนี):

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
→ ไม่พบ Discrepancy — L/C ผ่านได้แน่นอน"""

# ─────────────────────────────── HOW TO 4 ──────────────────────────────────────
RICH[(4,1)] = """AI อ่านและสกัดข้อมูลจาก Invoice INV-TX-2026-051:
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

พร้อม Export: Excel · JSON · ใบขนสินค้า · ERP"""

RICH[(4,2)] = """AI ตรวจความถูกต้องและจุดเสี่ยง Invoice นี้:

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
น้ำหนัก · ราคา · Incoterms · สินค้า · จำนวน"""

RICH[(4,3)] = """ใบรับรองและเอกสารที่ต้องมีเพิ่ม — ส่ง Hamburg:

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

ต้องการให้ร่าง Packing List จาก Invoice นี้ได้เลย"""

# ─────────────────────────────── HOW TO 5 ──────────────────────────────────────
RICH[(5,1)] = """AI ตรวจและสร้างตาราง Cross-reference 3 เอกสาร:

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
เวลาที่คนทำเอง: 30-45 นาที (เสี่ยงพลาด)"""

RICH[(5,2)] = """Discrepancy Report — UCP 600 / Incoterms 2020:

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
ถ้าไม่มี: กักสินค้าที่ Hamburg ได้สูงสุด 14 วัน"""

RICH[(5,3)] = """Action Plan ครบถ้วน — แก้ก่อนยื่นกรมศุลฯ:

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

ประหยัดเงิน: ค้นพบก่อนส่ง = ปกป้อง $36,000"""

print(f"RICH responses defined: {len(RICH)}")

# Update font size in stepSlide right panel
s = s.replace(
    'fontFace:F,fontSize:11.5,color:P.ink,align:"left",valign:"top",lineSpacingMultiple:1.14,margin:0});',
    'fontFace:F,fontSize:10,color:P.ink,align:"left",valign:"top",lineSpacingMultiple:1.08,margin:0});'
)
print("font size updated:", 'fontSize:10,color:P.ink' in s)

# Inject new r fields
demo_names = {1:"MARKET",2:"TARIFF",3:"GENERATE",4:"READ",5:"CONSIST"}

for (dnum, snum), resp in sorted(RICH.items()):
    esc = resp.replace('\\','\\\\')
    esc = esc.replace('`','\\`')
    r_field = f',r:`{esc}`'
    
    dname = demo_names[dnum]
    demo_pos = s.find(f'const {dname}={{')
    if demo_pos < 0:
        print(f"MISS demo {dname}"); continue
    
    steps_pos = s.find('steps:[', demo_pos)
    if steps_pos < 0:
        print(f"MISS steps in {dname}"); continue
    
    depth=0; ep=steps_pos+7
    while ep < len(s):
        if s[ep]=='[': depth+=1
        elif s[ep]==']':
            if depth==0: break
            depth-=1
        ep+=1
    
    steps_seg = s[steps_pos:ep+1]
    step_positions = [m.start() for m in re.finditer(r'\{t:', steps_seg)]
    
    if snum-1 >= len(step_positions):
        print(f"MISS step {dnum}/{snum}"); continue
    
    step_start = step_positions[snum-1]
    next_step = step_positions[snum] if snum < len(step_positions) else len(steps_seg)
    step_content = steps_seg[step_start:next_step]
    
    fn_match = re.search(r',fn:[\'"]([^\'"]*)[\'"]\}', step_content)
    if not fn_match:
        fn_match = re.search(r',fn:[\'"][^\'"]*[\'"]', step_content)
    if not fn_match:
        print(f"MISS fn in {dname}/step{snum}"); continue
    
    # Remove old r field if exists
    step_clean = re.sub(r',r:`[^`]*`', '', step_content)
    # Insert new r field after fn
    fn_m2 = re.search(r',fn:[\'"][^\'"]*[\'"]', step_clean)
    if not fn_m2:
        print(f"MISS fn2 in {dname}/step{snum}"); continue
    
    insert_at = fn_m2.end()
    new_step = step_clean[:insert_at] + r_field + step_clean[insert_at:]
    
    old_seg = s[steps_pos:ep+1]
    new_seg = old_seg[:step_start] + new_step + old_seg[step_start+len(step_content):]
    s = s[:steps_pos] + new_seg + s[ep+1:]
    print(f"✅ {dname}/step{snum}: {resp[:45].strip()!r}")

open(p,'w',encoding='utf-8').write(s)
cnt=s.count(",r:`"); print(f"\nSaved. r fields now: {cnt}")
