# Prompt-QR links (chatgpt.com) — all 23, by slide

These are the 23 QR codes on `actionStepSlide`s that link to a pre-filled
ChatGPT chat (`chatgpt.com/?q=...`). Visit each, screenshot ChatGPT's answer,
and note the slide number — that's where it should be inserted.

(The 10 file-download QRs point to `raw.githubusercontent.com` and don't need
screenshots — those were already verified separately.)

## Context for a fresh session picking this up

This is repo `skunpoj/krungsri`, branch `claude/ai-sme-workshop-handoff-gfde4c`.
The deck is `deck/build3.js` → `deck/out3.pptx` (104-slide Thai workshop deck).
23 of its slides have a QR code linking to `chatgpt.com/?q=<prompt>` so
attendees can scan and see a live AI answer. We're collecting screenshots of
those answers to insert into the deck as "here's what you'll actually see"
proof images.

**Already done** (don't redo): all 23 standalone screenshots were captured,
cropped, and committed to `deck/assets/chatgpt_screens/slide_NN.png`
(`NN` = slide number). The crop pipeline used: source screenshots were
1293×1045px full-browser captures; crop to `(330,105,1260,930)` to strip the
address bar/tab strip, left chat-history sidebar, and bottom cookie banner;
then paint a black rectangle over `(415,20,915,300)` (in the *cropped*
image's coordinates) to blot out a "Sign in to chatgpt.com with google.com"
popup that appeared on most captures. If your browser window/zoom differs,
re-derive these boxes visually rather than reusing the numbers blindly.

**The problem we found**: auditing those 23, ~15 show a generic/clarifying
ChatGPT reply instead of the deck's intended specific answer. Root cause:
those prompts were written assuming "type this in the *same chat* as the
previous step" (e.g. "the markets we compared", "that order", "market #1"),
but each QR opens a brand-new chat with zero history, so ChatGPT can't
resolve the reference.

**What this test is for**: checking whether replaying the prior turns in one
real chat session (rather than opening the final prompt standalone) produces
a correct, specific answer — i.e., whether conversation continuity alone
fixes it. If yes, multi-turn replay becomes the capture method for the
affected file-upload-free slides. If no, the fix has to be rewriting the
prompt text itself (in `build3.js`) to restate context inline, which is a
separate, bigger task we'd tackle next regardless of this result.

**Output expected from you**: save the turn-4 screenshot (cropped, popup
removed) to `/tmp/multiturn_test_slide30.png`, and reply in chat with
pass/fail per the condition below plus a one-line description of what the
answer actually contained. Don't commit anything to the repo for this test —
it's just a probe to decide the next step.

## TEST CASE — multi-turn replay (run this one first)

Slides 11, 13, 30, 42, 44, 56, 58, 74, 76, 78, 88, 97, 99, 100, 101, 102 show a
generic/clarifying answer when opened standalone, because their prompt text
assumes it's typed as a follow-up in a chat that already has earlier turns'
context (anaphoric references like "the markets we compared", "that order",
"market #1" with nothing naming what that is).

**Slide 30 is the cleanest test case** because its 3 prerequisite turns
(slides 24, 26, 28) are all self-contained text prompts — no file upload
involved, so a confirmed pass/fail here isolates the "needs prior chat
turns" variable cleanly, without "needs an uploaded file" muddying the result.

Steps:
1. Open a **brand-new** `chatgpt.com` chat (not via QR this time — just the
   site directly, so all 4 messages land in one conversation).
2. Paste and send, **in this exact order, one at a time, waiting for each
   reply before sending the next**:
   1. (slide 24's prompt) `ข้าวหอมมะลิของฉัน HS Code 1006.30.90 ราคา FOB กรุงเทพฯ $1.45/kg ถ้าส่งไปสหรัฐฯ ตอนนี้เจอภาษีนำเข้าเท่าไหร่ ช่วยคำนวณ MFN base tariff รวมกับ Reciprocal Tariff ปี 2026 พร้อมตัวอย่าง landed cost ถึงท่าเรือ Los Angeles สำหรับออเดอร์ 20,000 กิโลกรัม`
   2. (slide 26's prompt) `เปรียบเทียบ landed cost ต่อกิโลกรัมของข้าวหอมมะลิราคา FOB $1.45 ถ้าส่งไปสหรัฐฯ สหภาพยุโรป จีน อินเดีย และเวียดนาม ตลาดไหนคุ้มที่สุดเมื่อรวมภาษีนำเข้าแล้ว`
   3. (slide 28's prompt) `มีสิทธิประโยชน์ทางภาษีอะไรที่ช่วยให้ส่งออกข้าวไปจีนหรืออินเดียได้ภาษี 0% บ้าง ต้องใช้เอกสารอะไร ขอที่ไหน ใช้เวลานานแค่ไหน และมีข้อควรระวังอะไรบ้าง`
   4. (slide 30's prompt — **screenshot only this final answer**) `สรุปทุกตลาดที่เปรียบเทียบมาเป็นตารางเดียว (ภาษี/landed cost/ข้อแนะนำ) แล้วร่างอีเมลเสนอราคาภาษาอังกฤษไปยังผู้ซื้อในเยอรมนีที่ราคา CIF Hamburg พร้อมเน้นจุดขายเรื่องใบรับรองออร์แกนิก`
3. Crop/save the screenshot of step 4's answer the same way as the others.

**Pass condition**: the answer is a real comparison table covering all 4
markets (US/EU/China/India/Vietnam) plus a populated English quote email to
a German buyer at CIF Hamburg pricing — not a clarifying question, not a
`[Your Company Name]` placeholder template.

If this passes, multi-turn replay is a viable fix for the no-file-upload
subset (slides 30, 76, 78, 97, 99, 102, roughly). If it fails too — i.e. even
with full prior context loaded in the same session, turn 4 still comes back
generic — that would point to something else going on (e.g. ChatGPT not
reliably using earlier turns for this kind of synthesis prompt) and we
should go straight to rewriting the prompts to be self-contained instead.

## TEST CASE 2 — multi-turn replay WITH a file upload (run this second)

Test case 1 (above) only covers the no-file-upload subset. Several other
affected slides — 56, 74, 88, and the whole Bonus-2 sequence 97–102 — start
from a prompt that assumes a **file is attached to the chat**, e.g.
"นี่คือข้อมูลส่งออกของฉัน ช่วยดูให้หน่อยว่ามีอะไรอยู่ในไฟล์นี้บ้าง" (slide 97)
or "อ่าน Invoice ฉบับนี้..." (slide 56, even though slide 56's prompt also
pastes the invoice's data as text — ChatGPT still treated it as if a file
should be attached and asked for one, which is itself worth confirming/
ruling out by testing).

This second test does two things at once: confirms whether (a) an uploaded
file persists and stays usable across later turns in the same chat without
re-uploading, and (b) whether that combined with multi-turn replay fixes the
anaphoric-reference slides (99, 100 in particular, both confirmed generic
when opened standalone).

**Use the Bonus-2 sequence (slides 97–102)** — it's the deck's own "6 steps,
1 chat, 1 file" design, so it's the most direct test of exactly what the
deck claims is possible.

File to upload: download
`https://raw.githubusercontent.com/skunpoj/krungsri/claude/ai-sme-workshop-handoff-gfde4c/deck/Sample_Thai_Export_Data.xlsx`
(this is the exact same sample file the deck's other QR codes link to — an
export-records spreadsheet, not sensitive data).

Steps:
1. Open a **brand-new** `chatgpt.com` chat.
2. Attach `Sample_Thai_Export_Data.xlsx` to the message box.
3. Send, with the file attached, slide 97's prompt: `นี่คือข้อมูลส่งออกของฉัน ช่วยดูให้หน่อยว่ามีอะไรอยู่ในไฟล์นี้บ้าง`
4. Wait for the reply, screenshot it, then send slide 98's prompt (**no
   re-attaching the file** — this is the persistence test):
   `วิเคราะห์ Top 5 ตลาดส่งออกของฉันปี 2026 เรียงตามโอกาส พร้อมเหตุผล`
5. Wait, screenshot, then send slide 99's prompt: `ตลาดอันดับ 1 เจอภาษีนำเข้าเท่าไหร่ และ landed cost ต่อตันเท่าไหร่`
6. Wait, screenshot, then send slide 100's prompt: `ร่าง Commercial Invoice + Packing List สำหรับออเดอร์ไปตลาดนั้น`
7. Wait, screenshot, then send slide 101's prompt: `ตรวจว่าเอกสารสอดคล้องกันไหม และต้องมีใบรับรองอะไรตามกฎปลายทาง`
8. Wait, screenshot, then send slide 102's prompt: `สรุปทั้งหมดเป็นแผนปฏิบัติ + checklist เอกสารที่ต้องเตรียม`

Save each turn's screenshot (cropped, popup removed, same pipeline as
before) to `/tmp/multiturn_file_test_slide97.png` through
`.../slide102.png`.

**Pass condition per turn** — not an exact-figure match (the deck's
narration text uses invented illustrative numbers, not a literal transcript
of this exact file), but each answer should be **specific and grounded in
the real uploaded file's contents**, e.g.:
- Slide 97: names actual product/country categories found in the file, not "I don't see a file."
- Slide 98: names actual top markets with actual reasons, not a generic top-5 framework.
- Slide 99: names a specific market and gives an actual tariff/landed-cost number for *that* market — not "which market do you mean?"
- Slide 100: a populated invoice/packing list with real buyer/quantity/price fields — not a `[Your Company Name]` placeholder template.
- Slide 101: a real consistency check referencing the actual drafted documents.
- Slide 102: a real action plan referencing the actual prior turns, not "what do you mean by 'all of it'?"

**If slide 97 alone already fails** (i.e. ChatGPT doesn't actually read the
spreadsheet contents — e.g. can't parse it, or gives a generic "I see a
file was uploaded" non-answer), that's the most important single finding:
it would mean the deck's core promise ("upload your file, AI reads it
directly") doesn't actually hold up live, which matters far more than the
QR/multi-turn issue and should be reported back immediately rather than
continuing through turns 98–102.

Report back: pass/fail per turn, plus whether the file upload persisted
across turns 98–102 without re-attaching.

## TEST CASE 1B — HOW TO 1, file upload + multi-turn, with the fixed prompts

Run this one too — it's the same mechanism Test Case 2 already proved
(file upload + multi-turn replay, logged in), but on the **just-fixed**
slide 11/13 prompts. The old prompts named a specific market ("ตลาดอินเดีย")
and buyer ("ITC Limited") that don't match what the real file actually
returns; the new prompts are anaphoric instead, so this also re-validates
that the fix actually resolves correctly in a live chat.

Steps:
1. Open a **brand-new** `chatgpt.com` chat, **logged in** (the attach button
   shows a login wall otherwise).
2. Attach `Sample_Thai_Export_Data.xlsx` (same file as Test Case 2,
   downloadable from the link in that section above).
3. Send slide 9's prompt: `จากไฟล์ข้อมูลส่งออกนี้ ช่วยวิเคราะห์ Top 5 ตลาดส่งออกของฉันปี 2026 — ดูจากดีมานด์ การเติบโต ภาษี และคู่แข่ง เรียงลำดับพร้อมเหตุผล`
4. Wait, screenshot, then send slide 11's **new** prompt (no re-attaching):
   `ในตลาดอันดับ 1 ที่แนะนำมา ใครคือผู้นำเข้า/ผู้จัดจำหน่ายสินค้าหลักของฉันที่มีโอกาสมากที่สุดในตลาดนั้นรายใหญ่? ช่วยหารายชื่อบริษัท ประเภทธุรกิจ และช่องทางติดต่อที่หาได้ พร้อมแนะนำว่าควรเข้าหาอย่างไร`
5. Wait, screenshot, then send slide 13's **new** prompt: `ร่างอีเมลแนะนำสินค้าและบริษัทเราถึงผู้นำเข้ารายแรกที่แนะนำมา เป็นภาษาอังกฤษ โทนมืออาชีพ กระชับ เน้นคุณภาพ ราคา และใบรับรอง แล้วเตรียมคำตอบสำหรับคำถามที่เขาน่าจะถาม`

Save to `/tmp/multiturn_howto1_slide9.png`, `slide11.png`, `slide13.png`.

**Pass condition**: slide 11's answer names a real importer/distributor in
*whatever market slide 9 actually put at #1* (don't expect "India" — expect
whatever the real file returns, e.g. Japan), not a generic "which market do
you mean?" Slide 13's answer is a populated, specific email addressed to
that same named importer, not a `[Company Name]` placeholder.

## HOW TO 1 — หาตลาด/ผู้ซื้อ

**Slide 9** — จากไฟล์ข้อมูลส่งออกนี้ ช่วยวิเคราะห์ Top 5 ตลาดส่งออกของฉันปี 2026 — ดูจากดีมานด์ การเติบโต ภาษี และคู่แข่ง เรียงลำดับพร้อมเหตุผล
https://chatgpt.com/?q=%E0%B8%88%E0%B8%B2%E0%B8%81%E0%B9%84%E0%B8%9F%E0%B8%A5%E0%B9%8C%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%B9%E0%B8%A5%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B8%99%E0%B8%B5%E0%B9%89%20%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%A7%E0%B8%B4%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B2%E0%B8%B0%E0%B8%AB%E0%B9%8C%20Top%205%20%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%89%E0%B8%B1%E0%B8%99%E0%B8%9B%E0%B8%B5%202026%20%E2%80%94%20%E0%B8%94%E0%B8%B9%E0%B8%88%E0%B8%B2%E0%B8%81%E0%B8%94%E0%B8%B5%E0%B8%A1%E0%B8%B2%E0%B8%99%E0%B8%94%E0%B9%8C%20%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%9A%E0%B9%82%E0%B8%95%20%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%20%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%84%E0%B8%B9%E0%B9%88%E0%B9%81%E0%B8%82%E0%B9%88%E0%B8%87%20%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B8%A5%E0%B8%B3%E0%B8%94%E0%B8%B1%E0%B8%9A%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B9%80%E0%B8%AB%E0%B8%95%E0%B8%B8%E0%B8%9C%E0%B8%A5

**Slide 11** ⚠ **FIXED** (was hardcoded "ตลาดอินเดีย" — Test 2 proved the real sample file's actual #1 market is Japan, not India, so this would have asked about a market the AI never recommended; now anaphoric on whatever market turn 1 actually names) — ในตลาดอันดับ 1 ที่แนะนำมา ใครคือผู้นำเข้า/ผู้จัดจำหน่ายสินค้าหลักของฉันที่มีโอกาสมากที่สุดในตลาดนั้นรายใหญ่? ช่วยหารายชื่อบริษัท ประเภทธุรกิจ และช่องทางติดต่อที่หาได้ พร้อมแนะนำว่าควรเข้าหาอย่างไร
https://chatgpt.com/?q=%E0%B9%83%E0%B8%99%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%AD%E0%B8%B1%E0%B8%99%E0%B8%94%E0%B8%B1%E0%B8%9A%201%20%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%81%E0%B8%99%E0%B8%B0%E0%B8%99%E0%B8%B3%E0%B8%A1%E0%B8%B2%20%E0%B9%83%E0%B8%84%E0%B8%A3%E0%B8%84%E0%B8%B7%E0%B8%AD%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%99%E0%B8%B3%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%B2%2F%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%88%E0%B8%B1%E0%B8%94%E0%B8%88%E0%B8%B3%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A2%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%84%E0%B9%89%E0%B8%B2%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%89%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A1%E0%B8%B5%E0%B9%82%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%AA%E0%B8%B8%E0%B8%94%E0%B9%83%E0%B8%99%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%99%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B9%83%E0%B8%AB%E0%B8%8D%E0%B9%88%3F%20%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%8A%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97%20%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%A0%E0%B8%97%E0%B8%98%E0%B8%B8%E0%B8%A3%E0%B8%81%E0%B8%B4%E0%B8%88%20%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%8A%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B8%95%E0%B8%B4%E0%B8%94%E0%B8%95%E0%B9%88%E0%B8%AD%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AB%E0%B8%B2%E0%B9%84%E0%B8%94%E0%B9%89%20%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B9%81%E0%B8%99%E0%B8%B0%E0%B8%99%E0%B8%B3%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B8%84%E0%B8%A7%E0%B8%A3%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%84%E0%B8%A3
This QR is now **anaphoric** — it only resolves correctly as turn 2 in the same chat after slide 9's turn 1 (Top-5 markets). Capture via multi-turn replay, not standalone.

**Slide 13** ⚠ **FIXED** (was hardcoded "ITC Limited" — same root cause as slide 11; now anaphoric on whichever importer turn 2 actually names) — ร่างอีเมลแนะนำสินค้าและบริษัทเราถึงผู้นำเข้ารายแรกที่แนะนำมา เป็นภาษาอังกฤษ โทนมืออาชีพ กระชับ เน้นคุณภาพ ราคา และใบรับรอง แล้วเตรียมคำตอบสำหรับคำถามที่เขาน่าจะถาม
https://chatgpt.com/?q=%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%AD%E0%B8%B5%E0%B9%80%E0%B8%A1%E0%B8%A5%E0%B9%81%E0%B8%99%E0%B8%B0%E0%B8%99%E0%B8%B3%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%84%E0%B9%89%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97%E0%B9%80%E0%B8%A3%E0%B8%B2%E0%B8%96%E0%B8%B6%E0%B8%87%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%99%E0%B8%B3%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B9%81%E0%B8%A3%E0%B8%81%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%81%E0%B8%99%E0%B8%B0%E0%B8%99%E0%B8%B3%E0%B8%A1%E0%B8%B2%20%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2%E0%B8%AD%E0%B8%B1%E0%B8%87%E0%B8%81%E0%B8%A4%E0%B8%A9%20%E0%B9%82%E0%B8%97%E0%B8%99%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%AD%E0%B8%B2%E0%B8%8A%E0%B8%B5%E0%B8%9E%20%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B8%8A%E0%B8%B1%E0%B8%9A%20%E0%B9%80%E0%B8%99%E0%B9%89%E0%B8%99%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%9E%20%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%20%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%83%E0%B8%9A%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%A3%E0%B8%AD%E0%B8%87%20%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B9%80%E0%B8%95%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B8%84%E0%B8%B3%E0%B8%95%E0%B8%AD%E0%B8%9A%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%84%E0%B8%B3%E0%B8%96%E0%B8%B2%E0%B8%A1%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%80%E0%B8%82%E0%B8%B2%E0%B8%99%E0%B9%88%E0%B8%B2%E0%B8%88%E0%B8%B0%E0%B8%96%E0%B8%B2%E0%B8%A1
This QR is now **anaphoric** — it only resolves correctly as turn 3 in the same chat after slides 9 and 11. Capture via multi-turn replay, not standalone.

## HOW TO 2 — ภาษี/landed cost

**Slide 24** — ข้าวหอมมะลิของฉัน HS Code 1006.30.90 ราคา FOB กรุงเทพฯ $1.45/kg ถ้าส่งไปสหรัฐฯ ตอนนี้เจอภาษีนำเข้าเท่าไหร่ ช่วยคำนวณ MFN base tariff รวมกับ Reciprocal Tariff ปี 2026 พร้อมตัวอย่าง landed cost ถึงท่าเรือ Los Angeles สำหรับออเดอร์ 20,000 กิโลกรัม
https://chatgpt.com/?q=%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%AB%E0%B8%AD%E0%B8%A1%E0%B8%A1%E0%B8%B0%E0%B8%A5%E0%B8%B4%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%89%E0%B8%B1%E0%B8%99%20HS%20Code%201006.30.90%20%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%20FOB%20%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%AF%20%241.45%2Fkg%20%E0%B8%96%E0%B9%89%E0%B8%B2%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B9%84%E0%B8%9B%E0%B8%AA%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%90%E0%B8%AF%20%E0%B8%95%E0%B8%AD%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89%E0%B9%80%E0%B8%88%E0%B8%AD%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B8%99%E0%B8%B3%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B9%80%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%AB%E0%B8%A3%E0%B9%88%20%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%20MFN%20base%20tariff%20%E0%B8%A3%E0%B8%A7%E0%B8%A1%E0%B8%81%E0%B8%B1%E0%B8%9A%20Reciprocal%20Tariff%20%E0%B8%9B%E0%B8%B5%202026%20%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%A7%20landed%20cost%20%E0%B8%96%E0%B8%B6%E0%B8%87%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B8%AD%20Los%20Angeles%20%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%AD%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B9%8C%2020%2C000%20%E0%B8%81%E0%B8%B4%E0%B9%82%E0%B8%A5%E0%B8%81%E0%B8%A3%E0%B8%B1%E0%B8%A1

**Slide 26** — เปรียบเทียบ landed cost ต่อกิโลกรัมของข้าวหอมมะลิราคา FOB $1.45 ถ้าส่งไปสหรัฐฯ สหภาพยุโรป จีน อินเดีย และเวียดนาม ตลาดไหนคุ้มที่สุดเมื่อรวมภาษีนำเข้าแล้ว
https://chatgpt.com/?q=%E0%B9%80%E0%B8%9B%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%9A%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%9A%20landed%20cost%20%E0%B8%95%E0%B9%88%E0%B8%AD%E0%B8%81%E0%B8%B4%E0%B9%82%E0%B8%A5%E0%B8%81%E0%B8%A3%E0%B8%B1%E0%B8%A1%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%AB%E0%B8%AD%E0%B8%A1%E0%B8%A1%E0%B8%B0%E0%B8%A5%E0%B8%B4%E0%B8%A3%E0%B8%A2%E0%B8%B2%20FOB%20%241.45%20%E0%B8%96%E0%B9%89%E0%B8%B2%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B9%84%E0%B8%9B%E0%B8%AA%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%90%E0%B8%AF%20%E0%B8%AA%E0%B8%AB%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%A2%E0%B8%B8%E0%B9%82%E0%B8%A3%E0%B8%9B%20%E0%B8%88%E0%B8%B5%E0%B8%99%20%E0%B8%AD%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%B5%E0%B8%A2%20%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%A7%E0%B8%B5%E0%B8%A2%E0%B8%94%E0%B8%99%E0%B8%B2%E0%B8%A1%20%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B9%84%E0%B8%AB%E0%B8%99%E0%B8%84%E0%B8%B8%E0%B9%89%E0%B8%A1%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%B8%E0%B8%94%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%A3%E0%B8%A7%E0%B8%A1%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B8%99%E0%B8%B3%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7

**Slide 28** — มีสิทธิประโยชน์ทางภาษีอะไรที่ช่วยให้ส่งออกข้าวไปจีนหรืออินเดียได้ภาษี 0% บ้าง ต้องใช้เอกสารอะไร ขอที่ไหน ใช้เวลานานแค่ไหน และมีข้อควรระวังอะไรบ้าง
https://chatgpt.com/?q=%E0%B8%A1%E0%B8%B5%E0%B8%AA%E0%B8%B4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%82%E0%B8%A2%E0%B8%8A%E0%B8%99%E0%B9%8C%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B9%84%E0%B8%9B%E0%B8%88%E0%B8%B5%E0%B8%99%E0%B8%AB%E0%B8%A3%E0%B8%B7%E0%B8%AD%E0%B8%AD%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%200%25%20%E0%B8%9A%E0%B9%89%E0%B8%A7%E0%B8%87%20%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%20%E0%B8%82%E0%B8%AD%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%84%E0%B8%AB%E0%B8%99%20%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B9%80%E0%B8%A7%E0%B8%A5%E0%B8%B2%E0%B8%99%E0%B8%B2%E0%B8%99%E0%B9%81%E0%B8%84%E0%B9%88%E0%B9%84%E0%B8%AB%E0%B8%99%20%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A1%E0%B8%B5%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%84%E0%B8%A7%E0%B8%A3%E0%B8%A3%E0%B8%B0%E0%B8%A7%E0%B8%B1%E0%B8%87%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%87

**Slide 30** — สรุปทุกตลาดที่เปรียบเทียบมาเป็นตารางเดียว (ภาษี/landed cost/ข้อแนะนำ) แล้วร่างอีเมลเสนอราคาภาษาอังกฤษไปยังผู้ซื้อในเยอรมนีที่ราคา CIF Hamburg พร้อมเน้นจุดขายเรื่องใบรับรองออร์แกนิก
https://chatgpt.com/?q=%E0%B8%AA%E0%B8%A3%E0%B8%B8%E0%B8%9B%E0%B8%97%E0%B8%B8%E0%B8%81%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%80%E0%B8%9B%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%9A%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%9A%E0%B8%A1%E0%B8%B2%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B8%A7%20(%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%2Flanded%20cost%2F%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B9%81%E0%B8%99%E0%B8%B0%E0%B8%99%E0%B8%B3)%20%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%AD%E0%B8%B5%E0%B9%80%E0%B8%A1%E0%B8%A5%E0%B9%80%E0%B8%AA%E0%B8%99%E0%B8%AD%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2%E0%B8%AD%E0%B8%B1%E0%B8%87%E0%B8%81%E0%B8%A4%E0%B8%A9%E0%B9%84%E0%B8%9B%E0%B8%A2%E0%B8%B1%E0%B8%87%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B9%83%E0%B8%99%E0%B9%80%E0%B8%A2%E0%B8%AD%E0%B8%A3%E0%B8%A1%E0%B8%99%E0%B8%B5%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%20CIF%20Hamburg%20%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B9%80%E0%B8%99%E0%B9%89%E0%B8%99%E0%B8%88%E0%B8%B8%E0%B8%94%E0%B8%82%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%9A%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B9%81%E0%B8%81%E0%B8%99%E0%B8%B4%E0%B8%81

## HOW TO 3 — ร่างเอกสารส่งออก

**Slide 42** — จากข้อมูลออเดอร์นี้ (Siam Rice ขายให้ EuroFood GmbH ฮัมบูร์ก ข้าวหอมมะลิ 1,200 กระสอบ x 25kg = 30,000kg สุทธิ ลงเรือ EVER GIVEN 2 เที่ยว VOY-2026-018) ช่วยร่าง Commercial Invoice และ Packing List ฉบับสมบูรณ์ให้หน่อย ใส่เลขที่เอกสาร INV-2026-014 และ PL-2026-014
https://chatgpt.com/?q=%E0%B8%88%E0%B8%B2%E0%B8%81%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%B9%E0%B8%A5%E0%B8%AD%E0%B8%AD%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%99%E0%B8%B5%E0%B9%89%20(Siam%20Rice%20%E0%B8%82%E0%B8%B2%E0%B8%A2%E0%B9%83%E0%B8%AB%E0%B9%89%20EuroFood%20GmbH%20%E0%B8%AE%E0%B8%B1%E0%B8%A1%E0%B8%9A%E0%B8%B9%E0%B8%A3%E0%B9%8C%E0%B8%81%20%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%AB%E0%B8%AD%E0%B8%A1%E0%B8%A1%E0%B8%B0%E0%B8%A5%E0%B8%B4%201%2C200%20%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B8%AA%E0%B8%AD%E0%B8%9A%20x%2025kg%20%3D%2030%2C000kg%20%E0%B8%AA%E0%B8%B8%E0%B8%97%E0%B8%98%E0%B8%B4%20%E0%B8%A5%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B8%AD%20EVER%20GIVEN%202%20%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%A7%20VOY-2026-018)%20%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%20Commercial%20Invoice%20%E0%B9%81%E0%B8%A5%E0%B8%B0%20Packing%20List%20%E0%B8%89%E0%B8%9A%E0%B8%B1%E0%B8%9A%E0%B8%AA%E0%B8%A1%E0%B8%9A%E0%B8%B9%E0%B8%A3%E0%B8%93%E0%B9%8C%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%AD%E0%B8%A2%20%E0%B9%83%E0%B8%AA%E0%B9%88%E0%B9%80%E0%B8%A5%E0%B8%82%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%20INV-2026-014%20%E0%B9%81%E0%B8%A5%E0%B8%B0%20PL-2026-014

**Slide 44** — เอกสารส่งออกชุดนี้เป็นสินค้าข้าว/อาหารส่งไปสหภาพยุโรป ต้องเตรียมเอกสารและใบรับรองอะไรเพิ่มอีกบ้างให้ครบตามข้อกำหนดของอุตสาหกรรมอาหารและตลาดปลายทางนี้
https://chatgpt.com/?q=%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B8%8A%E0%B8%B8%E0%B8%94%E0%B8%99%E0%B8%B5%E0%B9%89%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%84%E0%B9%89%E0%B8%B2%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%2F%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B9%84%E0%B8%9B%E0%B8%AA%E0%B8%AB%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%A2%E0%B8%B8%E0%B9%82%E0%B8%A3%E0%B8%9B%20%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%95%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%83%E0%B8%9A%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B8%AD%E0%B8%B5%E0%B8%81%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B8%84%E0%B8%A3%E0%B8%9A%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%81%E0%B8%B3%E0%B8%AB%E0%B8%99%E0%B8%94%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B8%E0%B8%95%E0%B8%AA%E0%B8%B2%E0%B8%AB%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%9B%E0%B8%A5%E0%B8%B2%E0%B8%A2%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B8%99%E0%B8%B5%E0%B9%89

**Slide 46** — เอกสารชุดนี้จะส่งไปเยอรมนี ช่วยตรวจว่ามีอะไรต้องแก้เพิ่มเพื่อให้ผ่านศุลกากรสหภาพยุโรป เช่น เลข EORI ของผู้ซื้อ ประเทศแหล่งกำเนิดสินค้า การแยกน้ำหนักรายบรรทัด และพิกัดศุลกากร 8 หลัก แล้วตรวจความสอดคล้องของตัวเลขทั้งหมดอีกครั้ง
https://chatgpt.com/?q=%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%8A%E0%B8%B8%E0%B8%94%E0%B8%99%E0%B8%B5%E0%B9%89%E0%B8%88%E0%B8%B0%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B9%84%E0%B8%9B%E0%B9%80%E0%B8%A2%E0%B8%AD%E0%B8%A3%E0%B8%A1%E0%B8%99%E0%B8%B5%20%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B8%A1%E0%B8%B5%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B9%81%E0%B8%81%E0%B9%89%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B9%80%E0%B8%9E%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B8%9C%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B8%A8%E0%B8%B8%E0%B8%A5%E0%B8%81%E0%B8%B2%E0%B8%81%E0%B8%A3%E0%B8%AA%E0%B8%AB%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%A2%E0%B8%B8%E0%B9%82%E0%B8%A3%E0%B8%9B%20%E0%B9%80%E0%B8%8A%E0%B9%88%E0%B8%99%20%E0%B9%80%E0%B8%A5%E0%B8%82%20EORI%20%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%20%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B9%81%E0%B8%AB%E0%B8%A5%E0%B9%88%E0%B8%87%E0%B8%81%E0%B8%B3%E0%B9%80%E0%B8%99%E0%B8%B4%E0%B8%94%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%84%E0%B9%89%E0%B8%B2%20%E0%B8%81%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%9B%E0%B8%A5%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%AB%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%A3%E0%B8%A2%E0%B8%9A%E0%B8%A3%E0%B8%A3%E0%B8%97%E0%B8%B1%E0%B8%94%20%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9E%E0%B8%B4%E0%B8%81%E0%B8%B1%E0%B8%94%E0%B8%A8%E0%B8%B8%E0%B8%A5%E0%B8%81%E0%B8%B2%E0%B8%81%E0%B8%A3%208%20%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%20%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%AA%E0%B8%AD%E0%B8%94%E0%B8%84%E0%B8%A5%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B9%80%E0%B8%A5%E0%B8%82%E0%B8%97%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%AB%E0%B8%A1%E0%B8%94%E0%B8%AD%E0%B8%B5%E0%B8%81%E0%B8%84%E0%B8%A3%E0%B8%B1%E0%B9%89%E0%B8%87

## HOW TO 4 — อ่าน/สกัดข้อมูล + ความเสี่ยง

**Slide 56** — อ่าน Invoice ฉบับนี้ (Siam Garment Co. ขายเสื้อยืดผ้าฝ้าย HS 6109.10 5,000 ตัว ให้ Fashion Import GmbH เยอรมนี ราคา $2.50/ตัว รวม $12,500 FOB กรุงเทพฯ L/C at sight) แล้วสกัดข้อมูลสำคัญทั้งหมดออกมาเป็นรายการที่ตรวจสอบง่าย พร้อมบอกว่าแต่ละฟิลด์ตรงกันหรือไม่
https://chatgpt.com/?q=%E0%B8%AD%E0%B9%88%E0%B8%B2%E0%B8%99%20Invoice%20%E0%B8%89%E0%B8%9A%E0%B8%B1%E0%B8%9A%E0%B8%99%E0%B8%B5%E0%B9%89%20(Siam%20Garment%20Co.%20%E0%B8%82%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%AA%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%A2%E0%B8%B7%E0%B8%94%E0%B8%9C%E0%B9%89%E0%B8%B2%E0%B8%9D%E0%B9%89%E0%B8%B2%E0%B8%A2%20HS%206109.10%205%2C000%20%E0%B8%95%E0%B8%B1%E0%B8%A7%20%E0%B9%83%E0%B8%AB%E0%B9%89%20Fashion%20Import%20GmbH%20%E0%B9%80%E0%B8%A2%E0%B8%AD%E0%B8%A3%E0%B8%A1%E0%B8%99%E0%B8%B5%20%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2%20%242.50%2F%E0%B8%95%E0%B8%B1%E0%B8%A7%20%E0%B8%A3%E0%B8%A7%E0%B8%A1%20%2412%2C500%20FOB%20%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%AF%20L%2FC%20at%20sight)%20%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B8%AA%E0%B8%81%E0%B8%B1%E0%B8%94%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%B9%E0%B8%A5%E0%B8%AA%E0%B8%B3%E0%B8%84%E0%B8%B1%E0%B8%8D%E0%B8%97%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%AB%E0%B8%A1%E0%B8%94%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B8%A1%E0%B8%B2%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AA%E0%B8%AD%E0%B8%9A%E0%B8%87%E0%B9%88%E0%B8%B2%E0%B8%A2%20%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%9A%E0%B8%AD%E0%B8%81%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B9%81%E0%B8%95%E0%B9%88%E0%B8%A5%E0%B8%B0%E0%B8%9F%E0%B8%B4%E0%B8%A5%E0%B8%94%E0%B9%8C%E0%B8%95%E0%B8%A3%E0%B8%87%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B8%AB%E0%B8%A3%E0%B8%B7%E0%B8%AD%E0%B9%84%E0%B8%A1%E0%B9%88

**Slide 58** — จากข้อมูลที่สกัดมา ช่วยตรวจหาจุดเสี่ยงที่อาจทำให้สินค้าถูกกักที่ศุลกากรเยอรมนีหรือธนาคารปฏิเสธจ่ายเงินตาม L/C บอกระดับความเสี่ยงและอ้างอิงกฎที่เกี่ยวข้องด้วย
https://chatgpt.com/?q=%E0%B8%88%E0%B8%B2%E0%B8%81%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%B9%E0%B8%A5%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%81%E0%B8%B1%E0%B8%94%E0%B8%A1%E0%B8%B2%20%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%AB%E0%B8%B2%E0%B8%88%E0%B8%B8%E0%B8%94%E0%B9%80%E0%B8%AA%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%87%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AD%E0%B8%B2%E0%B8%88%E0%B8%97%E0%B8%B3%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%84%E0%B9%89%E0%B8%B2%E0%B8%96%E0%B8%B9%E0%B8%81%E0%B8%81%E0%B8%B1%E0%B8%81%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A8%E0%B8%B8%E0%B8%A5%E0%B8%81%E0%B8%B2%E0%B8%81%E0%B8%A3%E0%B9%80%E0%B8%A2%E0%B8%AD%E0%B8%A3%E0%B8%A1%E0%B8%99%E0%B8%B5%E0%B8%AB%E0%B8%A3%E0%B8%B7%E0%B8%AD%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%9B%E0%B8%8F%E0%B8%B4%E0%B9%80%E0%B8%AA%E0%B8%98%E0%B8%88%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%95%E0%B8%B2%E0%B8%A1%20L%2FC%20%E0%B8%9A%E0%B8%AD%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B8%94%E0%B8%B1%E0%B8%9A%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B9%80%E0%B8%AA%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%87%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%AD%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%AD%E0%B8%B4%E0%B8%87%E0%B8%81%E0%B8%8E%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%80%E0%B8%81%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%A7%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2

**Slide 60** — ออเดอร์นี้จะส่งไปฮัมบูร์ก ต้องเตรียมใบรับรองอะไรเพิ่มอีกบ้าง โดยเฉพาะถ้าเป็นเสื้อผ้าเด็ก และถ้าจะเปลี่ยนไปส่งสหรัฐฯ แทนต้องเตรียมอะไรต่างไปบ้าง
https://chatgpt.com/?q=%E0%B8%AD%E0%B8%AD%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%99%E0%B8%B5%E0%B9%89%E0%B8%88%E0%B8%B0%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B9%84%E0%B8%9B%E0%B8%AE%E0%B8%B1%E0%B8%A1%E0%B8%9A%E0%B8%B9%E0%B8%A3%E0%B9%8C%E0%B8%81%20%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%95%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%83%E0%B8%9A%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%88%E0%B8%A1%E0%B8%AD%E0%B8%B5%E0%B8%81%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%87%20%E0%B9%82%E0%B8%94%E0%B8%A2%E0%B9%80%E0%B8%89%E0%B8%9E%E0%B8%B2%E0%B8%B0%E0%B8%96%E0%B9%89%E0%B8%B2%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B9%80%E0%B8%AA%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%9C%E0%B9%89%E0%B8%B2%E0%B9%80%E0%B8%94%E0%B9%87%E0%B8%81%20%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%96%E0%B9%89%E0%B8%B2%E0%B8%88%E0%B8%B0%E0%B9%80%E0%B8%9B%E0%B8%A5%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%99%E0%B9%84%E0%B8%9B%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%AA%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%90%E0%B8%AF%20%E0%B9%81%E0%B8%97%E0%B8%99%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%95%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B8%95%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%84%E0%B8%9B%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%87

## HOW TO 5 — ตรวจความสอดคล้องเอกสาร

**Slide 74** — อ่านเอกสารสามชุดนี้พร้อมกัน (Invoice INV-2026-014, Packing List PL-2026-014, Sales Contract SC-2026-007 ของออเดอร์เดียวกัน) แล้วเทียบตัวเลขทุกฟิลด์ระหว่างเอกสาร ทำเป็นตารางเปรียบเทียบที่ชี้จุดตรงกันและไม่ตรงกันให้ชัดเจน
https://chatgpt.com/?q=%E0%B8%AD%E0%B9%88%E0%B8%A2%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%B2%E0%B8%A1%E0%B8%8A%E0%B8%B8%E0%B8%94%E0%B8%99%E0%B8%B5%E0%B9%89%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%81%E0%B8%B1%E0%B8%99%20(Invoice%20INV-2026-014%2C%20Packing%20List%20PL-2026-014%2C%20Sales%20Contract%20SC-2026-007%20%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%AD%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B8%A7%E0%B8%81%E0%B8%B1%E0%B8%99)%20%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%9A%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B9%80%E0%B8%A5%E0%B8%82%E0%B8%97%E0%B8%B8%E0%B8%81%E0%B8%9F%E0%B8%B4%E0%B8%A5%E0%B8%94%E0%B9%8C%E0%B8%A3%E0%B8%B0%E0%B8%AB%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%20%E0%B8%97%E0%B8%B3%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%95%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%9B%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%9A%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%9A%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%8A%E0%B8%B5%E0%B9%89%E0%B8%88%E0%B8%B8%E0%B8%94%E0%B8%95%E0%B8%A3%E0%B8%87%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B8%95%E0%B8%A3%E0%B8%87%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B8%8A%E0%B8%B1%E0%B8%94%E0%B9%80%E0%B8%88%E0%B8%99

**Slide 76** — จากความขัดแย้งที่พบ ช่วยอธิบายรายละเอียดแต่ละจุดว่าจะส่งผลอะไรตามมา อ้างอิงกฎ UCP 600 และ Incoterms 2020 ที่เกี่ยวข้อง พร้อมประเมินความเสียหายที่อาจเกิดขึ้นเป็นตัวเลข
https://chatgpt.com/?q=%E0%B8%88%E0%B8%B2%E0%B8%81%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%82%E0%B8%B1%E0%B8%94%E0%B9%81%E0%B8%A2%E0%B9%89%E0%B8%87%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9E%E0%B8%9A%20%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%AD%E0%B8%98%E0%B8%B4%E0%B8%9A%E0%B8%B2%E0%B8%A2%E0%B8%A3%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%AD%E0%B8%B5%E0%B8%A2%E0%B8%94%E0%B9%81%E0%B8%95%E0%B9%88%E0%B8%A5%E0%B8%B0%E0%B8%88%E0%B8%B8%E0%B8%94%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B8%88%E0%B8%B0%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%9C%E0%B8%A5%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%A1%E0%B8%B2%20%E0%B8%AD%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%AD%E0%B8%B4%E0%B8%87%E0%B8%81%E0%B8%8E%20UCP%20600%20%E0%B9%81%E0%B8%A5%E0%B8%B0%20Incoterms%202020%20%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%80%E0%B8%81%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%A7%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%87%20%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%A1%E0%B8%B4%E0%B8%99%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B9%80%E0%B8%AA%E0%B8%B5%E0%B8%A2%E0%B8%AB%E0%B8%B2%E0%B8%A2%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AD%E0%B8%B2%E0%B8%88%E0%B9%80%E0%B8%81%E0%B8%B4%E0%B8%94%E0%B8%82%E0%B8%B6%E0%B9%89%E0%B8%99%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B9%80%E0%B8%A5%E0%B8%82

**Slide 78** — ช่วยทำแผนปฏิบัติแก้ไขความขัดแย้งทั้งหมด แยกตามความเร่งด่วน ระบุว่าแผนกไหนต้องทำอะไรภายในกี่ชั่วโมง แล้วร่างประกาศแจ้งทีมภายในให้ด้วย
https://chatgpt.com/?q=%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%97%E0%B8%B3%E0%B9%81%E0%B8%9C%E0%B8%99%E0%B8%9B%E0%B8%8F%E0%B8%B4%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%B4%E0%B9%81%E0%B8%81%E0%B9%89%E0%B9%84%E0%B8%82%E0%B8%84%E0%B8%A7%E0%B8%A1%E0%B8%82%E0%B8%B1%E0%B8%94%E0%B9%81%E0%B8%A2%E0%B9%89%E0%B8%87%E0%B8%97%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%AB%E0%B8%A1%E0%B8%94%20%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%84%E0%B8%A7%E0%B8%A1%E0%B9%80%E0%B8%A3%E0%B9%88%E0%B8%87%E0%B8%94%E0%B9%88%E0%B8%A7%E0%B8%99%20%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%B8%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B9%81%E0%B8%9C%E0%B8%99%E0%B8%81%E0%B9%84%E0%B8%AB%E0%B8%99%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%97%E0%B8%B3%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B8%A0%E0%B8%B2%E0%B8%A2%E0%B9%83%E0%B8%99%E0%B8%81%E0%B8%B5%E0%B9%88%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%A7%E0%B9%82%E0%B8%A1%E0%B8%87%20%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B9%81%E0%B8%88%E0%B9%89%E0%B8%87%E0%B8%97%E0%B8%B5%E0%B8%A1%E0%B8%A0%E0%B8%B2%E0%B8%A2%E0%B9%83%E0%B8%99%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2

## BONUS 1 — ทีมเอเจนต์

**Slide 88** — อัปโหลดไฟล์ข้อมูลส่งออกนี้ แล้วทำงานเป็นทีมเอเจนต์ให้ครบ 6 ขั้นในคำสั่งเดียว: (1) อ่านไฟล์ข้อมูล (2) หา Top 3 ตลาด + ผู้ซื้อ (3) วิเคราะห์ภาษีและ landed cost ของตลาดที่ดีที่สุด (4) ร่าง Commercial Invoice + Packing List (5) ตรวจความสอดคล้องและกฎปลายทาง (6) สรุปเป็นแผนปฏิบัติพร้อมเอกสารแนบ
https://chatgpt.com/?q=%E0%B8%AD%E0%B8%B1%E0%B8%9B%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94%E0%B9%84%E0%B8%9F%E0%B8%A5%E0%B9%8C%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%B9%E0%B8%A5%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B8%99%E0%B8%B5%E0%B9%89%20%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B8%97%E0%B8%B3%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B8%A1%E0%B9%80%E0%B8%AD%E0%B9%80%E0%B8%88%E0%B8%99%E0%B8%95%E0%B9%8C%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B8%84%E0%B8%A3%E0%B8%9A%206%20%E0%B8%82%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B9%83%E0%B8%99%E0%B8%84%E0%B8%B3%E0%B8%AA%E0%B8%B1%E0%B9%88%E0%B8%87%E0%B9%80%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B8%A7%3A%20(1)%20%E0%B8%AD%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%84%E0%B8%9F%E0%B8%A5%E0%B9%8C%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%B9%E0%B8%A5%20(2)%20%E0%B8%AB%E0%B8%B2%20Top%203%20%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%20%2B%20%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%20(3)%20%E0%B8%A7%E0%B8%B4%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B2%E0%B8%B0%E0%B8%AB%E0%B9%8C%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%81%E0%B8%A5%E0%B8%B0%20landed%20cost%20%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%94%E0%B8%B5%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%AA%E0%B8%B8%E0%B8%94%20(4)%20%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%20Commercial%20Invoice%20%2B%20Packing%20List%20(5)%20%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%AA%E0%B8%AD%E0%B8%94%E0%B8%84%E0%B8%A5%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%81%E0%B8%8E%E0%B8%9B%E0%B8%A5%E0%B8%B2%E0%B8%A2%E0%B8%97%E0%B8%B2%E0%B8%87%20(6)%20%E0%B8%AA%E0%B8%A3%E0%B8%B8%E0%B8%9B%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B9%81%E0%B8%9C%E0%B8%99%E0%B8%9B%E0%B8%8F%E0%B8%B4%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%B4%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B9%81%E0%B8%99%E0%B8%9A

## BONUS 2 — 6 ขั้นในแชตเดียว

**Slide 97** — นี่คือข้อมูลส่งออกของฉัน ช่วยดูให้หน่อยว่ามีอะไรอยู่ในไฟล์นี้บ้าง
https://chatgpt.com/?q=%E0%B8%99%E0%B8%B5%E0%B9%88%E0%B8%84%E0%B8%B7%E0%B8%AD%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%B9%E0%B8%A5%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%89%E0%B8%B1%E0%B8%99%20%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%94%E0%B8%B9%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%AD%E0%B8%A2%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B8%A1%E0%B8%B5%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B8%AD%E0%B8%A2%E0%B8%B9%E0%B9%88%E0%B9%83%E0%B8%99%E0%B9%84%E0%B8%9F%E0%B8%A5%E0%B9%8C%E0%B8%99%E0%B8%B5%E0%B9%89%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%87

**Slide 98** — วิเคราะห์ Top 5 ตลาดส่งออกของฉันปี 2026 เรียงตามโอกาส พร้อมเหตุผล
https://chatgpt.com/?q=%E0%B8%A7%E0%B8%B4%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B2%E0%B8%B0%E0%B8%AB%E0%B9%8C%20Top%205%20%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%89%E0%B8%B1%E0%B8%99%E0%B8%9B%E0%B8%B5%202026%20%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B9%82%E0%B8%AD%E0%B8%81%E0%B8%B2%E0%B8%AA%20%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B9%80%E0%B8%AB%E0%B8%95%E0%B8%B8%E0%B8%9C%E0%B8%A5

**Slide 99** — ตลาดอันดับ 1 เจอภาษีนำเข้าเท่าไหร่ และ landed cost ต่อตันเท่าไหร่
https://chatgpt.com/?q=%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%AD%E0%B8%B1%E0%B8%99%E0%B8%94%E0%B8%B1%E0%B8%9A%201%20%E0%B9%80%E0%B8%88%E0%B8%AD%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B8%99%E0%B8%B3%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B9%80%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%AB%E0%B8%A3%E0%B9%88%20%E0%B9%81%E0%B8%A5%E0%B8%B0%20landed%20cost%20%E0%B8%95%E0%B9%88%E0%B8%AD%E0%B8%95%E0%B8%B1%E0%B8%99%E0%B9%80%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%AB%E0%B8%A3%E0%B9%88

**Slide 100** — ร่าง Commercial Invoice + Packing List สำหรับออเดอร์ไปตลาดนั้น
https://chatgpt.com/?q=%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%87%20Commercial%20Invoice%20%2B%20Packing%20List%20%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%AD%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B9%84%E0%B8%9B%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%99%E0%B8%B1%E0%B9%89%E0%B8%99

**Slide 101** — ตรวจว่าเอกสารสอดคล้องกันไหม และต้องมีใบรับรองอะไรตามกฎปลายทาง
https://chatgpt.com/?q=%E0%B8%95%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%AD%E0%B8%94%E0%B8%84%E0%B8%A5%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B9%84%E0%B8%AB%E0%B8%A1%20%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%A1%E0%B8%B5%E0%B9%83%E0%B8%9A%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%81%E0%B8%8E%E0%B8%9B%E0%B8%A5%E0%B8%B2%E0%B8%A2%E0%B8%97%E0%B8%B2%E0%B8%87

**Slide 102** — สรุปทั้งหมดเป็นแผนปฏิบัติ + checklist เอกสารที่ต้องเตรียม
https://chatgpt.com/?q=%E0%B8%AA%E0%B8%A3%E0%B8%B8%E0%B8%9B%E0%B8%97%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%AB%E0%B8%A1%E0%B8%94%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B9%81%E0%B8%9C%E0%B8%99%E0%B8%9B%E0%B8%8F%E0%B8%B4%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%B4%20%2B%20checklist%20%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%95%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%A1

---

## RESULTS SO FAR (read this before running anything else)

- **Test Case 1 (slide 30, no file, multi-turn text only) — PASS.** Confirmed
  by direct screenshot review. Real comparison table, populated quote email,
  no clarifying question. Minor defect: `tc1_slide30_PASS.png` still shows a
  sliver of the login popup top-right — **re-crop before using in the deck**,
  don't reuse as-is.
- **Test Case 2 (slides 97–102, file upload + 6-turn replay, after logging
  into ChatGPT) — PASS, with two notes.**
  1. File persistence across all 6 turns is confirmed working: turns 99–102
     chain correctly off the real file's actual top market (Japan) and top
     product (Automotive Parts), through a drafted Commercial Invoice +
     Packing List, a compliance check against those drafted documents, and a
     final Action Plan with a concrete readiness score. Nothing generic
     anywhere in that chain.
  2. Slides 97 and 98's saved screenshots are **duplicates of turn 98's
     answer** — turn 97's own distinct first response (the "what's in this
     file" answer) was never actually captured, likely a timing/off-by-one
     bug in the capture script. **Re-run just slide 97's screenshot** before
     using this set in the deck.
  3. The real sample file is multi-product (auto parts, medical gloves,
     jasmine rice, canned pineapple, tapioca starch) with **Japan** as #1
     market — not the deck's invented single-product India/rice narrative.
     ChatGPT correctly grounds answers in the real file rather than trying
     to match the deck's illustrative numbers. **If any of these screenshots
     go into the deck, the caption text needs to say Japan/Automotive Parts,
     not reuse the existing RESULTB2_* illustrative copy.**
- **Conclusion: multi-turn replay + a logged-in session is now the confirmed
  capture method** for every affected slide — no `build3.js` prompt rewrites
  needed. The one hard requirement is **being logged into ChatGPT before any
  step that attaches a file** (confirmed: the "+" attach button shows a
  login wall for anonymous sessions). This also has a live-workshop
  implication, not just a screenshot one — see the coverage matrix below.

## Coverage matrix — every HOW TO/Bonus, what it needs, what's left to do

Re-checked every `STEP*_PROMPT` constant in `build3.js` against this. Use
this table to decide what to capture next; don't re-derive it from scratch.

| Section | Slides | Needs | Status |
|---|---|---|---|
| HOW TO 1 (หาตลาด/ผู้ซื้อ) | 9, 11, 13 | File upload (turn 1) + multi-turn replay (turns 2–3) | **FIXED in `build3.js`, not yet captured.** Slides 11/13's prompts used to hardcode "ตลาดอินเดีย" / "ITC Limited" — confirmed wrong by Test 2 (the real file's actual #1 market is Japan, not India). Rewrote `STEP2_PROMPT`/`STEP3_PROMPT` to be generically anaphoric ("ตลาดอันดับ 1 ที่แนะนำมา" / "ผู้นำเข้ารายแรกที่แนะนำมา"), same style as the proven Bonus-2 prompts, and rebuilt `out3.pptx`. See **TEST CASE 1B** below for the exact capture steps with the new prompt text. Caption with whatever market/buyer the real run actually returns — don't reuse the old India/ITC illustrative copy. |
| HOW TO 2 (ภาษี/landed cost) | 24, 26, 28, 30 | Multi-turn replay, no file | **Done — Test Case 1, PASS** (pending the re-crop noted above). |
| HOW TO 3 (ร่างเอกสารส่งออก) | 42, 44, 46 | Multi-turn replay, **no file needed** — slide 42's prompt embeds the full order data as text, no attachment required | **Not tested**, but same low-risk profile as Test Case 1 (text-only continuation). Recommend running before final capture, but it's not the priority gap. |
| HOW TO 4 (อ่านเอกสารส่งออก) | 56, 58, 60 | The deck's mock step says "attach the Invoice file," but slide 56's prompt also embeds the invoice's full data as text — worth confirming whether it works via **text-only multi-turn with no real attachment** | **Not tested.** If it works without an attachment, this sidesteps the login-wall requirement entirely for this HOW TO — worth confirming specifically. |
| HOW TO 5 (ตรวจความสอดคล้อง) | 74, 76, 78 | **3 files attached simultaneously** (Invoice + Packing List + Sales Contract) + multi-turn replay, logged in | **Not tested — this is the real gap.** Test Case 2 only proved single-file persistence; multi-file-at-once hasn't been tried at all. Recommend as the next priority capture (see below). |
| BONUS 1 (ทีมเอเจนต์) | 88 | N/A for this pipeline — `MASTER_PROMPT` targets **Claude Code + VS Code**, not chatgpt.com | **Out of scope.** This QR's `chatgpt.com/?q=...` link will never reproduce the deck's described agent-team behavior, because the deck's own narrative for this slide assumes a completely different tool. Flag this to whoever owns the deck content — either drop the QR/screenshot expectation for slide 88, or rewrite the slide to point at a Claude Code walkthrough instead. |
| BONUS 2 (6 ขั้นในแชตเดียว) | 97–102 | File upload + 6-turn replay, logged in | **Done — Test Case 2, PASS** (pending the slide-97 re-capture noted above). |

### Recommended next capture session order
1. Re-crop `tc1_slide30_PASS.png` (remove popup sliver).
2. Re-capture slide 97 alone (its own distinct answer, not turn 98's).
3. Run HOW TO 5's 3-file test (new — see below for exact steps; this is the one untested multi-file scenario).
4. Run HOW TO 1 and HOW TO 3 multi-turn replays (lower priority, same proven mechanism).
5. Confirm whether HOW TO 4 works without a real file attachment (since its prompt already embeds the data as text).

## TEST CASE 4 — HOW TO 5, three files attached at once (run this next)

Everything tested so far only ever attached **one** file per chat. HOW TO 5
(slides 74–78) is different: the deck instructs attaching **three** files to
the same message at once (an Invoice, a Packing List, and a Sales Contract
for the same order, deliberately containing inconsistent numbers), then
asking ChatGPT to cross-check them. This hasn't been tried — confirm it
works the same way single-file upload did in Test Case 2.

**The three files already exist** — `deck/test_case4_files/INV-2026-014.txt`,
`PL-2026-014.txt`, `SC-2026-007.txt` (committed to the repo, branch
`claude/ai-sme-workshop-handoff-gfde4c`). Download them from:
- `https://raw.githubusercontent.com/skunpoj/krungsri/claude/ai-sme-workshop-handoff-gfde4c/deck/test_case4_files/INV-2026-014.txt`
- `https://raw.githubusercontent.com/skunpoj/krungsri/claude/ai-sme-workshop-handoff-gfde4c/deck/test_case4_files/PL-2026-014.txt`
- `https://raw.githubusercontent.com/skunpoj/krungsri/claude/ai-sme-workshop-handoff-gfde4c/deck/test_case4_files/SC-2026-007.txt`

The planted inconsistencies (don't reveal these to ChatGPT — they're the
answer key for grading the test, not part of the prompt):
- Invoice: **1,200 sacks**, FOB Bangkok, HS Code 1006.30.90, country of origin Thailand.
- Packing List: **1,180 sacks**, **29,500 kg** net weight (differs from invoice's sack count).
- Sales Contract: **CIF Hamburg** (conflicts with the invoice/packing list's FOB term), no HS code or country of origin stated.

(Plain `.txt` files with those few fields typed out — the point is testing
whether ChatGPT reads and cross-references **multiple simultaneously
attached files**, not testing real document parsing fidelity.)

Steps:
1. Open a brand-new `chatgpt.com` chat, **logged in**.
2. Attach all three files to a single message.
3. Send slide 74's prompt: `อ่านเอกสารสามชุดนี้พร้อมกัน (Invoice INV-2026-014, Packing List PL-2026-014, Sales Contract SC-2026-007 ของออเดอร์เดียวกัน) แล้วเทียบตัวเลขทุกฟิลด์ระหว่างเอกสาร ทำเป็นตารางเปรียบเทียบที่ชี้จุดตรงกันและไม่ตรงกันให้ชัดเจน`
4. Wait, screenshot, then send slide 76's prompt: `จากความขัดแย้งที่พบ ช่วยอธิบายรายละเอียดแต่ละจุดว่าจะส่งผลอะไรตามมา อ้างอิงกฎ UCP 600 และ Incoterms 2020 ที่เกี่ยวข้อง พร้อมประเมินความเสียหายที่อาจเกิดขึ้นเป็นตัวเลข`
5. Wait, screenshot, then send slide 78's prompt: `ช่วยทำแผนปฏิบัติแก้ไขความขัดแย้งทั้งหมด แยกตามความเร่งด่วน ระบุว่าแผนกไหนต้องทำอะไรภายในกี่ชั่วโมง แล้วร่างประกาศแจ้งทีมภายในให้ด้วย`

Save to `/tmp/multiturn_3files_test_slide74.png`, `slide76.png`, `slide78.png`.

**Pass condition**: slide 74's answer correctly identifies all the planted
inconsistencies (sack count, net weight, FOB vs CIF, missing HS code/origin)
across all three attached files — not just one or two files' worth of data,
which would indicate ChatGPT only actually read one attachment. Slides 76/78
should reference those specific found conflicts, not generic advice.

**If it fails** (e.g. ChatGPT only references one of the three files, or
asks "which document do you mean"), that's an important finding on its own:
it would mean multi-file simultaneous upload doesn't carry the same way
single-file upload did, and HOW TO 5 specifically would need either a
prompt rewrite (e.g. asking the user to paste all three documents' text
into one message instead of attaching files) or to stay un-screenshotted in
the deck.

## TEST CASE 3 — live form-filling on a real import/export business website

All tests above only ever exercise a ChatGPT *chat* — none of them touch a
real third-party website. This test checks a different, equally common
real-world SME workflow: **using AI to help fill in and submit an actual
form on an external website**, as part of a real import/export business
operation — e.g. requesting a freight quote, not just asking ChatGPT
questions in isolation.

**Use case chosen:** requesting an export freight quote from a real
international freight forwarder's public "Get a quote" / "Request a quote"
web form — this is a genuine, frequent step in real export operations
(booking a shipment), the form is public with no login required, and
filling it out has no real-world legal consequence as long as you **stop
before the final submit** (see safety note below).

Examples of real public quote-request forms you can use (pick whichever
loads cleanly for you — don't fight a broken page, just switch):
- Maersk: `https://www.maersk.com/quote`
- DHL Global Forwarding / DHL Express: their "Get a Quote" page under `dhl.com`
- A regional Thai freight forwarder's own "Request a Quote" contact form

**⚠️ Safety note — read before running this test:** these are real
companies' real lead-generation forms. Filling them out and clicking final
submit would send an actual business inquiry to a real freight forwarder
under a fictional company name, which is not an outcome we want. **Fill in
every field, screenshot the fully-filled form, but do NOT click the final
submit/send button.** If the site requires solving a CAPTCHA or completing
a step that effectively *is* the submit action to even see the filled
state, stop one step earlier and screenshot what you have instead.

Steps:
1. Open a new ChatGPT chat (logged in is safest, in case any step nudges toward a file action) and attach `Sample_Thai_Export_Data.xlsx` (same file as the other tests).
2. Send this prompt: `ฉันต้องขอใบเสนอราคาค่าขนส่งทางเรือ (freight quote) สำหรับส่งออกสินค้าตามไฟล์นี้ไปยังตลาดอันดับ 1 ที่คุณแนะนำ ช่วยสรุปข้อมูลที่ฟอร์มขอใบเสนอราคาของบริษัทขนส่งทั่วไปมักถาม เช่น ต้นทาง ปลายทาง น้ำหนัก/ปริมาณ ประเภทตู้คอนเทนเนอร์ Incoterm และวันที่พร้อมส่งสินค้า โดยใช้ตัวเลขจากไฟล์ของฉัน`
3. Screenshot ChatGPT's answer (the field-by-field values it suggests) — save as `/tmp/formfill_test_ai_answer.png`.
4. Open one of the real freight-forwarder quote-request URLs above in a new tab.
5. Manually fill each field on the real form using the values ChatGPT suggested in step 3 (origin port, destination, weight, container type, Incoterm, ready date, contact info — use a clearly fictional company name/email like `test@example.com` so no real company is misrepresented).
6. Screenshot the **fully-filled, not-yet-submitted** form — save as `/tmp/formfill_test_filled_form.png`.
7. **Do not click submit.** Optionally screenshot a visible "Review your request" step if the form has one and it doesn't itself constitute submission.

**Pass condition**: every field ChatGPT suggested in step 3 maps cleanly
onto an actual field that exists on the real form (no improvised fields the
form doesn't have, no real form fields left unaddressed by the AI's
suggestions), and the values are consistent with the uploaded file's actual
contents (real product, real weight/quantity, a real destination port for
whatever market the file's analysis points to).

**Report back**: pass/fail, plus a one-line note on which form you used and
whether any field's format (e.g. a dropdown with fixed options) required
you to deviate from ChatGPT's literal suggestion.
