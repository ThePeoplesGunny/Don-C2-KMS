# DoN C2 KMS v1.0

**Department of the Navy — Command & Control Knowledge Management System**

> **NOTIONAL — FOR TRAINING AND DEMONSTRATION PURPOSES ONLY**

A desktop application for visualizing the Department of the Navy's command and control structure, authority relationships, and organizational hierarchy from National Command Authority through all echelons.

## Quick Start

### Run the application
Double-click **`app.exe`** — no installer or dependencies required.

### Development
```bash
npm install
npm run dev       # Launch in dev mode
npm run build     # Build production executable
npm test          # Run data integrity tests
```

Requires [Node.js](https://nodejs.org/) and [Rust](https://rustup.rs/) for development builds.

## Project Structure

```
don-c2-kms/
  web/                  <- Frontend (HTML/CSS/JS)
    index.html          <- App entry point
    app.css             <- Styles
    app.js              <- Application logic
    data/
      kms-data.js       <- Organizational data
      planet-z6.pmtiles <- Offline map tiles (zoom 0-6)
      dark-style.json   <- Map style
    lib/                <- D3, MapLibre GL, PMTiles
    fonts/              <- Bundled WOFF2 fonts
    sprites/            <- Map sprite assets
  src-tauri/            <- Tauri desktop shell (Rust)
  tests/                <- Data integrity tests
```

## Features

- **Organizational Charts** — 11 preset views plus a custom chart builder
- **Authority Visualization** — 7 authority line types: COCOM, ADCON, OPCON, TACON, DACO/Cyber, Technical Authority, LCSP Return
- **Geographic Map** — MapLibre GL + PMTiles dark vector basemap, fully offline, with AOR overlays and node markers
- **Directives Library** — 20+ sourced OPNAVINSTs and statutes with full reference linking
- **Timeline** — Chronological view of command structure changes and milestones
- **Data Registry** — Audit table of all registered documents with validation
- **Custom Charts** — Build ad-hoc org views by selecting nodes
- **Document Management** — Add, edit, and delete user directives (persisted in localStorage)
- **Export** — PNG chart export, data file export
- **Fully Offline** — No internet connection required

## Data

All organizational data lives in `web/data/kms-data.js`:

- **140+** organizational nodes from POTUS through squadron level
- **300+** authority relationship entries
- **11** preset organizational chart views
- **20+** regulatory documents (OPNAVINSTs, statutes)
- **30+** timeline events

Data is sourced from:
- OPNAVINST 5400.45A (SNDL)
- OPNAVINST 5440.77C
- OPNAVINST 5450.350B / 5450.352B
- COMNAVAIRFORINST 4790.2E (NAMP)
- Title 10, U.S. Code

## Technology

| Component | Technology |
|-----------|-----------|
| Desktop Shell | Tauri v2 (Rust + WebView) |
| Org Charts | D3.js v7 |
| Map | MapLibre GL JS + PMTiles (Protomaps dark) |
| Styling | CSS (dark theme) |
| Persistence | localStorage |
| Fonts | IBM Plex Sans, Rajdhani, Space Mono (bundled WOFF2) |

## Classification

This system is **UNCLASSIFIED** and marked **NOTIONAL**. All organizational relationships are for training and demonstration purposes only. Do not use as an authoritative source for operational command relationships.

## Legacy

The `web/` directory contains the original v7.1 single-file web application preserved for reference. The v1.0 release marks the transition to a Tauri desktop application.

## License

See repository for license details.
