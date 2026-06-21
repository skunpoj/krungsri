# 📦 AI for SME Export Workshop — Handoff Package
### เอาไฟล์นี้ไปใช้ใน chat ใหม่ · บอก Claude ว่า "ทำต่อตาม REDESIGN_SPEC"

## โปรเจกต์คืออะไร
PowerPoint workshop ภาษาไทย สอน SME นำเข้า-ส่งออก ใช้ AI (ChatGPT/Claude)
มี 5 HOW TO + 2 Bonus + pipeline อัตโนมัติ

## 🎯 งานที่ค้างอยู่ (อ่าน REDESIGN_SPEC.md ก่อน)
Rewrite ใหญ่: เปลี่ยนจาก deck สรุป → **คู่มือทำตามทีละขั้น**
- หน้าละ 1 ขั้นตอน · ตัวหนังสือใหญ่ · ขยายยาวสุด (~100 หน้า)
- AI response แบบเนื้อเรื่อง/เรียงความ (ไม่ใช่ bullet)
- ละเอียดทุกการกดปุ่ม · บอก QR ไหนก่อนหลัง
- ทำเหมือนกันทั้ง 5 HOW TO + bonus

## โครงสร้างโฟลเดอร์
- **REDESIGN_SPEC.md** ← อ่านก่อน! สเปกงานใหม่ทั้งหมด
- **01_source_code/** — build2.js (โค้ดสร้าง deck ปัจจุบัน), inject_rich.py (AI responses ละเอียด 16 ตัว reuse ได้), icons.js, make_*.py (สคริปต์สร้างเอกสาร)
- **02_documents_assets/** — เอกสารตัวอย่างซับซ้อน 8 ไฟล์:
  - HOW_TO_1...xlsx = Excel 788 แถว 7 sheet
  - A1/A2 = Multi-product Invoice+PackingList
  - B1/B2/B3 = Hard Case 8 planted discrepancies (HOW TO 5)
  - C1 = Medical Device (FDA/CE/ISO)
  - D1 = Natural Rubber multi-grade
- **03_latest_deck/** — v21 ปัจจุบัน (53 หน้า, แบบเก่า) pptx + pdf
- **04_supporting/** — mock PDFs เป็น PNG, Excel เดิม, export-secretary.zip (Claude Code pipeline), runbook, links guide

## วิธีทำงานต่อใน chat ใหม่
1. อัปโหลด zip นี้
2. บอก: "ทำต่อตาม REDESIGN_SPEC.md — สร้าง build3.js แล้วทำ HOW TO 1 เป็นต้นแบบก่อน"
3. Claude อ่าน spec + reuse build2.js patterns + AI responses จาก inject_rich.py

## เทคนิคที่ใช้
- pptxgenjs (Node.js) สร้าง .pptx
- QR → chatgpt.com/?q= (auto-submit prompt)
- LibreOffice convert เป็น PDF เพื่อ QA
- Palette cream theme (ดูใน build2.js object P)
