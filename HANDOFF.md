# HANDOFF — AI for SME Export/Import Workshop Deck (v22)

This file is the single entry point for any future Claude Code session (local
or remote) to pick up this project with full context, without needing to
re-read this chat. Read this file first, then dive into the referenced files.

## Repo / branch

- Repo: `skunpoj/krungsri`
- Branch: `claude/ai-sme-workshop-handoff-gfde4c`
- Latest relevant commits (newest first):
  - `8e9dc48` — Expand v22 deck to full 84 slides (HOW TO 1-5 + Bonus 1-2)
  - `cdf0627` — Add HOW TO 1 prototype pptx build artifact
  - `5045a8d` — Add handoff package and v22 deck prototype (HOW TO 1)

## What this project is

A Thai-language workshop deck teaching SME export/import companies how to use
AI (ChatGPT / Claude Code) for five concrete tasks ("HOW TO 1–5") plus two
"Bonus" advanced workflows. The deck exists in two generations:

1. **v21 (old, summary-deck style)** — `handoff/03_latest_deck/AI_SME_Prompts_Handout_TH_v21.pptx`
   and its source `handoff/01_source_code/build2.js`. Dense, bullet/table
   style, multiple steps per slide. This is the *original* deck that was
   redesigned.
2. **v22 (current, "Follow-Along Manual" style)** — `deck/build3.js` →
   `deck/out3.pptx`. **This is the deck to keep building on.** Rewritten per
   `handoff/REDESIGN_SPEC.md`: one literal action per page, maximum font
   size, AI answers written as flowing essay paragraphs (not bullets), QR
   codes on every prompt step linking straight into a pre-filled ChatGPT
   chat.

## Current state of v22 (as of this handoff)

`deck/out3.pptx` has **104 slides**, fully covering all 5 HOW TOs + both Bonus
sections, each following the same structure:

1. **Opening/objective slide** (`howToOpenSlide`) — วัตถุประสงค์ / สถานการณ์ /
   ปัญหา / ให้ AI ทำอะไร / ผลลัพธ์ที่คาดหวัง
2. **Document/data story slide** (`docStorySlide`) — one example
   document/file per page, narrated as a short story with stat callouts
3. **File preview slide(s)** (`filePreviewSlide`) — a literal content
   preview (table-style rows) of the actual input file used in that
   chapter, one preview per source file (chapters with multiple source
   documents, e.g. HOW TO 3 and HOW TO 5, get one preview slide per file).
4. **File download-link slide(s)** (`fileLinkSlide`) — a large QR code +
   filename + description + raw URL, pointing straight at the real file
   committed in this repo (via `raw.githubusercontent.com`), so the
   audience can download the exact file used in that chapter to practice
   with. Always paired 1:1 with a preceding `filePreviewSlide`, never
   combined onto the same slide.
5. **Step-by-step action slides** (`actionStepSlide`) — one literal
   click/action per page (open browser → click "+" → attach file → wait for
   upload → type prompt / scan QR → send). Never combines multiple steps.
6. **Result slides** (`resultSlide`) — the AI's answer written as a full Thai
   essay paragraph (not bullets), large font, one logical result per page.

Each chapter ends with a `closingSlide` recap pointing to the next chapter.

Page breakdown:

| Chapter | Slides | Topic | File preview/link source(s) |
|---|---|---|---|
| HOW TO 1 | 15 | Find markets & buyers | `deck/Sample_Thai_Export_Data.xlsx` |
| HOW TO 2 | 17 | Tariffs & landed cost | `deck/Sample_Thai_Export_Data.xlsx` (reused) |
| HOW TO 3 | 16 | Generate export documents | `A1_MultiProduct_Invoice...pdf` + `A2_MultiProduct_PackingList...pdf` |
| HOW TO 4 | 14 | Read/extract + compliance risk | `B1_HardCase_Invoice_INV-2026-LC-099.pdf` |
| HOW TO 5 | 18 | Cross-document consistency check | `B1` Invoice + `B2` Packing List + `B3` Sales Contract (3 files) |
| Bonus 1 | 8 | Multi-agent "AI secretary" (Claude Code + Pixel Agents) | `deck/Sample_Thai_Export_Data.xlsx` (reused) |
| Bonus 2 | 16 | Same 6-step pipeline, single ChatGPT chat, no tooling install | `deck/Sample_Thai_Export_Data.xlsx` (reused) |
| **Total** | **104** | | |

Every QR in a `fileLinkSlide` points to a `raw.githubusercontent.com` URL on
branch `claude/ai-sme-workshop-handoff-gfde4c`, built via the `rawUrl(path)`
helper in `build3.js` — distinct from the prompt-QR codes (`qrPng`/`qrPngUrl`
against `chatgpt.com/?q=...`) used on `actionStepSlide`s. Page count is
driven by how many genuinely distinct source files + AI prompts each topic
needs, not padding — nothing was combined to hit a number.

All narrative content (the essay-style "AI ตอบ ..." result slides) was
manually rewritten from the bullet/table-style `RICH` dict in
`handoff/01_source_code/inject_rich.py` into flowing Thai prose, per explicit
user instruction. The underlying facts (HS codes, tariff %, landed-cost
numbers, FTA forms, document checklists, risk findings) are unchanged from
the original `RICH` dict — only the *form* changed, not the *content*.

## Key files

| Path | Purpose |
|---|---|
| `deck/build3.js` | **Main v22 deck source.** Run `node build3.js` from `deck/` to rebuild `out3.pptx`. Self-contained: palette `P`, 4 templates, 7 chapter builder functions, final IIFE that calls them in order and reports `pres.slides.length`. |
| `deck/out3.pptx` | Built v22 deck artifact (84 slides), committed to repo |
| `deck/icons.js` | `buildIcons(P)` — generates rasterized icon PNGs via react-icons/sharp |
| `deck/Sample_Thai_Export_Data.xlsx` | Sample export-data spreadsheet referenced throughout HOW TO 1 and Bonus 2 |
| `handoff/REDESIGN_SPEC.md` | The original design spec this whole v22 rewrite follows |
| `handoff/01_source_code/inject_rich.py` | Source of truth for all factual content (`RICH` dict, keyed by `(howto_num, step_num)`) |
| `handoff/01_source_code/build2.js` | v21 (old) deck source — kept for reference / DEMO config / Bonus section content |
| `handoff/03_latest_deck/AI_SME_Prompts_Handout_TH_v21.pptx` | v21 (old) built deck, for comparison |

## Known limitation: no PDF in this sandbox

LibreOffice's `soffice --headless --convert-to pdf` is **broken in this
sandbox environment**, confirmed via isolation testing (fails identically on
the real deck, a trivial python-pptx-generated file, and even a plain
`.txt` file — proving it's an environment defect, not a file problem).

Alternatives investigated this session:
- `aspose-slides` (Python) — installs fine, but its .NET runtime needs
  OpenSSL 1.1, which Ubuntu 24.04 no longer ships (only OpenSSL 3, ABI
  incompatible, symlink hack doesn't work — `ERR_put_error` symbol missing).
- `Spire.Presentation` (Python) — **works**, but the unlicensed/free build
  silently caps output at the first 10 slides (no error, no watermark
  warning — just truncates). Confirmed via PyMuPDF page count. Would produce
  a full PDF if a license key is supplied.

**Resolution**: deliver `.pptx` only; user converts to PDF locally via
PowerPoint / Google Slides / LibreOffice Impress on their own machine (no
sandbox restrictions there).

If a future session needs a PDF and has no license key, re-check whether
poppler-utils, a different OpenSSL-independent renderer, or a licensed
Aspose/Spire key is available before re-attempting LibreOffice (already
proven broken — don't re-debug it without new evidence the environment
changed).

## How to continue this work in a fresh session

1. Read this file (`HANDOFF.md`) first.
2. Read `handoff/REDESIGN_SPEC.md` for the full design rules (one
   action/page, max font, essay-style results, etc.) if making further
   content changes.
3. Read `deck/build3.js` in full — it's self-documenting; the 4 templates
   and 7 `buildHowToN()`/`buildBonusN()` functions are the whole system.
4. To rebuild after any edit: `cd deck && node build3.js` — it logs
   `WROTE out3.pptx — total slides: N`. Validate slide count/content
   independently via `python3 -c "from pptx import Presentation; ..."` if
   needed (don't trust manual page-counters inside the builder functions —
   they're informational only, not the source of truth; `pres.slides.length`
   is authoritative).
5. Commit `deck/build3.js` and `deck/out3.pptx` together; push to
   `claude/ai-sme-workshop-handoff-gfde4c`.

## On cross-session memory

This chat's conversation history is not retained automatically across
sessions (local CLI or remote/web), there is no shared memory store. This
`HANDOFF.md`, the commit history, and the code itself are the durable record
— any new session (local, via remote-control, or web) should be pointed at
this repo/branch and told to read this file to reconstruct full context.
