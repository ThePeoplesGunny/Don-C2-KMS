# DoN C2 KMS

**Department of the Navy — Command & Control Knowledge Management System**

> **NOTIONAL — FOR TRAINING AND DEMONSTRATION PURPOSES ONLY**

An interactive, offline-capable application for visualizing the Department of the Navy's command and control structure, authority relationships, and organizational hierarchy from National Command Authority through all echelons.

## Quick Start

1. **Extract** the project folder (do not open directly from a `.zip`)
2. Open **`don-c2-kms-v7.1.html`** in any modern browser
3. No server, build tools, or internet connection required

### Required Folder Structure

```
don-c2-kms/
  don-c2-kms-v7.1.html   <- open this
  data/kms-data.js
  lib/
  fonts/
```

All files must remain in the same directory structure for the application to load correctly.

## Features

- **Organizational Charts** — 11 preset views (Strategic, OSD, DoN, Navy Admin, USMC Admin, Geographic COCOMs, Functional COCOMs, DACO/Cyber, Acquisition, Technical Authority, MALS Detail) plus a custom chart builder
- **Authority Visualization** — 7 authority line types: COCOM, ADCON, OPCON, TACON, DACO/Cyber, Technical Authority, and LCSP Return
- **Geographic Map** — 100+ geolocated nodes with Area of Responsibility overlays (fully offline via D3 geo + TopoJSON)
- **Directives Library** — 20+ sourced OPNAVINSTs and statutes with full reference linking
- **Timeline** — Chronological view of command structure changes and milestones
- **Data Registry** — Audit table of all registered documents with validation
- **Custom Charts** — Build ad-hoc org views by selecting nodes
- **Document Management** — Add, edit, and delete user directives (persisted in localStorage)
- **Export** — PNG chart export, data file export
- **Offline Operation** — Fully functional without internet

## Data

All organizational data lives in `data/kms-data.js` (v7.1):

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
| App Shell | Single-file HTML5 |
| Visualization | D3.js v7 |
| Mapping | D3 geo + TopoJSON (offline) |
| Styling | Inline CSS (dark theme) |
| Persistence | localStorage |
| Fonts | IBM Plex Sans, Rajdhani, Space Mono (bundled WOFF2) |

No frameworks, no build step, no server — vanilla HTML/CSS/JS designed for maximum portability.

## Browser Support

Any modern browser with ES6 and SVG support (Chrome, Edge, Firefox, Safari). localStorage must be available for user document persistence.

## Classification

This system is **UNCLASSIFIED** and marked **NOTIONAL**. All organizational relationships are for training and demonstration purposes only. Do not use as an authoritative source for operational command relationships.

## License

See repository for license details.
