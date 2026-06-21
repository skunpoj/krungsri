# DEMO 6 — Live Multi-Agent Capstone with Pixel Agents
### Presenter runbook (เฉพาะผู้บรรยาย)

A practical guide to running the capstone live, where the audience watches AI sub-agents
work as characters in a pixel-art office while they produce **real** export documents.

> Pixel Agents is purely **observational** — it watches Claude Code's session transcripts and
> animates a character per agent. It does not modify Claude Code. Repo:
> https://github.com/pixel-agents-hq/pixel-agents · MIT licensed.

---

## 1. Prerequisites

- **VS Code** 1.105.0 or later
- **Claude Code CLI** installed and signed in (`claude` on your PATH)
- **Pixel Agents** extension — install from the VS Code Marketplace
  (search "Pixel Agents", publisher `pablodelucca`) or Open VSX
- A **clean, empty demo folder** (e.g. `~/demo-export`) — outputs land here
- Recommended: run inside a throwaway **VM / sandbox** (your homelab is ideal) so you can
  use a permissive Claude Code config without exposing real data

---

## 2. One-time setup

1. Create and open the demo folder in VS Code: `code ~/demo-export`
2. Open the **Pixel Agents** panel (bottom panel area, next to the terminal)
3. (Optional) Click **Layout** to arrange desks/office before the talk
4. Drop the four sample PDFs into the folder if you want the "Doc Reader" agent to read a
   real file:
   - `1_Commercial_Invoice_INV-2026-014.pdf`
   - `2_Packing_List_PL-2026-014.pdf`
   - `3_Sales_Contract_SC-2026-007.pdf`
   - `4_DEMO4_Source_Commercial_Invoice_INV-TX-2026-051.pdf`

---

## 3. Run the demo

1. In the Pixel Agents panel, click **+ Agent** — this spawns a Claude Code session and its
   character (the **Orchestrator**)
2. Paste the **orchestrator master prompt** (below) into that Claude Code session
3. As the orchestrator uses the **Task tool**, each sub-agent appears as its own character
   linked to the parent — the audience watches all five work
4. The **Doc Drafter** writes real files (`invoice.md`, `packing_list.md`, …) into the folder
   — open them live to show tangible output

### Orchestrator master prompt (paste into Claude Code)

```
You are the Orchestrator for a Thai SME export workflow. Product: [PRODUCT], target
region: [REGION]. Plan the work, then use the Task tool to launch FIVE sub-agents, one per
role, and coordinate their results. Save all outputs as files in the current folder.

1) Market Scout  — web-search the 3 best export markets + likely buyers for the product.
                   Write findings to market.md
2) Tariff Analyst — web-search current import tariffs + estimate landed cost per market.
                   Write tariffs.md
3) Doc Drafter   — from the chosen market, draft a Commercial Invoice and a matching
                   Packing List. Write invoice.md and packing_list.md (keep them consistent).
4) Doc Reader    — read any uploaded PDF in the folder and extract key fields to extract.md
5) Compliance    — check the drafted docs against Incoterms 2020 / UCP 600 and destination
                   rules; write a discrepancy + checklist report to compliance.md

After all sub-agents finish, write a final summary.md tying market + cost + documents +
compliance into one action plan. Flag anything a human must verify before real use.
```

> Tip: keep `[PRODUCT]` / `[REGION]` filled in before you present so it runs end-to-end
> without pausing for input. Rice→EU or garments→USA both work well with the sample PDFs.

---

## 4. Stage tips & safety

- **Rehearse the exact run** the day before — same folder, same prompt, same model.
- **Record a fallback screen capture** of a clean run. If the live run desyncs or the network
  is slow, play the recording and narrate.
- **Status detection is heuristic** — characters may briefly show the wrong state or miss a
  transition. Don't rely on perfect timing; talk over it.
- **Agent–terminal sync** can desync if terminals open/close rapidly — avoid spawning/killing
  agents mid-demo.
- **Do NOT use `--dangerously-skip-permissions`** on a machine with access to real data. If you
  want an uninterrupted run, do it inside a sandbox/VM with nothing sensitive mounted.
- Have the **four sample PDFs** and the **slide deck** open in other windows for quick cuts.

---

## 5. How it maps to the slides

| Slide | Live equivalent |
|-------|-----------------|
| DEMO 6 architecture (Orchestrator + 5 agents) | the running office: orchestrator spawns 5 characters |
| Master Prompt slide | the prompt you paste into Claude Code |
| OUTPUT bar (market + cost + docs + compliance) | the `.md` files produced in the demo folder |

The point for the audience: the same five capabilities they tried one-by-one in Demos 1–5
can run together, on their behalf, from a single instruction.
