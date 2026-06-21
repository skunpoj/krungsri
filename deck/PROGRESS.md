# v22 "Follow-Along Manual" — progress notes

## Done
- `deck/build3.js`: new template set per REDESIGN_SPEC.md:
  - `howToOpenSlide` — opening summary (objective / scenario / problem / AI task / expected outcome)
  - `docStorySlide` — one example document per page, narrated
  - `actionStepSlide` — one literal action per page (open browser, click "+", attach file, see upload confirm, type+QR, etc.) — supports `kind:"qr"` (prompt+QR side by side) and `kind:"mock"` (big UI mock + instruction)
  - `resultSlide` — AI answer as a flowing essay paragraph, large type (15-16pt), one page per result
  - `closingSlide` — recap page per HOW TO
- HOW TO 1 fully built as the prototype: 13 pages (open → doc story → 7 action steps → 3 essay results → closing).
  AI essay answers (RESULT1/2/3 in build3.js) are rewritten in flowing-paragraph Thai, expanding the bullet content
  from `inject_rich.py` RICH[(1,1)], RICH[(1,2)], RICH[(1,3)].
- Run: `cd deck && npm install && node build3.js` → writes `out3.pptx`. Confirmed it builds without errors.
- `npx soffice --headless --convert-to pdf` failed in this sandbox (LO env issue) — not yet visually QA'd. Re-check
  PDF conversion before treating HOW TO 1 as final; should also screenshot/zoom to confirm font sizes read as "ใหญ่"
  on an actual slide render, not just by fontSize number.

## Outstanding (per latest feedback from skunpojt)
User confirmed direction but wants this carried further before final review:
- Expand to **all 5 HOW TO + 2 Bonus**, same templates, and report the final total page count (target: see how
  close to 100 pages the full treatment lands).
- Keep one-action-per-page strict (no combining steps) — already the pattern in build3.js, continue it.
- Each HOW TO needs the same 4-part shape: open/objective page → doc-story page(s) → step-by-step action pages
  (every click, in order, QR usage made explicit about which QR to scan when) → essay-style result page(s).
- Essay results should stay full paragraphs, not bullets — reuse the *information* in `inject_rich.py` RICH dict
  (16 entries covering HOW TO 1-5) but rewrite each into flowing narrative form, expanding rather than condensing.

## Next steps for continuation
1. Repeat the HOW TO 1 pattern for HOW TO 2 (tariff/landed cost), 3 (generate Packing List), 4 (read/extract
   Invoice), 5 (cross-doc consistency check) using `RICH[(2,*)]` … `RICH[(5,*)]` from
   `handoff/01_source_code/inject_rich.py` as the source material for essay rewrites.
2. Add Bonus 1 (multi-agent secretary / Pixel Agents) and Bonus 2 (single-chat full pipeline) using the same
   open/doc/step/result shape — source content in `build2.js` (`archSlide`, `masterPromptSlide`,
   `bonus2TutorialSlide`, `pipelineSlide`).
3. Source documents for doc-story pages for HOW TO 3/4/5 are in `handoff/02_documents_assets/` (8 PDFs/xlsx,
   includes Hard Case 8 planted discrepancies, Medical Device, Natural Rubber — spec says use the complex set,
   not just the rice example used in build2.js mocks).
4. After full build, convert to PDF and report final page count; check LibreOffice conversion works in that
   environment (it failed here, may need different soffice flags or a fresh profile dir).
