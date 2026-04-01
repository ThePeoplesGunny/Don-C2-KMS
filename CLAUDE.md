# DoN C2 KMS — Claude Code Instructions

## What this project is

A browser-based application (vanilla HTML/JS/CSS) that visualizes Department of the Navy command & control organizational structures, authority relationships, and legal grounding. Uses D3.js for org charts. Opens directly from `file://` — no server, no installer, no build toolchain required for end users.

**UNCLASSIFIED / NOTIONAL** — for training and demonstration purposes.

## Commands

```bash
npm test           # Data integrity validator (node tests/validate-data.js)
npm run validate   # Same as above
```

Requires Node.js for validation only. End users just open `web/index.html` in a browser.

## Project layout

```
don-c2-kms/
  web/
    index.html              # App entry point — open in browser
    app.js                  # All rendering, UI, interaction logic (~1436 lines)
    app.css                 # Dark theme styles (Navy Design Guide aligned)
    data/
      kms-data.js           # ALL organizational data (nodes, auth, views, docs, timeline)
    lib/
      d3.v7.min.js          # D3.js (only vendored library)
    fonts/                  # IBM Plex Sans, Rajdhani, Space Mono (WOFF2)
  tests/
    validate-data.js        # Data integrity checks — run after any data change
  tools/
    normalize-auth.js       # Authority chain normalization utility
  .claude/
    agents/                 # 5 configured agents (architect, authority-researcher, etc.)
```

## Data file: web/data/kms-data.js

This is the single source of truth for all organizational data. It declares `const KMS_DATA = {...}` loaded via script tag.

### Schema

```
KMS_DATA = {
  version: string,
  lastModified: string (YYYY-MM-DD),
  config: {
    svc:     { [svcKey]: { fill, stroke, text } },  // Service branch colors
    acol:    { [authType]: color },                   // Authority line colors
    adsh:    { [authType]: dashPattern|null },         // Authority line dash patterns
    aw:      { [authType]: lineWeight },               // Authority line weights
    aor_col: { [cocomName]: color }                    // COCOM AOR overlay colors
  },
  nodes: {
    [nodeId]: {
      lbl:     string,          // Display label (e.g. "NAVAIR")
      sub:     string,          // Subtitle (e.g. "Naval Air Systems Command")
      billet:  string,          // Billet description
      svc:     string,          // Service key (navy, usmc, joint, civ, cyber, acq, etc.)
      uic:     string,          // Unit Identification Code
      puc:     string|null,     // Parent UIC
      loc: {
        install: string,        // Installation name
        city:    string,
        lat:     number,
        lon:     number,
        aor:     string         // COCOM AOR name
      }
    }
  },
  auth: {
    [nodeId]: {
      opcon:  [nodeId],         // Immediate OPCON parent only (chain computed at runtime)
      adcon:  [nodeId],         // Immediate ADCON parent only (chain computed at runtime)
      daco:   [nodeId],         // Immediate DACO parent only (chain computed at runtime)
      ta:     [nodeId, ...],    // Technical authority sources (peer list, NOT a chain)
      lcsp:   [nodeId, ...],    // LCSP data return targets (peer list, NOT a chain)
      aa:     [nodeId, ...],    // Administrative authority sources (peer list, NOT a chain)
      mte:    nodeId|null       // Manning/training entity
    }
  },
  views: {
    [viewId]: {
      label:   string,          // Display name
      ids:     [nodeId, ...],   // Nodes in this view
      pos:     { [nodeId]: [x, y] },  // Pixel positions
      dh_map:  { [nodeId]: string }   // Display hierarchy overrides (optional)
    }
  },
  documents: [
    { id, number, title, date, type, summary, affects: [nodeId, ...] }
  ],
  timeline: [
    { year, title, body, tags: [...], nodes: [nodeId, ...] }
  ]
}
```

### Authority types

| Key    | Full Name                  | Legal Basis                      |
|--------|----------------------------|----------------------------------|
| cocom  | Combatant Command          | 10 USC § 164                     |
| adcon  | Administrative Control     | JP 1, SECNAVINST 5400.15D       |
| opcon  | Operational Control        | 10 USC § 164, JP 1              |
| tacon  | Tactical Control           | JP 1                             |
| cyber  | DACO / Cyber               | DoDI 8530.01, FRAGORD            |
| ta     | Technical Authority        | 10 USC § 4324, OPNAVINST 5400   |
| lcsp   | LCSP Data Return           | 10 USC § 4324(b)(1)(G-I)        |
| align  | Alignment                  | Various                          |
| nca    | National Command Authority | Art. II Constitution, 10 USC    |
| dac    | Direct Authority Chain     | Various                          |
| aa     | Administrative Authority   | 10 USC § 8013                    |

## Rules for data changes

1. **Run `npm test` after every data edit.** The validator catches orphaned references, missing fields, invalid coordinates, and duplicate IDs.
2. **Every authority relationship must trace to a specific legal authority** — Constitution, Title 10, DoD Directive, DoN instruction, or joint publication. No "it's just how it works" entries.
3. **Node IDs are lowercase, no spaces** — use short recognizable abbreviations (e.g. `navair`, `pma261`, `mals16`).
4. **Views must have positions for all their nodes.** The validator will warn on missing positions.
5. **Do not modify app.js rendering logic when asked to change data.** Data changes go in `kms-data.js` only.

## Rules for code changes

1. **Do not add frameworks, bundlers, or build tools.** The frontend is intentionally vanilla JS/CSS/HTML.
2. **Preserve the offline-first / file:// design.** No CDN links, no fetch() to external services, no server dependencies.
3. **All changes go to GitHub** — local is for testing and backup only.
4. **Classification banner must remain visible** — top of index.html.
5. **Colors must align with official Navy Digital Palette** — Navy Blue #022a3a, Blue #0076a9, Yellow #e8b00f.
6. **Minimum font size is 9px.** No sub-9px text anywhere in the application. WCAG 4.5:1 contrast minimum.
7. **Data maintenance via SNDL review** — no runtime add/edit/delete of nodes. Changes go through kms-data.js directly.
8. **Authority chains are normalized** — opcon/adcon/daco store immediate parent only. Use `resolveChain(nodeId, key)` to compute full chains. ta/lcsp/aa are peer arrays, not chains.

## GitHub

- Repo: `ThePeoplesGunny/Don-C2-KMS`
- All changes should be committed and pushed to GitHub as the source of truth.
