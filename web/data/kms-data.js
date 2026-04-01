// DoN C2 KMS — Organizational Data v8.1
// Authority chains normalized to immediate parent (opcon/adcon/daco)
// ta/lcsp/aa remain as peer relationship arrays
// Generated: 2026-04-01
const KMS_DATA = {
 "version": "8.5",
 "lastModified": "2026-03-31",
 "config": {
  "svc": {
   "navy": {
    "fill": "#022a3a",
    "stroke": "#0076a9",
    "text": "#8abbff"
   },
   "usmc": {
    "fill": "#1e0a0a",
    "stroke": "#a02020",
    "text": "#ff9988"
   },
   "army": {
    "fill": "#101408",
    "stroke": "#5a6a1a",
    "text": "#d0c860"
   },
   "airforce": {
    "fill": "#080e20",
    "stroke": "#1438a0",
    "text": "#aabbee"
   },
   "spaceforce": {
    "fill": "#0c0e1e",
    "stroke": "#2838a0",
    "text": "#99aadd"
   },
   "coastguard": {
    "fill": "#080e1a",
    "stroke": "#1430a0",
    "text": "#5588cc"
   },
   "civ": {
    "fill": "#140f28",
    "stroke": "#3a2a78",
    "text": "#bb99ee"
   },
   "joint": {
    "fill": "#091a09",
    "stroke": "#225a22",
    "text": "#88dd88"
   },
   "cyber": {
    "fill": "#001a1a",
    "stroke": "#008080",
    "text": "#22dddd"
   },
   "acq": {
    "fill": "#0a1828",
    "stroke": "#0076a9",
    "text": "#99bbdd"
   }
  },
  "acol": {
   "cocom": "#e8b00f",
   "adcon": "#0096cc",
   "opcon": "#ff7733",
   "tacon": "#ff3355",
   "cyber": "#00cccc",
   "ta": "#dd44bb",
   "lcsp": "#6a9900",
   "align": "#cc8800",
   "nca": "#e8b00f",
   "dac": "#b07cd8",
   "aa": "#e05599"
  },
  "adsh": {
   "cocom": null,
   "adcon": "6,3",
   "opcon": "3,3",
   "tacon": "2,4",
   "cyber": "4,2",
   "ta": "9,3,2,3",
   "lcsp": "8,4",
   "align": "5,3",
   "nca": null,
   "dac": null,
   "aa": "4,2,2,2"
  },
  "aw": {
   "cocom": 2.5,
   "adcon": 1.8,
   "opcon": 1.8,
   "tacon": 1.3,
   "cyber": 2.2,
   "ta": 1.8,
   "lcsp": 1.1,
   "align": 1.2,
   "nca": 3,
   "dac": 2.2,
   "aa": 1.8
  },
  "aor_col": {
   "NORTHCOM": "#3366cc",
   "SOUTHCOM": "#228833",
   "EUCOM": "#8833cc",
   "CENTCOM": "#cc8833",
   "AFRICOM": "#cc6644",
   "INDOPACOM": "#3388aa",
   "GLOBAL": "#666688"
  }
 },
 "nodes": {
  "potus": {
   "lbl": "PRESIDENT",
   "sub": "Commander in Chief / NCA",
   "billet": "",
   "svc": "civ",
   "uic": "WH00001",
   "puc": null,
   "loc": {
    "install": "White House",
    "city": "Washington, DC",
    "lat": 38.8977,
    "lon": -77.0365,
    "aor": "GLOBAL"
   },
   "id": "potus"
  },
  "secdef": {
   "lbl": "SECDEF",
   "sub": "Secretary of Defense",
   "billet": "OSD Echelon I",
   "svc": "civ",
   "uic": "OD00001",
   "puc": "WH00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "secdef"
  },
  "depsecdef": {
   "lbl": "DEPSECDEF",
   "sub": "Deputy Secretary of Defense",
   "billet": "OSD Echelon I",
   "svc": "civ",
   "uic": "OD00002",
   "puc": "OD00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "depsecdef"
  },
  "cjcs": {
   "lbl": "CJCS",
   "sub": "Chairman, Joint Chiefs of Staff",
   "billet": "4-Star Gn/ADM",
   "svc": "joint",
   "uic": "JC00001",
   "puc": "OD00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "cjcs"
  },
  "vcjcs": {
   "lbl": "VCJCS",
   "sub": "Vice Chairman, Joint Chiefs",
   "billet": "4-Star Gn/ADM",
   "svc": "joint",
   "uic": "JC00002",
   "puc": "JC00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "vcjcs"
  },
  "usd_as": {
   "lbl": "USD(A&S)",
   "sub": "Under Sec — Acquisition & Sustainment",
   "billet": "OSD Echelon II",
   "svc": "civ",
   "uic": "OD00010",
   "puc": "OD00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "usd_as"
  },
  "usd_re": {
   "lbl": "USD(R&E)",
   "sub": "Under Sec — Research & Engineering",
   "billet": "OSD Echelon II",
   "svc": "civ",
   "uic": "OD00011",
   "puc": "OD00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "usd_re"
  },
  "usd_p": {
   "lbl": "USD(P)",
   "sub": "Under Secretary — Policy",
   "billet": "OSD Echelon II",
   "svc": "civ",
   "uic": "OD00012",
   "puc": "OD00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "usd_p"
  },
  "usd_is": {
   "lbl": "USD(I&S)",
   "sub": "Under Sec — Intelligence & Security",
   "billet": "OSD Echelon II",
   "svc": "civ",
   "uic": "OD00013",
   "puc": "OD00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "usd_is"
  },
  "usd_comp": {
   "lbl": "USD(C/CFO)",
   "sub": "Under Sec — Comptroller/CFO",
   "billet": "OSD Echelon II",
   "svc": "civ",
   "uic": "OD00014",
   "puc": "OD00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "usd_comp"
  },
  "usd_pr": {
   "lbl": "USD(P&R)",
   "sub": "Under Sec — Personnel & Readiness",
   "billet": "OSD Echelon II",
   "svc": "civ",
   "uic": "OD00015",
   "puc": "OD00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "usd_pr"
  },
  "pca": {
   "lbl": "PCA",
   "sub": "Principal Cyber Advisor (SECDEF)",
   "billet": "SES/Flag",
   "svc": "cyber",
   "uic": "OD00020",
   "puc": "OD00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "pca"
  },
  "asd_ncbdp": {
   "lbl": "ASD(NCB)",
   "sub": "ASD — Nuclear, Chemical & Bio Defense",
   "billet": "OSD Echelon III",
   "svc": "civ",
   "uic": "OD00022",
   "puc": "OD00010",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "asd_ncbdp"
  },
  "asd_ha": {
   "lbl": "ASD(HA)",
   "sub": "ASD — Health Affairs",
   "billet": "OSD Echelon III",
   "svc": "civ",
   "uic": "OD00023",
   "puc": "OD00015",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "asd_ha"
  },
  "asd_solic": {
   "lbl": "ASD(SO/LIC)",
   "sub": "ASD — Special Ops / Low Intensity",
   "billet": "OSD Echelon III",
   "svc": "civ",
   "uic": "OD00024",
   "puc": "OD00012",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "asd_solic"
  },
  "asd_spa": {
   "lbl": "ASD(SPA)",
   "sub": "ASD — Space Policy",
   "billet": "OSD Echelon III",
   "svc": "civ",
   "uic": "OD00025",
   "puc": "OD00012",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "asd_spa"
  },
  "dote": {
   "lbl": "DOT&E",
   "sub": "Director, Operational Test & Eval.",
   "billet": "SES/SL",
   "svc": "civ",
   "uic": "OD00030",
   "puc": "OD00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "dote"
  },
  "cape": {
   "lbl": "CAPE",
   "sub": "Cost Assessment & Program Evaluation",
   "billet": "SES",
   "svc": "civ",
   "uic": "OD00031",
   "puc": "OD00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "cape"
  },
  "cdao": {
   "lbl": "CDAO",
   "sub": "Chief Digital & AI Office",
   "billet": "SES",
   "svc": "civ",
   "uic": "OD00032",
   "puc": "OD00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "cdao"
  },
  "secnav": {
   "lbl": "SECNAV",
   "sub": "Secretary of the Navy",
   "billet": "Executive Agent",
   "svc": "civ",
   "uic": "31698",
   "puc": "OD00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "secnav"
  },
  "sa": {
   "lbl": "SECARM",
   "sub": "Secretary of the Army",
   "billet": "Executive Agent",
   "svc": "civ",
   "uic": "DA00001",
   "puc": "OD00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "sa"
  },
  "secaf": {
   "lbl": "SECAF",
   "sub": "Sec. Air Force / Space Force",
   "billet": "Executive Agent",
   "svc": "civ",
   "uic": "AF00001",
   "puc": "OD00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "secaf"
  },
  "cno": {
   "lbl": "CNO",
   "sub": "Chief of Naval Operations",
   "billet": "ADM (4-Star)",
   "svc": "navy",
   "uic": "00011",
   "puc": "DN00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "cno"
  },
  "cmc": {
   "lbl": "CMC",
   "sub": "Commandant of the Marine Corps",
   "billet": "Gen (4-Star)",
   "svc": "usmc",
   "uic": "M00001",
   "puc": "DN00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "cmc"
  },
  "csa": {
   "lbl": "CSA",
   "sub": "Chief of Staff, Army",
   "billet": "GEN (4-Star)",
   "svc": "army",
   "uic": "A00001",
   "puc": "DA00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "csa"
  },
  "csaf": {
   "lbl": "CSAF",
   "sub": "Chief of Staff, Air Force",
   "billet": "Gen (4-Star)",
   "svc": "airforce",
   "uic": "F00001",
   "puc": "AF00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "csaf"
  },
  "cso": {
   "lbl": "CSO",
   "sub": "Chief of Space Operations",
   "billet": "Gen (4-Star)",
   "svc": "spaceforce",
   "uic": "SF0001",
   "puc": "AF00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "cso"
  },
  "unsecnav": {
   "lbl": "UNSECNAV",
   "sub": "Under Secretary of the Navy",
   "billet": "DoN Echelon II",
   "svc": "civ",
   "uic": "31699",
   "puc": "DN00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "unsecnav"
  },
  "asn_rda": {
   "lbl": "ASN(RD&A)",
   "sub": "Asst Sec Navy — Res., Dev. & Acq.",
   "billet": "DoN CAE",
   "svc": "civ",
   "uic": "48142",
   "puc": "DN00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "asn_rda"
  },
  "asn_eie": {
   "lbl": "ASN(EI&E)",
   "sub": "Asst Sec Navy — Energy & Install.",
   "billet": "DoN Echelon II",
   "svc": "civ",
   "uic": "DN00011",
   "puc": "DN00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "asn_eie"
  },
  "asn_fmc": {
   "lbl": "ASN(FM&C)",
   "sub": "Asst Sec Navy — Fin. Mgmt & CFO",
   "billet": "DoN Echelon II",
   "svc": "civ",
   "uic": "41421",
   "puc": "DN00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "asn_fmc"
  },
  "asn_mra": {
   "lbl": "ASN(M&RA)",
   "sub": "Asst Sec Navy — Manpower & Reserve",
   "billet": "DoN Echelon II",
   "svc": "civ",
   "uic": "42217",
   "puc": "DN00001",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "asn_mra"
  },
  "vcno": {
   "lbl": "VCNO",
   "sub": "Vice Chief of Naval Operations",
   "billet": "ADM (4-Star)",
   "svc": "navy",
   "uic": "N00001",
   "puc": "N00000",
   "loc": {
    "install": "The Pentagon",
    "city": "Arlington, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "vcno"
  },
  "acmc": {
   "lbl": "ACMC",
   "sub": "Asst Commandant, Marine Corps",
   "billet": "LtGen (3-Star)",
   "svc": "usmc",
   "uic": "M00002",
   "puc": "M00001",
   "loc": {
    "install": "The Pentagon / MCB Quantico",
    "city": "Arlington/Quantico, VA",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "acmc"
  },
  "usffc": {
   "lbl": "USFFC",
   "sub": "Fleet Forces Command",
   "billet": "ADM (4-Star)",
   "svc": "navy",
   "uic": "00060",
   "puc": "N00000",
   "loc": {
    "install": "NS Norfolk",
    "city": "Norfolk, VA",
    "lat": 36.9456,
    "lon": -76.3093,
    "aor": "NORTHCOM"
   },
   "dh": [
    "NAVNORTH",
    "NAVSTRAT",
    "COMLANTFLT",
    "2nd Fleet"
   ],
   "id": "usffc"
  },
  "compacflt": {
   "lbl": "COMPACFLT",
   "sub": "Commander, Pacific Fleet",
   "billet": "ADM (4-Star)",
   "svc": "navy",
   "uic": "00070",
   "puc": "N00000",
   "loc": {
    "install": "Joint Base Pearl Harbor-Hickam",
    "city": "Pearl Harbor, HI",
    "lat": 21.359,
    "lon": -157.9751,
    "aor": "INDOPACOM"
   },
   "dh": [
    "3rd Fleet"
   ],
   "id": "compacflt"
  },
  "naveur": {
   "lbl": "NAVEUR-NAVAF",
   "sub": "Naval Forces Europe/Africa",
   "billet": "ADM (4-Star)",
   "svc": "navy",
   "uic": "00061",
   "puc": "N00000",
   "loc": {
    "install": "NSA Naples",
    "city": "Naples, Italy",
    "lat": 40.8359,
    "lon": 14.1952,
    "aor": "EUCOM"
   },
   "dh": [
    "6th Fleet"
   ],
   "id": "naveur"
  },
  "navcent": {
   "lbl": "NAVCENT",
   "sub": "Naval Forces Central",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "57007",
   "puc": "N00000",
   "loc": {
    "install": "NSA Bahrain",
    "city": "Manama, Bahrain",
    "lat": 26.2172,
    "lon": 50.5856,
    "aor": "CENTCOM"
   },
   "dh": [
    "5th Fleet"
   ],
   "id": "navcent"
  },
  "navso": {
   "lbl": "NAVSO",
   "sub": "Naval Forces Southern",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "57061",
   "puc": "N00000",
   "loc": {
    "install": "NS Mayport",
    "city": "Jacksonville, FL",
    "lat": 30.3894,
    "lon": -81.4223,
    "aor": "SOUTHCOM"
   },
   "dh": [
    "4th Fleet"
   ],
   "id": "navso"
  },
  "fl2": {
   "lbl": "2nd Fleet",
   "sub": "US 2nd Fleet / JFC Norfolk",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "08961",
   "puc": "N00002",
   "loc": {
    "install": "NS Norfolk",
    "city": "Norfolk, VA",
    "lat": 36.9456,
    "lon": -76.3093,
    "aor": "NORTHCOM"
   },
   "id": "fl2"
  },
  "fl3": {
   "lbl": "3rd Fleet",
   "sub": "US 3rd Fleet",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "57087",
   "puc": "N00003",
   "loc": {
    "install": "Naval Base Point Loma",
    "city": "San Diego, CA",
    "lat": 32.6902,
    "lon": -117.2345,
    "aor": "INDOPACOM"
   },
   "id": "fl3"
  },
  "fl5": {
   "lbl": "5th Fleet",
   "sub": "US 5th Fleet",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "57045",
   "puc": "N00005",
   "loc": {
    "install": "NSA Bahrain",
    "city": "Manama, Bahrain",
    "lat": 26.2172,
    "lon": 50.5856,
    "aor": "CENTCOM"
   },
   "dh": [
    "NAVCENT"
   ],
   "id": "fl5"
  },
  "fl6": {
   "lbl": "6th Fleet",
   "sub": "US 6th Fleet",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "3818A",
   "puc": "N00004",
   "loc": {
    "install": "NSA Naples",
    "city": "Naples, Italy",
    "lat": 40.8359,
    "lon": 14.1952,
    "aor": "EUCOM"
   },
   "dh": [
    "NAVEUR-NAVAF"
   ],
   "id": "fl6"
  },
  "fl7": {
   "lbl": "7th Fleet",
   "sub": "US 7th Fleet",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "57024",
   "puc": "N00003",
   "loc": {
    "install": "Fleet Activities Yokosuka",
    "city": "Yokosuka, Japan",
    "lat": 35.2924,
    "lon": 139.6743,
    "aor": "INDOPACOM"
   },
   "id": "fl7"
  },
  "surflant": {
   "lbl": "SURFLANT",
   "sub": "Surface Force Atlantic",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "53825",
   "puc": "N00002",
   "loc": {
    "install": "NS Norfolk",
    "city": "Norfolk, VA",
    "lat": 36.9456,
    "lon": -76.3093,
    "aor": "NORTHCOM"
   },
   "id": "surflant"
  },
  "airlant": {
   "lbl": "AIRLANT",
   "sub": "Naval Air Force Atlantic",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "57012",
   "puc": "N00002",
   "loc": {
    "install": "NS Norfolk",
    "city": "Norfolk, VA",
    "lat": 36.9456,
    "lon": -76.3093,
    "aor": "NORTHCOM"
   },
   "id": "airlant"
  },
  "sublant": {
   "lbl": "SUBLANT",
   "sub": "Submarine Force Atlantic",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "57016",
   "puc": "N00002",
   "loc": {
    "install": "NS Norfolk",
    "city": "Norfolk, VA",
    "lat": 36.9456,
    "lon": -76.3093,
    "aor": "NORTHCOM"
   },
   "id": "sublant",
   "dh": [
    "COMSUBFOR"
   ]
  },
  "surfpac": {
   "lbl": "SURFPAC",
   "sub": "Surface Force Pacific",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "53824",
   "puc": "N00003",
   "loc": {
    "install": "Naval Base San Diego",
    "city": "San Diego, CA",
    "lat": 32.7153,
    "lon": -117.2115,
    "aor": "INDOPACOM"
   },
   "id": "surfpac",
   "dh": [
    "COMNAVSURFOR"
   ]
  },
  "airpac": {
   "lbl": "AIRPAC",
   "sub": "Naval Air Force Pacific",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "57025",
   "puc": "N00003",
   "loc": {
    "install": "Naval Air Station North Island",
    "city": "San Diego, CA",
    "lat": 32.6977,
    "lon": -117.1984,
    "aor": "INDOPACOM"
   },
   "id": "airpac",
   "dh": [
    "COMNAVAIRFOR"
   ]
  },
  "subpac": {
   "lbl": "SUBPAC",
   "sub": "Submarine Force Pacific",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "57020",
   "puc": "N00003",
   "loc": {
    "install": "JBPHH",
    "city": "Pearl Harbor, HI",
    "lat": 21.359,
    "lon": -157.9751,
    "aor": "INDOPACOM"
   },
   "id": "subpac"
  },
  "navifor": {
   "lbl": "NAVIFOR",
   "sub": "Naval Information Forces",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "36001",
   "puc": "N00002",
   "loc": {
    "install": "NS Norfolk",
    "city": "Norfolk, VA",
    "lat": 36.9456,
    "lon": -76.3093,
    "aor": "NORTHCOM"
   },
   "id": "navifor"
  },
  "navsea": {
   "lbl": "NAVSEA",
   "sub": "Naval Sea Systems Command",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "00024",
   "puc": "N00000",
   "loc": {
    "install": "Washington Navy Yard",
    "city": "Washington, DC",
    "lat": 38.8729,
    "lon": -77.0013,
    "aor": "GLOBAL"
   },
   "id": "navsea"
  },
  "navair": {
   "lbl": "NAVAIR",
   "sub": "Naval Air Systems Command",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "00019",
   "puc": "N00000",
   "loc": {
    "install": "NAS Patuxent River",
    "city": "Patuxent River, MD",
    "lat": 38.2842,
    "lon": -76.4118,
    "aor": "GLOBAL"
   },
   "id": "navair"
  },
  "navwar": {
   "lbl": "NAVWAR",
   "sub": "Naval Info. Warfare Systems Cmd",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "00039",
   "puc": "N00000",
   "loc": {
    "install": "Old Town San Diego Campus",
    "city": "San Diego, CA",
    "lat": 32.7239,
    "lon": -117.1644,
    "aor": "GLOBAL"
   },
   "id": "navwar"
  },
  "navsup": {
   "lbl": "NAVSUP",
   "sub": "Naval Supply Systems Command",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "00023",
   "puc": "N00000",
   "loc": {
    "install": "Naval Support Activity Mechanicsburg",
    "city": "Mechanicsburg, PA",
    "lat": 40.2148,
    "lon": -77.0111,
    "aor": "GLOBAL"
   },
   "id": "navsup"
  },
  "navfac": {
   "lbl": "NAVFAC",
   "sub": "Naval Facilities Eng. Sys. Command",
   "billet": "RADM (2-Star)",
   "svc": "navy",
   "uic": "00025",
   "puc": "N00000",
   "loc": {
    "install": "Washington Navy Yard",
    "city": "Washington, DC",
    "lat": 38.8729,
    "lon": -77.0013,
    "aor": "GLOBAL"
   },
   "id": "navfac"
  },
  "ssp": {
   "lbl": "SSP",
   "sub": "Strategic Systems Programs",
   "billet": "RADM (2-Star)",
   "svc": "navy",
   "uic": "00030",
   "puc": "N00000",
   "loc": {
    "install": "The Pentagon / NSB New London",
    "city": "Arlington, VA / Groton, CT",
    "lat": 38.8719,
    "lon": -77.0563,
    "aor": "GLOBAL"
   },
   "id": "ssp"
  },
  "netc": {
   "lbl": "NETC",
   "sub": "Naval Education & Training Command",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "00076",
   "puc": "N00000",
   "loc": {
    "install": "NAS Pensacola",
    "city": "Pensacola, FL",
    "lat": 30.3495,
    "lon": -87.3186,
    "aor": "NORTHCOM"
   },
   "id": "netc"
  },
  "bumed": {
   "lbl": "BUMED",
   "sub": "Bureau of Medicine & Surgery",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "00018",
   "puc": "N00000",
   "loc": {
    "install": "Defense Health Headquarters",
    "city": "Falls Church, VA",
    "lat": 38.876,
    "lon": -77.1729,
    "aor": "GLOBAL"
   },
   "id": "bumed"
  },
  "cnic": {
   "lbl": "CNIC",
   "sub": "Navy Installations Command",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "00052",
   "puc": "N00000",
   "loc": {
    "install": "Washington Navy Yard",
    "city": "Washington, DC",
    "lat": 38.8729,
    "lon": -77.0013,
    "aor": "GLOBAL"
   },
   "id": "cnic"
  },
  "navresfor": {
   "lbl": "NAVRESFOR",
   "sub": "Navy Reserve Forces Command",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "00072",
   "puc": "N00000",
   "loc": {
    "install": "NAS Norfolk",
    "city": "Norfolk, VA",
    "lat": 36.9456,
    "lon": -76.3093,
    "aor": "NORTHCOM"
   },
   "id": "navresfor"
  },
  "navspecwar": {
   "lbl": "NAVSPECWARCOM",
   "sub": "Naval Special Warfare Command",
   "billet": "RDML (2-Star)",
   "svc": "navy",
   "uic": "00074",
   "puc": "N00002",
   "loc": {
    "install": "NAB Coronado",
    "city": "San Diego, CA",
    "lat": 32.6836,
    "lon": -117.1625,
    "aor": "NORTHCOM"
   },
   "id": "navspecwar"
  },
  "chnavpers": {
   "lbl": "CHNAVPERS",
   "sub": "Chief of Naval Personnel / BUPERS",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "45997",
   "puc": "N00000",
   "loc": {
    "install": "Millington",
    "city": "Millington, TN",
    "lat": 35.336,
    "lon": -89.8975,
    "aor": "GLOBAL"
   },
   "id": "chnavpers"
  },
  "navsafecen": {
   "lbl": "NAVSAFECEN",
   "sub": "Naval Safety Command",
   "billet": "RDML (2-Star)",
   "svc": "navy",
   "uic": "63393",
   "puc": "N00000",
   "loc": {
    "install": "NAS Norfolk",
    "city": "Norfolk, VA",
    "lat": 36.9456,
    "lon": -76.3093,
    "aor": "NORTHCOM"
   },
   "id": "navsafecen"
  },
  "msc": {
   "lbl": "MSC",
   "sub": "Military Sealift Command",
   "billet": "RADM (2-Star)",
   "svc": "navy",
   "uic": "00033",
   "puc": "N00002",
   "loc": {
    "install": "Washington Navy Yard",
    "city": "Washington, DC",
    "lat": 38.8729,
    "lon": -77.0013,
    "aor": "GLOBAL"
   },
   "id": "msc"
  },
  "necc": {
   "lbl": "NECC",
   "sub": "Navy Expeditionary Combat Command",
   "billet": "RADM (2-Star)",
   "svc": "navy",
   "uic": "57046",
   "puc": "N00002",
   "loc": {
    "install": "JEB Little Creek-Fort Story",
    "city": "Virginia Beach, VA",
    "lat": 36.9105,
    "lon": -76.1688,
    "aor": "NORTHCOM"
   },
   "id": "necc"
  },
  "nwdc": {
   "lbl": "NWDC",
   "sub": "Navy Warfare Development Command",
   "billet": "RDML (1-Star)",
   "svc": "navy",
   "uic": "68948",
   "puc": "N00002",
   "loc": {
    "install": "Naval War College",
    "city": "Newport, RI",
    "lat": 41.5132,
    "lon": -71.3325,
    "aor": "NORTHCOM"
   },
   "id": "nwdc"
  },
  "cnmoc": {
   "lbl": "CNMOC",
   "sub": "Naval Meteorology & Oceanography Cmd",
   "billet": "RADM (2-Star)",
   "svc": "navy",
   "uic": "00065",
   "puc": "N00002",
   "loc": {
    "install": "Stennis Space Center",
    "city": "Bay St. Louis, MS",
    "lat": 30.3639,
    "lon": -89.6005,
    "aor": "NORTHCOM"
   },
   "id": "cnmoc"
  },
  "nawcad": {
   "lbl": "NAWCAD",
   "sub": "Naval Air Warfare Center Aircraft Div",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "00421",
   "puc": "N00019",
   "loc": {
    "install": "NAS Patuxent River",
    "city": "Patuxent River, MD",
    "lat": 38.2842,
    "lon": -76.4118,
    "aor": "GLOBAL"
   },
   "id": "nawcad"
  },
  "nawcwd": {
   "lbl": "NAWCWD",
   "sub": "Naval Air Warfare Center Weapons Div",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "47969",
   "puc": "N00019",
   "loc": {
    "install": "NAS China Lake",
    "city": "Ridgecrest, CA",
    "lat": 35.6852,
    "lon": -117.6836,
    "aor": "GLOBAL"
   },
   "id": "nawcwd"
  },
  "navrmc": {
   "lbl": "NAVRMC",
   "sub": "Naval Regional Maintenance Center",
   "billet": "RDML (1-Star)",
   "svc": "navy",
   "uic": "58400",
   "puc": "N00024",
   "loc": {
    "install": "NS Norfolk",
    "city": "Norfolk, VA",
    "lat": 36.9456,
    "lon": -76.3093,
    "aor": "NORTHCOM"
   },
   "id": "navrmc"
  },
  "fl10": {
   "lbl": "10th Fleet",
   "sub": "US 10th Fleet",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "3822A",
   "puc": "N00036",
   "loc": {
    "install": "Fort Meade",
    "city": "Fort Meade, MD",
    "lat": 39.1086,
    "lon": -76.7718,
    "aor": "GLOBAL"
   },
   "dh": [
    "FLTCYBERCOM"
   ],
   "id": "fl10"
  },
  "peo_a": {
   "lbl": "PEO(A)",
   "sub": "PEO Aviation",
   "billet": "RDML/SES",
   "svc": "acq",
   "uic": "68346",
   "puc": "N00019",
   "loc": {
    "install": "NAS Patuxent River",
    "city": "Patuxent River, MD",
    "lat": 38.2842,
    "lon": -76.4118,
    "aor": "GLOBAL"
   },
   "id": "peo_a"
  },
  "peo_uw": {
   "lbl": "PEO(U&W)",
   "sub": "PEO Unmanned & Strike Weapons",
   "billet": "RDML/SES",
   "svc": "acq",
   "uic": "N60650",
   "puc": "N00019",
   "loc": {
    "install": "NAS China Lake / Pax River",
    "city": "China Lake / Pax River",
    "lat": 35.6852,
    "lon": -117.6836,
    "aor": "GLOBAL"
   },
   "id": "peo_uw"
  },
  "peo_t": {
   "lbl": "PEO(T)",
   "sub": "PEO Tactical Aircraft Programs",
   "billet": "SES",
   "svc": "acq",
   "uic": "N61340",
   "puc": "N00019",
   "loc": {
    "install": "NAS Orlando (Simulation Center)",
    "city": "Orlando, FL",
    "lat": 28.5383,
    "lon": -81.3792,
    "aor": "GLOBAL"
   },
   "id": "peo_t"
  },
  "peo_ships": {
   "lbl": "PEO(Ships)",
   "sub": "PEO Ships",
   "billet": "RDML/SES",
   "svc": "acq",
   "uic": "30270",
   "puc": "N00024",
   "loc": {
    "install": "Washington Navy Yard",
    "city": "Washington, DC",
    "lat": 38.8729,
    "lon": -77.0013,
    "aor": "GLOBAL"
   },
   "id": "peo_ships"
  },
  "peo_subs": {
   "lbl": "PEO(Subs)",
   "sub": "PEO Submarines",
   "billet": "RDML/SES",
   "svc": "acq",
   "uic": "48160",
   "puc": "N00024",
   "loc": {
    "install": "NSB New London / WNY",
    "city": "Groton, CT",
    "lat": 41.354,
    "lon": -72.0906,
    "aor": "GLOBAL"
   },
   "id": "peo_subs"
  },
  "peo_cvn": {
   "lbl": "PEO(CVN)",
   "sub": "PEO Aircraft Carriers",
   "billet": "RDML/SES",
   "svc": "acq",
   "uic": "32284",
   "puc": "N00024",
   "loc": {
    "install": "Washington Navy Yard",
    "city": "Washington, DC",
    "lat": 38.8729,
    "lon": -77.0013,
    "aor": "GLOBAL"
   },
   "id": "peo_cvn"
  },
  "peo_iws": {
   "lbl": "PEO(IWS)",
   "sub": "PEO Integrated Warfare Systems",
   "billet": "RDML/SES",
   "svc": "acq",
   "uic": "49661",
   "puc": "N00024",
   "loc": {
    "install": "Washington Navy Yard",
    "city": "Washington, DC",
    "lat": 38.8729,
    "lon": -77.0013,
    "aor": "GLOBAL"
   },
   "id": "peo_iws"
  },
  "peo_lmw": {
   "lbl": "PEO(USC)",
   "sub": "PEO Unmanned & Small Combatants",
   "billet": "RDML/SES",
   "svc": "acq",
   "uic": "52210",
   "puc": "N00024",
   "loc": {
    "install": "Washington Navy Yard",
    "city": "Washington, DC",
    "lat": 38.8729,
    "lon": -77.0013,
    "aor": "GLOBAL"
   },
   "id": "peo_lmw"
  },
  "peo_c4i": {
   "lbl": "PEO(C4I)",
   "sub": "PEO Command, Control, Comms, Intel",
   "billet": "RDML/SES",
   "svc": "acq",
   "uic": "3579A",
   "puc": "N00039",
   "loc": {
    "install": "NAVWAR San Diego",
    "city": "San Diego, CA",
    "lat": 32.7239,
    "lon": -117.1644,
    "aor": "GLOBAL"
   },
   "id": "peo_c4i"
  },
  "peo_dig": {
   "lbl": "PEO(Digital)",
   "sub": "PEO Digital & Enterprise Services",
   "billet": "SES",
   "svc": "acq",
   "uic": "00994",
   "puc": "N00039",
   "loc": {
    "install": "NAVWAR San Diego",
    "city": "San Diego, CA",
    "lat": 32.7239,
    "lon": -117.1644,
    "aor": "GLOBAL"
   },
   "id": "peo_dig"
  },
  "pma265": {
   "lbl": "PMA-265",
   "sub": "F/A-18 E/F & EA-18G Growler",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N62269",
   "puc": "N60610",
   "loc": {
    "install": "NAS Patuxent River",
    "city": "Patuxent River, MD",
    "lat": 38.292,
    "lon": -76.42,
    "aor": "GLOBAL"
   },
   "id": "pma265"
  },
  "pma299": {
   "lbl": "PMA-299",
   "sub": "H-60 Multi-Mission Helicopters (MH-60R/S)",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N62298",
   "puc": "N60610",
   "loc": {
    "install": "NAS Patuxent River",
    "city": "Patuxent River, MD",
    "lat": 38.292,
    "lon": -76.42,
    "aor": "GLOBAL"
   },
   "id": "pma299"
  },
  "pma261": {
   "lbl": "PMA-261",
   "sub": "CH-53E/K Heavy Lift Helicopters",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N62260",
   "puc": "N60610",
   "loc": {
    "install": "NAS Patuxent River",
    "city": "Patuxent River, MD",
    "lat": 38.292,
    "lon": -76.42,
    "aor": "GLOBAL"
   },
   "id": "pma261"
  },
  "pma272": {
   "lbl": "PMA-272",
   "sub": "MV-22B / CMV-22B Osprey",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N62271",
   "puc": "N60610",
   "loc": {
    "install": "NAS Patuxent River",
    "city": "Patuxent River, MD",
    "lat": 38.292,
    "lon": -76.42,
    "aor": "GLOBAL"
   },
   "id": "pma272"
  },
  "pma276": {
   "lbl": "PMA-276",
   "sub": "H-1 Huey / AH-1Z Viper / UH-1Y",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N62275",
   "puc": "N60610",
   "loc": {
    "install": "NAS Patuxent River",
    "city": "Patuxent River, MD",
    "lat": 38.293,
    "lon": -76.418,
    "aor": "GLOBAL"
   },
   "id": "pma276"
  },
  "pma281": {
   "lbl": "PMA-281",
   "sub": "Strike Planning and Execution Systems",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N62280",
   "puc": "N60610",
   "loc": {
    "install": "NAS Patuxent River",
    "city": "Patuxent River, MD",
    "lat": 38.285,
    "lon": -76.415,
    "aor": "GLOBAL"
   },
   "id": "pma281"
  },
  "pma262": {
   "lbl": "PMA-262",
   "sub": "Tactical Airborne Weapons Systems",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N62261",
   "puc": "N60650",
   "loc": {
    "install": "NAS China Lake",
    "city": "Ridgecrest, CA",
    "lat": 35.6852,
    "lon": -117.6836,
    "aor": "GLOBAL"
   },
   "id": "pma262"
  },
  "pma263": {
   "lbl": "PMA-263",
   "sub": "Small Tactical Unmanned Aircraft Systems",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N62262",
   "puc": "N60650",
   "loc": {
    "install": "NAS Patuxent River",
    "city": "Patuxent River, MD",
    "lat": 38.29,
    "lon": -76.41,
    "aor": "GLOBAL"
   },
   "id": "pma263"
  },
  "pma275": {
   "lbl": "PMA-275",
   "sub": "E-2D Advanced Hawkeye / C-2A COD",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N62274",
   "puc": "N60610",
   "loc": {
    "install": "NAS Patuxent River",
    "city": "Patuxent River, MD",
    "lat": 38.29,
    "lon": -76.415,
    "aor": "GLOBAL"
   },
   "id": "pma275"
  },
  "pma207": {
   "lbl": "PMA-207",
   "sub": "KC-130J / C-130T Tactical Airlift",
   "billet": "Col",
   "svc": "acq",
   "uic": "N62207",
   "puc": "N60610",
   "loc": {
    "install": "NAS Patuxent River",
    "city": "Patuxent River, MD",
    "lat": 38.285,
    "lon": -76.415,
    "aor": "GLOBAL"
   },
   "id": "pma207"
  },
  "f35jpo": {
   "lbl": "F-35 JPO",
   "sub": "F-35 Lightning II Joint Program Office",
   "billet": "LtGen (3-Star)",
   "svc": "joint",
   "uic": "JF3500",
   "puc": "AF00001",
   "loc": {
    "install": "Crystal City",
    "city": "Arlington, VA",
    "lat": 38.8561,
    "lon": -77.0499,
    "aor": "GLOBAL"
   },
   "dh": [
    "PEO F-35"
   ],
   "id": "f35jpo"
  },
  "pms400": {
   "lbl": "PMS-400",
   "sub": "DDG-51 Arleigh Burke Destroyer",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N00024",
   "puc": "N00024",
   "loc": {
    "install": "Washington Navy Yard",
    "city": "Washington, DC",
    "lat": 38.874,
    "lon": -77.001,
    "aor": "GLOBAL"
   },
   "id": "pms400"
  },
  "pms317": {
   "lbl": "PMS-317",
   "sub": "FFG-62 Constellation Frigate",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N00024",
   "puc": "N00024",
   "loc": {
    "install": "Washington Navy Yard",
    "city": "Washington, DC",
    "lat": 38.8735,
    "lon": -77.0015,
    "aor": "GLOBAL"
   },
   "id": "pms317"
  },
  "pms385": {
   "lbl": "PMS-385",
   "sub": "Virginia-Class SSN-774",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N00039",
   "puc": "N00039",
   "loc": {
    "install": "NSB New London",
    "city": "Groton, CT",
    "lat": 41.354,
    "lon": -72.0906,
    "aor": "GLOBAL"
   },
   "id": "pms385"
  },
  "pms425": {
   "lbl": "PMS-425",
   "sub": "Columbia-Class SSBN-826",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N00039",
   "puc": "N00039",
   "loc": {
    "install": "NSB New London",
    "city": "Groton, CT",
    "lat": 41.355,
    "lon": -72.091,
    "aor": "GLOBAL"
   },
   "id": "pms425"
  },
  "pms394": {
   "lbl": "PMS-394",
   "sub": "Gerald R. Ford CVN-78 Class",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N00024",
   "puc": "N00024",
   "loc": {
    "install": "Newport News Shipbuilding",
    "city": "Newport News, VA",
    "lat": 37.05,
    "lon": -76.45,
    "aor": "GLOBAL"
   },
   "id": "pms394"
  },
  "pms500": {
   "lbl": "PMS-500",
   "sub": "LPD-17 San Antonio Class",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N00024",
   "puc": "N00024",
   "loc": {
    "install": "Washington Navy Yard",
    "city": "Washington, DC",
    "lat": 38.873,
    "lon": -77.002,
    "aor": "GLOBAL"
   },
   "id": "pms500"
  },
  "pmw120": {
   "lbl": "PMW-120",
   "sub": "Battlespace Awareness & Information Operations",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N39430",
   "puc": "N00039",
   "loc": {
    "install": "NAVWAR San Diego",
    "city": "San Diego, CA",
    "lat": 32.7245,
    "lon": -117.165,
    "aor": "GLOBAL"
   },
   "id": "pmw120"
  },
  "pmw130": {
   "lbl": "PMW-130",
   "sub": "Cybersecurity",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N39431",
   "puc": "N00039",
   "loc": {
    "install": "NAVWAR San Diego",
    "city": "San Diego, CA",
    "lat": 32.7239,
    "lon": -117.1644,
    "aor": "GLOBAL"
   },
   "id": "pmw130"
  },
  "pmw160": {
   "lbl": "PMW-160",
   "sub": "Tactical Networks (CANES/ACS)",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N39432",
   "puc": "N00039",
   "loc": {
    "install": "NAVWAR San Diego",
    "city": "San Diego, CA",
    "lat": 32.7233,
    "lon": -117.164,
    "aor": "GLOBAL"
   },
   "id": "pmw160"
  },
  "pmw240": {
   "lbl": "PMW-240",
   "sub": "Sea Warrior Program",
   "billet": "CAPT/SES",
   "svc": "acq",
   "uic": "N39433",
   "puc": "N00039",
   "loc": {
    "install": "NAVWAR San Diego",
    "city": "San Diego, CA",
    "lat": 32.7228,
    "lon": -117.1635,
    "aor": "GLOBAL"
   },
   "id": "pmw240"
  },
  "marforcom": {
   "lbl": "MARFORCOM",
   "sub": "Marine Forces Command",
   "billet": "LtGen (3-Star)",
   "svc": "usmc",
   "uic": "67026",
   "puc": "M00001",
   "loc": {
    "install": "NS Norfolk / MCB Quantico",
    "city": "Norfolk, VA",
    "lat": 36.9456,
    "lon": -76.3093,
    "aor": "NORTHCOM"
   },
   "dh": [
    "MARFORLANT"
   ],
   "id": "marforcom"
  },
  "marforpac": {
   "lbl": "MARFORPAC",
   "sub": "Marine Forces Pacific",
   "billet": "LtGen (3-Star)",
   "svc": "usmc",
   "uic": "67025",
   "puc": "M00001",
   "loc": {
    "install": "Camp H.M. Smith",
    "city": "Halawa, HI",
    "lat": 21.3714,
    "lon": -157.9321,
    "aor": "INDOPACOM"
   },
   "id": "marforpac"
  },
  "marforres": {
   "lbl": "MARFORRES",
   "sub": "Marine Forces Reserve",
   "billet": "LtGen (3-Star)",
   "svc": "usmc",
   "uic": "67861",
   "puc": "M00001",
   "loc": {
    "install": "NOLA Federal City",
    "city": "New Orleans, LA",
    "lat": 29.9511,
    "lon": -90.0715,
    "aor": "NORTHCOM"
   },
   "id": "marforres"
  },
  "marforcent": {
   "lbl": "MARFORCENT",
   "sub": "Marine Forces Central",
   "billet": "MajGen (2-Star)",
   "svc": "usmc",
   "uic": "M00013",
   "puc": "M00001",
   "loc": {
    "install": "MacDill AFB",
    "city": "Tampa, FL",
    "lat": 27.8498,
    "lon": -82.5217,
    "aor": "CENTCOM"
   },
   "id": "marforcent"
  },
  "marforeur": {
   "lbl": "MARFOREUR",
   "sub": "Marine Forces Europe",
   "billet": "MajGen (2-Star)",
   "svc": "usmc",
   "uic": "M00014",
   "puc": "M00001",
   "loc": {
    "install": "Stuttgart / NSA Naples",
    "city": "Stuttgart, Germany",
    "lat": 48.7758,
    "lon": 9.1829,
    "aor": "EUCOM"
   },
   "id": "marforeur"
  },
  "marsoc": {
   "lbl": "MARSOC",
   "sub": "Marine Raider Command",
   "billet": "MajGen (2-Star)",
   "svc": "usmc",
   "uic": "M00015",
   "puc": "M00001",
   "loc": {
    "install": "Camp Lejeune",
    "city": "Jacksonville, NC",
    "lat": 34.6551,
    "lon": -77.3432,
    "aor": "NORTHCOM"
   },
   "id": "marsoc"
  },
  "marforcyber": {
   "lbl": "MARFORCYBER",
   "sub": "Marine Forces Cyberspace Command",
   "billet": "BGen (1-Star)",
   "svc": "usmc",
   "uic": "M00016",
   "puc": "M00001",
   "loc": {
    "install": "Fort Meade",
    "city": "Fort Meade, MD",
    "lat": 39.1146,
    "lon": -76.7712,
    "aor": "GLOBAL"
   },
   "id": "marforcyber"
  },
  "imef": {
   "lbl": "I MEF",
   "sub": "I Marine Expeditionary Force",
   "billet": "LtGen (3-Star)",
   "svc": "usmc",
   "uic": "M10000",
   "puc": "M00011",
   "loc": {
    "install": "MCB Camp Pendleton",
    "city": "Oceanside, CA",
    "lat": 33.376,
    "lon": -117.4524,
    "aor": "INDOPACOM"
   },
   "id": "imef"
  },
  "iimef": {
   "lbl": "II MEF",
   "sub": "II Marine Expeditionary Force",
   "billet": "LtGen (3-Star)",
   "svc": "usmc",
   "uic": "M20000",
   "puc": "M00010",
   "loc": {
    "install": "MCB Camp Lejeune",
    "city": "Jacksonville, NC",
    "lat": 34.6551,
    "lon": -77.3432,
    "aor": "NORTHCOM"
   },
   "id": "iimef"
  },
  "iiimef": {
   "lbl": "III MEF",
   "sub": "III Marine Expeditionary Force",
   "billet": "LtGen (3-Star)",
   "svc": "usmc",
   "uic": "M30000",
   "puc": "M00011",
   "loc": {
    "install": "Camp Courtney, Okinawa",
    "city": "Uruma, Okinawa, Japan",
    "lat": 26.3344,
    "lon": 127.8056,
    "aor": "INDOPACOM"
   },
   "id": "iiimef"
  },
  "mlr": {
   "lbl": "3d MLR",
   "sub": "3d Marine Littoral Regiment",
   "billet": "Col",
   "svc": "usmc",
   "uic": "M31000",
   "puc": "M30000",
   "loc": {
    "install": "MCAS Kaneohe Bay / MCB Hawaii",
    "city": "Kaneohe Bay, HI",
    "lat": 21.4511,
    "lon": -157.765,
    "aor": "INDOPACOM"
   },
   "dh": [
    "Force Design 2030"
   ],
   "id": "mlr"
  },
  "dmaw": {
   "lbl": "1st MAW",
   "sub": "1st Marine Aircraft Wing",
   "billet": "MajGen (2-Star)",
   "svc": "usmc",
   "uic": "M30100",
   "puc": "M30000",
   "loc": {
    "install": "MCAS Iwakuni",
    "city": "Iwakuni, Japan",
    "lat": 34.1444,
    "lon": 132.2356,
    "aor": "INDOPACOM"
   },
   "id": "dmaw"
  },
  "smaw": {
   "lbl": "2d MAW",
   "sub": "2d Marine Aircraft Wing",
   "billet": "MajGen (2-Star)",
   "svc": "usmc",
   "uic": "M20100",
   "puc": "M20000",
   "loc": {
    "install": "MCAS Cherry Point",
    "city": "Havelock, NC",
    "lat": 34.9002,
    "lon": -76.8803,
    "aor": "NORTHCOM"
   },
   "id": "smaw"
  },
  "tmaw": {
   "lbl": "3d MAW",
   "sub": "3d Marine Aircraft Wing",
   "billet": "MajGen (2-Star)",
   "svc": "usmc",
   "uic": "M10100",
   "puc": "M10000",
   "loc": {
    "install": "MCAS Miramar",
    "city": "San Diego, CA",
    "lat": 32.8688,
    "lon": -117.143,
    "aor": "INDOPACOM"
   },
   "id": "tmaw"
  },
  "fmaw": {
   "lbl": "4th MAW",
   "sub": "4th Marine Aircraft Wing",
   "billet": "MajGen (2-Star)",
   "svc": "usmc",
   "uic": "M40000",
   "puc": "M00030",
   "loc": {
    "install": "NAS JRB New Orleans",
    "city": "Belle Chasse, LA",
    "lat": 29.8253,
    "lon": -90.0175,
    "aor": "NORTHCOM"
   },
   "id": "fmaw"
  },
  "mag11": {
   "lbl": "MAG-11",
   "sub": "Marine Aircraft Group 11",
   "billet": "Col",
   "svc": "usmc",
   "uic": "M10011",
   "puc": "M10000",
   "loc": {
    "install": "MCAS Miramar",
    "city": "San Diego, CA",
    "lat": 32.8684,
    "lon": -117.1426,
    "aor": "NORTHCOM"
   },
   "id": "mag11"
  },
  "mag12": {
   "lbl": "MAG-12",
   "sub": "Marine Aircraft Group 12",
   "billet": "Col",
   "svc": "usmc",
   "uic": "M30012",
   "puc": "M30000",
   "loc": {
    "install": "MCAS Iwakuni",
    "city": "Iwakuni, Japan",
    "lat": 34.1461,
    "lon": 132.2361,
    "aor": "INDOPACOM"
   },
   "id": "mag12"
  },
  "mag13": {
   "lbl": "MAG-13",
   "sub": "Marine Aircraft Group 13",
   "billet": "Col",
   "svc": "usmc",
   "uic": "M10013",
   "puc": "M10000",
   "loc": {
    "install": "MCAS Yuma",
    "city": "Yuma, AZ",
    "lat": 32.6563,
    "lon": -114.6061,
    "aor": "NORTHCOM"
   },
   "id": "mag13"
  },
  "mag14": {
   "lbl": "MAG-14",
   "sub": "Marine Aircraft Group 14",
   "billet": "Col",
   "svc": "usmc",
   "uic": "M20014",
   "puc": "M20000",
   "loc": {
    "install": "MCAS Cherry Point",
    "city": "Havelock, NC",
    "lat": 34.9009,
    "lon": -76.8808,
    "aor": "NORTHCOM"
   },
   "id": "mag14"
  },
  "mag16": {
   "lbl": "MAG-16",
   "sub": "Marine Aircraft Group 16",
   "billet": "COL",
   "svc": "usmc",
   "uic": "M10116",
   "puc": "M10100",
   "loc": {
    "install": "MCAS Miramar",
    "city": "San Diego, CA",
    "lat": 32.87,
    "lon": -117.142,
    "aor": "INDOPACOM"
   },
   "id": "mag16"
  },
  "mag26": {
   "lbl": "MAG-26",
   "sub": "Marine Aircraft Group 26",
   "billet": "COL",
   "svc": "usmc",
   "uic": "M20126",
   "puc": "M20100",
   "loc": {
    "install": "MCAS New River",
    "city": "Jacksonville, NC",
    "lat": 34.7076,
    "lon": -77.4396,
    "aor": "NORTHCOM"
   },
   "id": "mag26"
  },
  "mag36": {
   "lbl": "MAG-36",
   "sub": "Marine Aircraft Group 36",
   "billet": "COL",
   "svc": "usmc",
   "uic": "M30136",
   "puc": "M30100",
   "loc": {
    "install": "MCAS Futenma / Iwakuni",
    "city": "Ginowan, Okinawa, Japan",
    "lat": 26.2727,
    "lon": 127.7548,
    "aor": "INDOPACOM"
   },
   "id": "mag36"
  },
  "mag24": {
   "lbl": "MAG-24",
   "sub": "Marine Aircraft Group 24",
   "billet": "Col",
   "svc": "usmc",
   "uic": "M30024",
   "puc": "M30000",
   "loc": {
    "install": "MCAF Kaneohe Bay",
    "city": "Kaneohe, HI",
    "lat": 21.452,
    "lon": -157.764,
    "aor": "INDOPACOM"
   },
   "id": "mag24"
  },
  "mag29": {
   "lbl": "MAG-29",
   "sub": "Marine Aircraft Group 29",
   "billet": "Col",
   "svc": "usmc",
   "uic": "M20029",
   "puc": "M20000",
   "loc": {
    "install": "MCAS New River",
    "city": "Jacksonville, NC",
    "lat": 34.7083,
    "lon": -77.4397,
    "aor": "NORTHCOM"
   },
   "id": "mag29"
  },
  "mag31": {
   "lbl": "MAG-31",
   "sub": "Marine Aircraft Group 31",
   "billet": "Col",
   "svc": "usmc",
   "uic": "M20031",
   "puc": "M20000",
   "loc": {
    "install": "MCAS Beaufort",
    "city": "Beaufort, SC",
    "lat": 32.4774,
    "lon": -80.7193,
    "aor": "NORTHCOM"
   },
   "id": "mag31"
  },
  "mag39": {
   "lbl": "MAG-39",
   "sub": "Marine Aircraft Group 39",
   "billet": "Col",
   "svc": "usmc",
   "uic": "M10039",
   "puc": "M10000",
   "loc": {
    "install": "MCAS Camp Pendleton",
    "city": "Oceanside, CA",
    "lat": 33.3014,
    "lon": -117.3544,
    "aor": "NORTHCOM"
   },
   "id": "mag39"
  },
  "mag41": {
   "lbl": "MAG-41",
   "sub": "Marine Aircraft Group 41",
   "billet": "Col",
   "svc": "usmc",
   "uic": "M40041",
   "puc": "M40000",
   "loc": {
    "install": "NAS JRB Fort Worth",
    "city": "Fort Worth, TX",
    "lat": 32.7632,
    "lon": -97.4415,
    "aor": "NORTHCOM"
   },
   "id": "mag41"
  },
  "mag42": {
   "lbl": "MAG-42",
   "sub": "Marine Aircraft Group 42",
   "billet": "Col",
   "svc": "usmc",
   "uic": "M40042",
   "puc": "M40000",
   "loc": {
    "install": "NAS Atlanta",
    "city": "Marietta, GA",
    "lat": 33.9153,
    "lon": -84.5161,
    "aor": "NORTHCOM"
   },
   "id": "mag42"
  },
  "mag49": {
   "lbl": "MAG-49",
   "sub": "Marine Aircraft Group 49",
   "billet": "Col",
   "svc": "usmc",
   "uic": "M40049",
   "puc": "M40000",
   "loc": {
    "install": "Stewart ANGB",
    "city": "Newburgh, NY",
    "lat": 41.5037,
    "lon": -74.1048,
    "aor": "NORTHCOM"
   },
   "id": "mag49"
  },
  "mals14": {
   "lbl": "MALS-14",
   "maint": "O/I",
   "sub": "Marine Aviation Logistics Sqdn 14",
   "billet": "LtCol/Col",
   "svc": "usmc",
   "uic": "M20114",
   "puc": "M20014",
   "loc": {
    "install": "MCAS Cherry Point",
    "city": "Havelock, NC",
    "lat": 34.901,
    "lon": -76.8815,
    "aor": "NORTHCOM"
   },
   "id": "mals14"
  },
  "mals16": {
   "lbl": "MALS-16",
   "maint": "O/I",
   "sub": "Marine Aviation Logistics Sqdn 16",
   "billet": "LtCol/Col",
   "svc": "usmc",
   "uic": "M10116",
   "puc": "M10116",
   "loc": {
    "install": "MCAS Miramar",
    "city": "San Diego, CA",
    "lat": 32.868,
    "lon": -117.144,
    "aor": "INDOPACOM"
   },
   "id": "mals16"
  },
  "mals24": {
   "lbl": "MALS-24",
   "maint": "O/I",
   "sub": "Marine Aviation Logistics Sqdn 24",
   "billet": "LtCol/Col",
   "svc": "usmc",
   "uic": "M10124",
   "puc": "M10100",
   "loc": {
    "install": "MCAS Kaneohe Bay",
    "city": "Kaneohe Bay, HI",
    "lat": 21.452,
    "lon": -157.764,
    "aor": "INDOPACOM"
   },
   "id": "mals24"
  },
  "mals36": {
   "lbl": "MALS-36",
   "maint": "O/I",
   "sub": "Marine Aviation Logistics Sqdn 36",
   "billet": "LtCol/Col",
   "svc": "usmc",
   "uic": "M30136",
   "puc": "M30136",
   "loc": {
    "install": "MCAS Iwakuni",
    "city": "Iwakuni, Japan",
    "lat": 34.1455,
    "lon": 132.2367,
    "aor": "INDOPACOM"
   },
   "id": "mals36"
  },
  "mals11": {
   "lbl": "MALS-11",
   "maint": "O/I",
   "sub": "Marine Aviation Logistics Sqdn 11",
   "billet": "LtCol/Col",
   "svc": "usmc",
   "uic": "M10111",
   "puc": "M10011",
   "loc": {
    "install": "MCAS Miramar",
    "city": "San Diego, CA",
    "lat": 32.8684,
    "lon": -117.1426,
    "aor": "NORTHCOM"
   },
   "id": "mals11"
  },
  "mals12": {
   "lbl": "MALS-12",
   "maint": "O/I",
   "sub": "Marine Aviation Logistics Sqdn 12",
   "billet": "LtCol/Col",
   "svc": "usmc",
   "uic": "M30112",
   "puc": "M30012",
   "loc": {
    "install": "MCAS Iwakuni",
    "city": "Iwakuni, Japan",
    "lat": 34.1461,
    "lon": 132.2361,
    "aor": "INDOPACOM"
   },
   "id": "mals12"
  },
  "mals13": {
   "lbl": "MALS-13",
   "maint": "O/I",
   "sub": "Marine Aviation Logistics Sqdn 13",
   "billet": "LtCol/Col",
   "svc": "usmc",
   "uic": "M10113",
   "puc": "M10013",
   "loc": {
    "install": "MCAS Yuma",
    "city": "Yuma, AZ",
    "lat": 32.6563,
    "lon": -114.6061,
    "aor": "NORTHCOM"
   },
   "id": "mals13"
  },
  "mals26": {
   "lbl": "MALS-26",
   "maint": "O/I",
   "sub": "Marine Aviation Logistics Sqdn 26",
   "billet": "LtCol/Col",
   "svc": "usmc",
   "uic": "M20126",
   "puc": "M20026",
   "loc": {
    "install": "MCAS New River",
    "city": "Jacksonville, NC",
    "lat": 34.7083,
    "lon": -77.4397,
    "aor": "NORTHCOM"
   },
   "id": "mals26"
  },
  "mals29": {
   "lbl": "MALS-29",
   "maint": "O/I",
   "sub": "Marine Aviation Logistics Sqdn 29",
   "billet": "LtCol/Col",
   "svc": "usmc",
   "uic": "M20129",
   "puc": "M20029",
   "loc": {
    "install": "MCAS New River",
    "city": "Jacksonville, NC",
    "lat": 34.7083,
    "lon": -77.4397,
    "aor": "NORTHCOM"
   },
   "id": "mals29"
  },
  "mals31": {
   "lbl": "MALS-31",
   "maint": "O/I",
   "sub": "Marine Aviation Logistics Sqdn 31",
   "billet": "LtCol/Col",
   "svc": "usmc",
   "uic": "M20131",
   "puc": "M20031",
   "loc": {
    "install": "MCAS Beaufort",
    "city": "Beaufort, SC",
    "lat": 32.4774,
    "lon": -80.7193,
    "aor": "NORTHCOM"
   },
   "id": "mals31"
  },
  "mals39": {
   "lbl": "MALS-39",
   "maint": "O/I",
   "sub": "Marine Aviation Logistics Sqdn 39",
   "billet": "LtCol/Col",
   "svc": "usmc",
   "uic": "M10139",
   "puc": "M10039",
   "loc": {
    "install": "MCAS Camp Pendleton",
    "city": "Oceanside, CA",
    "lat": 33.3014,
    "lon": -117.3544,
    "aor": "NORTHCOM"
   },
   "id": "mals39"
  },
  "mals41": {
   "lbl": "MALS-41",
   "maint": "O/I",
   "sub": "Marine Aviation Logistics Sqdn 41",
   "billet": "LtCol/Col",
   "svc": "usmc",
   "uic": "M40141",
   "puc": "M40041",
   "loc": {
    "install": "NAS JRB Fort Worth",
    "city": "Fort Worth, TX",
    "lat": 32.7632,
    "lon": -97.4415,
    "aor": "NORTHCOM"
   },
   "id": "mals41"
  },
  "mals42": {
   "lbl": "MALS-42",
   "maint": "O/I",
   "sub": "Marine Aviation Logistics Sqdn 42",
   "billet": "LtCol/Col",
   "svc": "usmc",
   "uic": "M40142",
   "puc": "M40042",
   "loc": {
    "install": "NAS Atlanta",
    "city": "Marietta, GA",
    "lat": 33.9153,
    "lon": -84.5161,
    "aor": "NORTHCOM"
   },
   "id": "mals42"
  },
  "mals49": {
   "lbl": "MALS-49",
   "maint": "O/I",
   "sub": "Marine Aviation Logistics Sqdn 49",
   "billet": "LtCol/Col",
   "svc": "usmc",
   "uic": "M40149",
   "puc": "M40049",
   "loc": {
    "install": "Stewart ANGB",
    "city": "Newburgh, NY",
    "lat": 41.5037,
    "lon": -74.1048,
    "aor": "NORTHCOM"
   },
   "id": "mals49"
  },
  "arcyber": {
   "lbl": "ARCYBER",
   "sub": "Army Cyber Command / 2nd Army",
   "billet": "LTG (3-Star)",
   "svc": "army",
   "uic": "A00100",
   "puc": "A00001",
   "loc": {
    "install": "Fort Eisenhower (Cyber Center)",
    "city": "Augusta, GA",
    "lat": 33.379,
    "lon": -82.1545,
    "aor": "GLOBAL"
   },
   "dh": [
    "2nd Army"
   ],
   "id": "arcyber"
  },
  "af16": {
   "lbl": "16th AF",
   "sub": "Air Forces Cyber / 16th Air Force",
   "billet": "Maj Gen (2-Star)",
   "svc": "airforce",
   "uic": "F00100",
   "puc": "F00001",
   "loc": {
    "install": "Lackland AFB",
    "city": "San Antonio, TX",
    "lat": 29.3844,
    "lon": -98.6208,
    "aor": "GLOBAL"
   },
   "dh": [
    "AFCYBER"
   ],
   "id": "af16"
  },
  "spaceops": {
   "lbl": "SPACEOPS",
   "sub": "Space Operations Command",
   "billet": "Lt Gen (3-Star)",
   "svc": "spaceforce",
   "uic": "SF0100",
   "puc": "SF0001",
   "loc": {
    "install": "Peterson SFB",
    "city": "Colorado Springs, CO",
    "lat": 38.8239,
    "lon": -104.7007,
    "aor": "GLOBAL"
   },
   "id": "spaceops"
  },
  "cg_cyber": {
   "lbl": "CG-CYBER",
   "sub": "USCG Cyber Command",
   "billet": "RDML (2-Star)",
   "svc": "coastguard",
   "uic": "CG0100",
   "puc": "CG0001",
   "loc": {
    "install": "Martinsburg, WV",
    "city": "Martinsburg, WV",
    "lat": 39.4562,
    "lon": -77.9641,
    "aor": "GLOBAL"
   },
   "id": "cg_cyber"
  },
  "indopacom": {
   "lbl": "INDOPACOM",
   "sub": "Indo-Pacific Command",
   "billet": "ADM (4-Star)",
   "svc": "joint",
   "uic": "JC00010",
   "puc": "JC00001",
   "loc": {
    "install": "Camp H.M. Smith",
    "city": "Halawa, HI",
    "lat": 21.3714,
    "lon": -157.9321,
    "aor": "INDOPACOM"
   },
   "id": "indopacom"
  },
  "northcom": {
   "lbl": "NORTHCOM",
   "sub": "Northern Command",
   "billet": "GEN (4-Star)",
   "svc": "joint",
   "uic": "JC00011",
   "puc": "JC00001",
   "loc": {
    "install": "Peterson SFB",
    "city": "Colorado Springs, CO",
    "lat": 38.8239,
    "lon": -104.7007,
    "aor": "NORTHCOM"
   },
   "dh": [
    "NORAD (CDN/US)"
   ],
   "id": "northcom"
  },
  "southcom": {
   "lbl": "SOUTHCOM",
   "sub": "Southern Command",
   "billet": "ADM (4-Star)",
   "svc": "joint",
   "uic": "JC00012",
   "puc": "JC00001",
   "loc": {
    "install": "Doral, FL (SOUTHCOM HQ)",
    "city": "Doral, FL",
    "lat": 25.818,
    "lon": -80.3392,
    "aor": "SOUTHCOM"
   },
   "id": "southcom"
  },
  "eucom": {
   "lbl": "EUCOM",
   "sub": "European Command",
   "billet": "GEN (4-Star)",
   "svc": "joint",
   "uic": "JC00013",
   "puc": "JC00001",
   "loc": {
    "install": "Patch Barracks, Stuttgart",
    "city": "Stuttgart, Germany",
    "lat": 48.7758,
    "lon": 9.1829,
    "aor": "EUCOM"
   },
   "dh": [
    "SACEUR/NATO"
   ],
   "id": "eucom"
  },
  "centcom": {
   "lbl": "CENTCOM",
   "sub": "Central Command",
   "billet": "GEN (4-Star)",
   "svc": "joint",
   "uic": "JC00014",
   "puc": "JC00001",
   "loc": {
    "install": "MacDill AFB",
    "city": "Tampa, FL",
    "lat": 27.8498,
    "lon": -82.5217,
    "aor": "CENTCOM"
   },
   "id": "centcom"
  },
  "africom": {
   "lbl": "AFRICOM",
   "sub": "Africa Command",
   "billet": "GEN (4-Star)",
   "svc": "joint",
   "uic": "JC00015",
   "puc": "JC00001",
   "loc": {
    "install": "Kelley Barracks, Stuttgart",
    "city": "Stuttgart, Germany",
    "lat": 48.7758,
    "lon": 9.1929,
    "aor": "AFRICOM"
   },
   "id": "africom"
  },
  "socom": {
   "lbl": "SOCOM",
   "sub": "Special Operations Command",
   "billet": "GEN (4-Star)",
   "svc": "joint",
   "uic": "JC00020",
   "puc": "JC00001",
   "loc": {
    "install": "MacDill AFB",
    "city": "Tampa, FL",
    "lat": 27.8498,
    "lon": -82.5237,
    "aor": "GLOBAL"
   },
   "id": "socom"
  },
  "transcom": {
   "lbl": "TRANSCOM",
   "sub": "Transportation Command",
   "billet": "GEN (4-Star)",
   "svc": "joint",
   "uic": "JC00021",
   "puc": "JC00001",
   "loc": {
    "install": "Scott AFB",
    "city": "Belleville, IL",
    "lat": 38.5448,
    "lon": -89.8498,
    "aor": "GLOBAL"
   },
   "id": "transcom"
  },
  "stratcom": {
   "lbl": "STRATCOM",
   "sub": "Strategic Command",
   "billet": "ADM (4-Star)",
   "svc": "joint",
   "uic": "JC00022",
   "puc": "JC00001",
   "loc": {
    "install": "Offutt AFB",
    "city": "Bellevue, NE",
    "lat": 41.1183,
    "lon": -95.9127,
    "aor": "GLOBAL"
   },
   "id": "stratcom"
  },
  "spacecom": {
   "lbl": "SPACECOM",
   "sub": "Space Command",
   "billet": "GEN (4-Star)",
   "svc": "joint",
   "uic": "JC00023",
   "puc": "JC00001",
   "loc": {
    "install": "Peterson SFB",
    "city": "Colorado Springs, CO",
    "lat": 38.8239,
    "lon": -104.7007,
    "aor": "GLOBAL"
   },
   "id": "spacecom"
  },
  "cybercom": {
   "lbl": "CYBERCOM",
   "sub": "US Cyber Command",
   "billet": "GEN (4-Star)",
   "svc": "cyber",
   "uic": "JC00024",
   "puc": "JC00001",
   "loc": {
    "install": "Fort Meade",
    "city": "Fort Meade, MD",
    "lat": 39.1146,
    "lon": -76.7712,
    "aor": "GLOBAL"
   },
   "dh": [
    "Dual-hat: DIRNSA/NSA"
   ],
   "id": "cybercom"
  },
  "dcdc": {
   "lbl": "DCDC",
   "sub": "DoD Cyber Defense Command",
   "billet": "LTG (3-Star)",
   "svc": "cyber",
   "uic": "JC00025",
   "puc": "JC00024",
   "loc": {
    "install": "Fort Meade",
    "city": "Fort Meade, MD",
    "lat": 39.1146,
    "lon": -76.7712,
    "aor": "GLOBAL"
   },
   "dh": [
    "DISA Director"
   ],
   "id": "dcdc"
  },
  "fltcybercom": {
   "lbl": "FLTCYBERCOM",
   "sub": "Fleet Cyber Command / 10th Fleet",
   "billet": "VADM (3-Star)",
   "svc": "navy",
   "uic": "00055",
   "puc": "N00002",
   "loc": {
    "install": "Fort Meade",
    "city": "Fort Meade, MD",
    "lat": 39.1146,
    "lon": -76.7712,
    "aor": "GLOBAL"
   },
   "dh": [
    "10th Fleet"
   ],
   "id": "fltcybercom"
  },
  "comfrc": {
   "lbl": "COMFRC",
   "sub": "Commander, Fleet Readiness Centers",
   "billet": "RADM (2-Star)",
   "svc": "navy",
   "uic": "68520",
   "puc": "N00019",
   "maint": "I/D",
   "loc": {
    "install": "NAS Patuxent River, Bldg 447",
    "city": "Patuxent River, MD",
    "lat": 38.27,
    "lon": -76.41,
    "aor": "GLOBAL"
   },
   "id": "comfrc"
  },
  "frce": {
   "lbl": "FRCE",
   "sub": "FRC East — MCAS Cherry Point",
   "billet": "SES/O-6",
   "svc": "navy",
   "uic": "65923",
   "puc": "N00490",
   "maint": "I/D",
   "loc": {
    "install": "MCAS Cherry Point",
    "city": "Havelock, NC",
    "lat": 34.9,
    "lon": -76.88,
    "aor": "NORTHCOM"
   },
   "id": "frce"
  },
  "frcse": {
   "lbl": "FRCSE",
   "sub": "FRC Southeast — NAS Jacksonville",
   "billet": "SES/O-6",
   "svc": "navy",
   "uic": "65886",
   "puc": "N00490",
   "maint": "I/D",
   "loc": {
    "install": "NAS Jacksonville",
    "city": "Jacksonville, FL",
    "lat": 30.23,
    "lon": -81.68,
    "aor": "NORTHCOM"
   },
   "id": "frcse"
  },
  "frcsw": {
   "lbl": "FRCSW",
   "sub": "FRC Southwest — NAS North Island",
   "billet": "SES/O-6",
   "svc": "navy",
   "uic": "65888",
   "puc": "N00490",
   "maint": "I/D",
   "loc": {
    "install": "NAS North Island",
    "city": "Coronado, CA",
    "lat": 32.7,
    "lon": -117.2,
    "aor": "INDOPACOM"
   },
   "id": "frcsw"
  },
  "frcma": {
   "lbl": "FRCMA",
   "sub": "FRC Mid-Atlantic — NAS Oceana",
   "billet": "SES/O-6",
   "svc": "navy",
   "uic": "44327",
   "puc": "N00490",
   "maint": "I",
   "loc": {
    "install": "NAS Oceana",
    "city": "Virginia Beach, VA",
    "lat": 36.82,
    "lon": -76.03,
    "aor": "NORTHCOM"
   },
   "id": "frcma"
  },
  "frcw": {
   "lbl": "FRCW",
   "sub": "FRC West — NAS Lemoore",
   "billet": "SES/O-6",
   "svc": "navy",
   "uic": "44321",
   "puc": "N00490",
   "maint": "I/D",
   "loc": {
    "install": "NAS Lemoore",
    "city": "Lemoore, CA",
    "lat": 36.33,
    "lon": -119.95,
    "aor": "INDOPACOM"
   },
   "id": "frcw"
  },
  "frcnw": {
   "lbl": "FRCNW",
   "sub": "FRC Northwest — NAS Whidbey Island",
   "billet": "SES/O-6",
   "svc": "navy",
   "uic": "44329",
   "puc": "N00490",
   "maint": "I",
   "loc": {
    "install": "NAS Whidbey Island",
    "city": "Oak Harbor, WA",
    "lat": 48.35,
    "lon": -122.66,
    "aor": "INDOPACOM"
   },
   "id": "frcnw"
  },
  "frcwp": {
   "lbl": "FRCWP",
   "sub": "FRC WestPac — NAF Atsugi Japan",
   "billet": "SES/O-6",
   "svc": "navy",
   "uic": "66021",
   "puc": "N00490",
   "maint": "I/D",
   "loc": {
    "install": "Naval Air Facility Atsugi",
    "city": "Atsugi, Japan",
    "lat": 35.45,
    "lon": 139.45,
    "aor": "INDOPACOM"
   },
   "id": "frcwp"
  },
  "frc_ase": {
   "lbl": "FRC-ASE",
   "sub": "FRC Aviation Support Equipment",
   "billet": "SES/O-6",
   "svc": "navy",
   "uic": "N68200",
   "puc": "N00490",
   "maint": "I",
   "loc": {
    "install": "NAS Patuxent River",
    "city": "Patuxent River, MD",
    "lat": 38.28,
    "lon": -76.4,
    "aor": "GLOBAL"
   },
   "id": "frc_ase"
  },
  "frc_rmw": {
   "lbl": "FRC-RMW",
   "sub": "FRC Reserve Mid-West — NAS Ft Worth",
   "billet": "SES/O-6",
   "svc": "navy",
   "uic": "4828A",
   "puc": "N00490",
   "maint": "I",
   "loc": {
    "install": "NAS Fort Worth JRB",
    "city": "Fort Worth, TX",
    "lat": 32.77,
    "lon": -97.44,
    "aor": "NORTHCOM"
   },
   "id": "frc_rmw"
  },
  "frcsw_yuma": {
   "lbl": "FRCSW-DET Yuma",
   "sub": "FRCSW Det — MCAS Yuma AZ",
   "billet": "O-5",
   "svc": "navy",
   "uic": "N68701",
   "puc": "N68700",
   "maint": "I",
   "loc": {
    "install": "MCAS Yuma",
    "city": "Yuma, AZ",
    "lat": 32.65,
    "lon": -114.61,
    "aor": "NORTHCOM"
   },
   "id": "frcsw_yuma"
  },
  "frcsw_hi": {
   "lbl": "FRCSW-DET HI",
   "sub": "FRCSW Det — MCAS Kaneohe Bay HI",
   "billet": "O-5",
   "svc": "navy",
   "uic": "N68702",
   "puc": "N68700",
   "maint": "I",
   "loc": {
    "install": "MCAS Kaneohe Bay",
    "city": "Kaneohe Bay, HI",
    "lat": 21.45,
    "lon": -157.77,
    "aor": "INDOPACOM"
   },
   "id": "frcsw_hi"
  },
  "frcsw_ptmugu": {
   "lbl": "FRCSW-DET Mugu",
   "sub": "FRCSW Det — NBVC Pt. Mugu CA",
   "billet": "O-5",
   "svc": "navy",
   "uic": "N68703",
   "puc": "N68700",
   "maint": "I",
   "loc": {
    "install": "NBVC Point Mugu",
    "city": "Oxnard, CA",
    "lat": 34.12,
    "lon": -119.12,
    "aor": "INDOPACOM"
   },
   "id": "frcsw_ptmugu"
  },
  "frcse_mayport": {
   "lbl": "FRCSE-DET Mayport",
   "sub": "FRCSE Det — NS Mayport FL",
   "billet": "O-5",
   "svc": "navy",
   "uic": "N68501",
   "puc": "N68500",
   "maint": "I",
   "loc": {
    "install": "Naval Station Mayport",
    "city": "Mayport, FL",
    "lat": 30.39,
    "lon": -81.42,
    "aor": "NORTHCOM"
   },
   "id": "frcse_mayport"
  },
  "frcw_fallon": {
   "lbl": "FRCW-DET Fallon",
   "sub": "FRCW Det — NAS Fallon NV",
   "billet": "O-5",
   "svc": "navy",
   "uic": "N68801",
   "puc": "N68800",
   "maint": "I",
   "loc": {
    "install": "NAS Fallon",
    "city": "Fallon, NV",
    "lat": 39.42,
    "lon": -118.7,
    "aor": "NORTHCOM"
   },
   "id": "frcw_fallon"
  }
 },
 "auth": {
  "mals16": {
   "opcon": [
    "mag16"
   ],
   "adcon": [
    "mag16"
   ],
   "ta": [
    "pma261",
    "pma272"
   ],
   "lcsp": [
    "pma261",
    "pma272"
   ],
   "daco": [
    "marforcyber"
   ],
   "mte": "marforpac",
   "note": "MALS-16 — I-level (intermediate) maintenance capability tier. Per COMNAVAIRFORINST 4790.2 series (NAMP), MALS provides intermediate-level maintenance, ordnance, supply, and aviation information management support to all squadrons within the parent MAG. Represents a maintenance capability level (equivalent to Navy AIMD), not a unique unit-to-unit authority relationship. Three-level maintenance: O-level (squadron organic), I-level (MALS/AIMD), D-level (FRC/depot). Per OPNAVINST 4790.2K (25 Apr 2025) and COMNAVAIRFORINST 4790.2E."
  },
  "mals24": {
   "opcon": [
    "mag24"
   ],
   "adcon": [
    "mag24"
   ],
   "ta": [
    "pma272",
    "pma263",
    "pma207"
   ],
   "lcsp": [
    "pma272",
    "pma263",
    "pma207"
   ],
   "daco": [
    "marforcyber"
   ],
   "mte": "marforpac",
   "note": "MALS-24 — I-level (intermediate) maintenance capability tier. Per COMNAVAIRFORINST 4790.2 series (NAMP), MALS provides intermediate-level maintenance, ordnance, supply, and aviation information management support to all squadrons within the parent MAG. Represents a maintenance capability level (equivalent to Navy AIMD), not a unique unit-to-unit authority relationship. Three-level maintenance: O-level (squadron organic), I-level (MALS/AIMD), D-level (FRC/depot). Per OPNAVINST 4790.2K (25 Apr 2025) and COMNAVAIRFORINST 4790.2E."
  },
  "mals36": {
   "opcon": [
    "mag36"
   ],
   "adcon": [
    "mag36"
   ],
   "ta": [
    "pma272"
   ],
   "lcsp": [
    "pma272"
   ],
   "daco": [
    "marforcyber"
   ],
   "mte": "marforpac",
   "note": "MALS-36 — I-level (intermediate) maintenance capability tier. Per COMNAVAIRFORINST 4790.2 series (NAMP), MALS provides intermediate-level maintenance, ordnance, supply, and aviation information management support to all squadrons within the parent MAG. Represents a maintenance capability level (equivalent to Navy AIMD), not a unique unit-to-unit authority relationship. Three-level maintenance: O-level (squadron organic), I-level (MALS/AIMD), D-level (FRC/depot). Per OPNAVINST 4790.2K (25 Apr 2025) and COMNAVAIRFORINST 4790.2E."
  },
  "mals14": {
   "opcon": [
    "mag14"
   ],
   "adcon": [
    "mag14"
   ],
   "ta": [
    "f35jpo",
    "pma263",
    "pma207"
   ],
   "lcsp": [
    "f35jpo",
    "pma263",
    "pma207"
   ],
   "daco": [
    "marforcyber"
   ],
   "mte": "marforcom",
   "note": "MALS-14 — I-level (intermediate) maintenance capability tier. Per COMNAVAIRFORINST 4790.2 series (NAMP), MALS provides intermediate-level maintenance, ordnance, supply, and aviation information management support to all squadrons within the parent MAG. Represents a maintenance capability level (equivalent to Navy AIMD), not a unique unit-to-unit authority relationship. Three-level maintenance: O-level (squadron organic), I-level (MALS/AIMD), D-level (FRC/depot). Per OPNAVINST 4790.2K (25 Apr 2025) and COMNAVAIRFORINST 4790.2E."
  },
  "mals11": {
   "adcon": [
    "mag11"
   ],
   "daco": [
    "marforcyber"
   ],
   "ta": [
    "pma265",
    "f35jpo",
    "pma207"
   ],
   "lcsp": [
    "pma265",
    "f35jpo",
    "pma207"
   ],
   "note": "MALS-11, MAG-11, 3d MAW, I MEF. MCAS Miramar, CA."
  },
  "mals12": {
   "adcon": [
    "mag12"
   ],
   "daco": [
    "marforcyber"
   ],
   "ta": [
    "f35jpo",
    "pma207"
   ],
   "lcsp": [
    "f35jpo",
    "pma207"
   ],
   "note": "MALS-12, MAG-12, 1st MAW, III MEF. MCAS Iwakuni, Japan. Supports F-35B (VMFA-121, VMFA-242) and KC-130J (VMGR-152)."
  },
  "mals13": {
   "adcon": [
    "mag13"
   ],
   "daco": [
    "marforcyber"
   ],
   "ta": [
    "f35jpo",
    "pma263"
   ],
   "lcsp": [
    "f35jpo",
    "pma263"
   ],
   "note": "MALS-13, MAG-13, 3d MAW, I MEF. MCAS Yuma, AZ."
  },
  "mals26": {
   "adcon": [
    "mag26"
   ],
   "daco": [
    "marforcyber"
   ],
   "ta": [
    "pma272"
   ],
   "lcsp": [
    "pma272"
   ],
   "note": "MALS-26, MAG-26, 2d MAW, II MEF. MCAS New River, NC."
  },
  "mals29": {
   "adcon": [
    "mag29"
   ],
   "daco": [
    "marforcyber"
   ],
   "ta": [
    "pma261",
    "pma276"
   ],
   "lcsp": [
    "pma261",
    "pma276"
   ],
   "note": "MALS-29, MAG-29, 2d MAW, II MEF. MCAS New River, NC."
  },
  "mals31": {
   "adcon": [
    "mag31"
   ],
   "daco": [
    "marforcyber"
   ],
   "ta": [
    "pma265",
    "f35jpo"
   ],
   "lcsp": [
    "pma265",
    "f35jpo"
   ],
   "note": "MALS-31, MAG-31, 2d MAW, II MEF. MCAS Beaufort, SC."
  },
  "mals39": {
   "adcon": [
    "mag39"
   ],
   "daco": [
    "marforcyber"
   ],
   "ta": [
    "pma276",
    "pma272"
   ],
   "lcsp": [
    "pma276",
    "pma272"
   ],
   "note": "MALS-39, MAG-39, 3d MAW, I MEF. MCAS Camp Pendleton, CA."
  },
  "mals41": {
   "adcon": [
    "mag41"
   ],
   "daco": [
    "marforcyber"
   ],
   "ta": [
    "pma265",
    "pma276",
    "pma207"
   ],
   "lcsp": [
    "pma265",
    "pma276",
    "pma207"
   ],
   "note": "MALS-41, MAG-41, 4th MAW, MARFORRES. NAS JRB Fort Worth, TX."
  },
  "mals42": {
   "adcon": [
    "mag42"
   ],
   "daco": [
    "marforcyber"
   ],
   "ta": [],
   "lcsp": [],
   "note": "MALS-42, MAG-42, 4th MAW, MARFORRES. NAS Atlanta, GA."
  },
  "mals49": {
   "adcon": [
    "mag49"
   ],
   "daco": [
    "marforcyber"
   ],
   "ta": [
    "pma261",
    "pma276",
    "pma272"
   ],
   "lcsp": [
    "pma261",
    "pma276",
    "pma272"
   ],
   "note": "MALS-49, MAG-49, 4th MAW, MARFORRES. Stewart ANGB, NY."
  },
  "pma281": {
   "opcon": [],
   "aa": [
    "peo_uw",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "PMA-281 Strike Planning and Execution Systems. Under PEO(U&W). Verified per navair.navy.mil."
  },
  "pma272": {
   "opcon": [],
   "aa": [
    "peo_a",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "PMA-272. KMS lists as V-22 Osprey program. Verification report flagged possible discrepancy — navair.navy.mil may show different program assignment. Requires further verification."
  },
  "pma276": {
   "opcon": [],
   "aa": [
    "peo_a",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "H-1 TA holder (AH-1Z Viper, UH-1Y Venom). Governs airworthiness for all USMC H-1 variants."
  },
  "fltcybercom": {
   "opcon": [
    "cybercom"
   ],
   "adcon": [
    "cno"
   ],
   "ta": [],
   "daco": [
    "dcdc"
   ],
   "mte": "usffc",
   "note": "Echelon 2, UIC 00055. ISIC: CNO. Commander is dual-hatted as also heading Naval Space Command (UIC 4840A). DACO authority delegated from CYBERCOM. Source: SNDL Ref B (02 Feb 2026)."
  },
  "marforcyber": {
   "opcon": [
    "cybercom"
   ],
   "adcon": [
    "cmc"
   ],
   "ta": [],
   "daco": [
    "dcdc"
   ],
   "mte": "marforcom",
   "note": "Marine Forces Cyberspace Command. CYBERCOM Marine component (peer to FLTCYBERCOM, not subordinate). Fort Meade, MD. Subordinates: MCCOG (DODIN/DCO), MCCYWG (CMF/OCO)."
  },
  "navsea": {
   "opcon": [],
   "adcon": [
    "cno"
   ],
   "aa": [
    "secnav",
    "asn_rda"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "NAVSEA is a PEO Holding Command. ASN(RD&A) exercises acquisition/TA oversight; CNO exercises admin authority."
  },
  "airlant": {
   "opcon": [
    "usffc"
   ],
   "adcon": [
    "usffc"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": "usffc",
   "note": "Naval Air Force Atlantic. ADCON: CNO→USFFC→AIRLANT. TA: NAVAIR issues airworthiness directives and configuration authority for all USN aircraft operated by AIRLANT squadrons. Dual authority is the key lifecycle management nexus."
  },
  "airpac": {
   "opcon": [
    "compacflt"
   ],
   "adcon": [
    "compacflt"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": "compacflt",
   "note": "Echelon 3, UIC 57025. ISIC: COMPACFLT. Commander also designated as COMNAVAIRFOR (UIC 69294), dual-hat serving as Navy lead for the Naval Aviation Enterprise. Source: SNDL Ref B."
  },
  "comfrc": {
   "opcon": [],
   "adcon": [
    "navair"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "Echelon 3 under NAVAIRSYSCOM. UIC 68520. Commander, Fleet Readiness Centers. ISIC: NAVAIRSYSCOM. Administers 7 FRCs (3 depot + 3 I-level + 1 OCONUS) + FRC RMW (separate ISIC under CNAF). Source: SNDL."
  },
  "frce": {
   "opcon": [],
   "adcon": [
    "comfrc"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "lcsp": [
    "pma261",
    "pma276",
    "pma272"
   ],
   "mte": null,
   "note": "Depot capability: F/A-18, F-35C, C-130J, structural repair, T-56 engine. Largest industrial employer east of I-95 in NC. Receives TA from PMA-265 (F/A-18) and PMA-299 (F-35). Returns MDS configuration data to PMAs per 10 USC § 4324(b)."
  },
  "frcse": {
   "opcon": [],
   "adcon": [
    "comfrc"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "lcsp": [
    "pma261",
    "pma276",
    "pma272"
   ],
   "mte": null,
   "note": "Depot: F/A-18, F-35, E-2/C-2, P-8A, T-45, E-6B. Engines: F414, F404, J52, T700, T56, TF34. First F135 power module depot capability. MDS return flows to each PMA holding TA."
  },
  "frcsw": {
   "opcon": [],
   "adcon": [
    "comfrc"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "lcsp": [
    "pma261",
    "pma276",
    "pma272"
   ],
   "mte": null,
   "note": "Depot: F/A-18A-F, EA-18G, E-2C/D, AV-8B, MV-22B, MH-60. Sites: Yuma AZ, Kaneohe Bay HI, Pt. Mugu CA, MCAS Pendleton CA. Primary USMC MV-22 and CH-53 maintenance source."
  },
  "frcma": {
   "opcon": [],
   "adcon": [
    "comfrc"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "lcsp": [
    "pma261",
    "pma276",
    "pma272"
   ],
   "mte": null,
   "note": "Intermediate level: Strike fighter support, component repair. DET NAS Norfolk."
  },
  "frcw": {
   "opcon": [],
   "adcon": [
    "frcsw"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "lcsp": [
    "pma261",
    "pma276",
    "pma272"
   ],
   "mte": null,
   "note": "Echelon 5, UIC 44321. ISIC: FRCSW (not COMFRC directly). I-level maintenance. Source: SNDL."
  },
  "frcnw": {
   "opcon": [],
   "adcon": [
    "frcsw"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "lcsp": [
    "pma261",
    "pma276",
    "pma272"
   ],
   "mte": null,
   "note": "Echelon 5, UIC 44329. ISIC: FRCSW (not COMFRC directly). I-level maintenance. Source: SNDL."
  },
  "frcwp": {
   "opcon": [],
   "adcon": [
    "comfrc"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "lcsp": [
    "pma261",
    "pma276",
    "pma272"
   ],
   "mte": null,
   "note": "INDOPACOM/CENTCOM forward depot. Origin: FAWPRA(1950s)→NAPRA(1980)→FRC WestPac(2008). Forward-deployed configuration data return is critical to PM lifecycle visibility."
  },
  "frc_ase": {
   "opcon": [],
   "adcon": [
    "cno"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "lcsp": [],
   "mte": null,
   "note": "Aviation support equipment repair, calibration, metrology, SE overhaul."
  },
  "frc_rmw": {
   "opcon": [],
   "adcon": [
    "navresfor"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "lcsp": [
    "pma261",
    "pma276",
    "pma272"
   ],
   "mte": null,
   "note": "Echelon 4, UIC 4828A. ISIC: NAVAIRFORES (CNAF) — NOT COMFRC. Reserve FRC at NAS Fort Worth. Different ADCON chain from all other FRCs. Source: SNDL."
  },
  "navair": {
   "opcon": [],
   "adcon": [
    "cno"
   ],
   "aa": [
    "secnav",
    "asn_rda"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "Echelon 2 under CNO. UIC 00019. ISIC: CNO. TA for naval aviation airworthiness and configuration management. ACC per OPNAVINST 5450.350B. Source: SNDL OPNAVINST 5400.45A Ref C (02 Feb 2026)."
  },
  "asn_rda": {
   "opcon": [],
   "adcon": [
    "secnav"
   ],
   "aa": [
    "usd_as",
    "usd_re"
   ],
   "daco": [],
   "mte": null,
   "note": "ASN(RD&A) is the DoN Component Acquisition Executive (CAE). Approves ACAT I/II milestones. Exercises Acquisition Authority (distinct from TA) over SYSCOMs and PEOs."
  },
  "nawcad": {
   "opcon": [],
   "adcon": [
    "navair"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "Naval Air Warfare Center Aircraft Division. Echelon 3 under NAVAIR (ISIC per OPNAVINST 5450.350B para 6a(1)). Executes aircraft engineering, test, and evaluation for all naval aviation programs."
  },
  "nawcwd": {
   "opcon": [],
   "adcon": [
    "navair"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "Naval Air Warfare Center Weapons Division at China Lake. Echelon 3 under NAVAIR (ISIC per OPNAVINST 5450.350B para 6a(2)). Weapons development, test, and integration."
  },
  "navrmc": {
   "opcon": [],
   "adcon": [
    "navsea"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "Echelon 3, UIC 58400. ISIC: NAVSEA. Navy Regional Maintenance Center — bridge between NAVSEA TA and fleet surface maintenance. Source: SNDL."
  },
  "cnic": {
   "opcon": [],
   "adcon": [
    "cno"
   ],
   "ta": [],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "Echelon 2, UIC 00052. ISIC: CNO. CNIC is the supporting commander to USFFC, COMPACFLT, NAVEUR/NAVAF, NAVCENT, NAVSOUTH for installation support to fleet operations. Not an operational commander. Source: SNDL Ref B."
  },
  "navresfor": {
   "opcon": [],
   "adcon": [
    "cno"
   ],
   "ta": [],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "Navy Reserve Forces Command. Echelon 2 under CNO. Manages all Navy Reserve units and personnel."
  },
  "navspecwar": {
   "opcon": [
    "socom"
   ],
   "adcon": [
    "cno"
   ],
   "ta": [],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "Naval Special Warfare Command. OPCON to SOCOM per UCP. ADCON: CNO. Echelon 2 under CNO per OPNAVINST 5450.352B."
  },
  "chnavpers": {
   "opcon": [],
   "adcon": [
    "cno"
   ],
   "ta": [],
   "daco": [],
   "mte": null,
   "note": "Chief of Naval Personnel / BUPERS. Echelon 2 under CNO. Manages Navy personnel policy, assignment, and career management."
  },
  "navsafecen": {
   "opcon": [],
   "adcon": [
    "cno"
   ],
   "ta": [],
   "daco": [],
   "mte": null,
   "note": "Naval Safety Command (formerly Naval Safety Center). Echelon 2 under CNO per OPNAVINST 5450.352B."
  },
  "msc": {
   "opcon": [
    "transcom"
   ],
   "adcon": [
    "usffc"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": "usffc",
   "note": "Echelon 3, UIC 00033. ISIC: USFFC. ADCON through USFFC. OPCON to TRANSCOM as Navy Component. Source: SNDL."
  },
  "necc": {
   "opcon": [],
   "adcon": [
    "usffc"
   ],
   "ta": [],
   "daco": [
    "fltcybercom"
   ],
   "mte": "usffc",
   "note": "Navy Expeditionary Combat Command. Echelon 3 under USFFC (ISIC per OPNAVINST 5440.77C para 6a(2)(d)). EOD, NCB, RIVRON, NSW support."
  },
  "nwdc": {
   "opcon": [],
   "adcon": [
    "usffc"
   ],
   "ta": [],
   "daco": [],
   "mte": "usffc",
   "note": "Navy Warfare Development Command. Echelon 3 under USFFC (ISIC per OPNAVINST 5440.77C para 6a(2)(i)). Concept development, experimentation, war games."
  },
  "cnmoc": {
   "opcon": [],
   "adcon": [
    "usffc"
   ],
   "ta": [],
   "daco": [],
   "mte": "usffc",
   "note": "Naval Meteorology and Oceanography Command. Echelon 3 under USFFC per OPNAVINST 5440.77C."
  },
  "fl10": {
   "opcon": [
    "fltcybercom"
   ],
   "adcon": [
    "fltcybercom"
   ],
   "ta": [],
   "daco": [
    "fltcybercom"
   ],
   "mte": "fltcybercom",
   "note": "Echelon 3, UIC 3822A. ISIC: FLTCYBERCOM. Dual-hatted with FLTCYBERCOM. Source: SNDL."
  },
  "usffc": {
   "opcon": [
    "stratcom"
   ],
   "adcon": [
    "cno"
   ],
   "ta": [],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "Echelon 2, UIC 00060. ISIC: CNO. USFFC CDR is quad-hatted: NAVNORTH (Navy component to NORTHCOM), NAVSTRAT (Navy component to STRATCOM per Feb 2019 designation), COMLANTFLT, and C2F. JFMCC-STRAT mission: execute maritime aspects of strategic deterrence. Primary force provider for Atlantic/Global operations. Source: SNDL Ref B; STRATCOM article 1754078 (Feb 2019)."
  },
  "compacflt": {
   "opcon": [
    "indopacom"
   ],
   "adcon": [
    "cno"
   ],
   "ta": [],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "Echelon 2, UIC 00070. ISIC: CNO. OPCON to INDOPACOM as Navy Service Component Commander. Dual-hat: 3rd Fleet. TYCOMs under COMPACFLT provide ADCON support for units assigned OPCON to CSG/ESG — TYCOMs and CSG/ESG commanders work integrated solutions. Source: SNDL Ref B."
  },
  "naveur": {
   "opcon": [
    "eucom"
   ],
   "adcon": [
    "cno"
   ],
   "ta": [],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "Naval Forces Europe/Africa. Echelon 2 under CNO ADCON. OPCON to EUCOM as SCC. Dual-hat: 6th Fleet."
  },
  "navcent": {
   "opcon": [
    "centcom"
   ],
   "adcon": [
    "cno"
   ],
   "ta": [],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "Naval Forces Central Command. Echelon 2 under CNO ADCON. OPCON to CENTCOM as SCC. Dual-hat: 5th Fleet."
  },
  "navso": {
   "opcon": [
    "southcom"
   ],
   "adcon": [
    "cno"
   ],
   "ta": [],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "Naval Forces Southern Command. Echelon 2 under CNO ADCON. OPCON to SOUTHCOM as SCC. Dual-hat: 4th Fleet."
  },
  "surflant": {
   "opcon": [],
   "adcon": [
    "usffc"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": "usffc",
   "note": "Surface Force Atlantic. TYCOM under USFFC. NAVSEA exercises TA as operator of RMCs and maintenance per OPNAVINST 5440.77C para 7b."
  },
  "surfpac": {
   "opcon": [],
   "adcon": [
    "compacflt"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": "compacflt",
   "note": "Echelon 3, UIC 53824. ISIC: COMPACFLT. Commander also designated as COMNAVSURFOR (UIC 69293), dual-hat serving as Navy lead for the Surface Warfare Enterprise. Source: SNDL Ref B."
  },
  "sublant": {
   "opcon": [],
   "adcon": [
    "usffc"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": "usffc",
   "note": "Echelon 3, UIC 57016. ISIC: USFFC. Commander also designated as COMSUBFOR, dual-hat as Navy lead for the Undersea Warfare Enterprise. Source: SNDL Ref B."
  },
  "subpac": {
   "opcon": [],
   "adcon": [
    "compacflt"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": "compacflt",
   "note": "Submarine Force Pacific. TYCOM under COMPACFLT."
  },
  "navifor": {
   "opcon": [],
   "adcon": [
    "usffc"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": "usffc",
   "note": "Echelon 3, UIC 36001. ISIC: USFFC. NAVIFOR remains a shore command while subordinates are operating forces. NAVIFOR remains as the administrative commander, TYCOM, and ISIC for SNDL and TFMMS purposes. FLTCYBERCOM is the operational commander for IW forces. Source: SNDL Ref B."
  },
  "peo_a": {
   "opcon": [],
   "aa": [
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "Echelon 1, UIC 68346. ISIC: ASN(RD&A). PEO Aviation — reports ADCON to ASN(RD&A), NOT through NAVAIR. NAVAIR provides TA and support only. Source: SNDL + SECNAVINST 5000.2G."
  },
  "peo_uw": {
   "opcon": [],
   "aa": [
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ],
   "daco": [
    "fltcybercom"
   ],
   "mte": null,
   "note": "PEO Unmanned & Strike Weapons. ADCON: ASN(RD&A) → PEO(U&W). NAVAIR host command and TA support. NOT NAVAIR ADCON subordinate per SECNAVINST 5000.2G."
  },
  "navwar": {
   "adcon": [
    "cno"
   ]
  },
  "navsup": {
   "adcon": [
    "cno"
   ]
  },
  "navfac": {
   "adcon": [
    "cno"
   ]
  },
  "bumed": {
   "adcon": [
    "cno"
   ]
  },
  "ssp": {
   "adcon": [
    "cno"
   ]
  },
  "netc": {
   "adcon": [
    "chnavpers"
   ],
   "note": "Echelon 2, UIC 00076. ISIC: CHNAVPERS (not directly CNO). Source: SNDL. Note: SNDL shows NETC ISIC as CHNAVPERS, but NETC is listed as echelon 2 elsewhere."
  },
  "fl2": {
   "adcon": [
    "usffc"
   ]
  },
  "fl3": {
   "adcon": [
    "compacflt"
   ]
  },
  "fl5": {
   "adcon": [
    "navcent"
   ]
  },
  "fl6": {
   "adcon": [
    "naveur"
   ]
  },
  "fl7": {
   "adcon": [
    "compacflt"
   ]
  },
  "marforcom": {
   "opcon": [
    "northcom"
   ],
   "adcon": [
    "cmc"
   ]
  },
  "marforpac": {
   "opcon": [
    "indopacom"
   ],
   "adcon": [
    "cmc"
   ]
  },
  "marforres": {
   "adcon": [
    "cmc"
   ]
  },
  "frcse_mayport": {
   "adcon": [
    "frcse"
   ]
  },
  "frcw_fallon": {
   "adcon": [
    "frcw"
   ]
  },
  "frcsw_yuma": {
   "adcon": [
    "frcsw"
   ]
  },
  "frcsw_hi": {
   "adcon": [
    "frcsw"
   ]
  },
  "frcsw_ptmugu": {
   "adcon": [
    "frcw"
   ]
  },
  "peo_t": {
   "aa": [
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ],
   "note": "Echelon 1. ISIC: ASN(RD&A). PEO(T) = Tactical Aircraft Programs (F/A-18, EA-18G, E-2, next-gen tactical aircraft). NOT Training Systems. Verified per navair.navy.mil/organization/PEO-T."
  },
  "peo_ships": {
   "aa": [
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ]
  },
  "peo_cvn": {
   "aa": [
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ]
  },
  "peo_iws": {
   "aa": [
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ]
  },
  "peo_subs": {
   "aa": [
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ],
   "note": "SNDL shows three separate PEOs replacing former PEO(Subs): PEO SSN (Attack Submarines, UIC 48160), PEO SSBN (Strategic Submarines, UIC 4109A), PEO UWS (Undersea Warfare Systems, UIC 6669N). KMS retains single node pending view restructuring. Source: NAVSEA org chart Jul 2024."
  },
  "peo_c4i": {
   "aa": [
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ]
  },
  "peo_dig": {
   "aa": [
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ]
  },
  "peo_lmw": {
   "aa": [
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ],
   "note": "Echelon 1, UIC 52210. ISIC: ASN(RD&A). Formerly PEO LCS (renamed Mar 2018). PEO Littoral Mine Warfare was disestablished Jul 2011 — functions transferred here. Covers LCS, FFG-62, unmanned maritime systems, mine warfare. Source: SNDL + NAVSEA org chart Jul 2024."
  },
  "pma265": {
   "aa": [
    "peo_t",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ]
  },
  "pma299": {
   "aa": [
    "peo_a",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ],
   "note": "PMA-299 H-60 Multi-Mission Helicopters (MH-60R/S Seahawk). Under PEO(A). Verified per navair.navy.mil. Note: F-35 is under PEO(F-35)/JSF Program Office, not PMA-299."
  },
  "pma261": {
   "aa": [
    "peo_a",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ],
   "note": "PMA-261 Heavy Lift Helicopters (CH-53E Super Stallion / CH-53K King Stallion). Under PEO(A). Verified per navair.navy.mil."
  },
  "pma275": {
   "aa": [
    "peo_t",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ],
   "note": "PMA-275. E-2D Advanced Hawkeye / C-2A COD. Under PEO(T). NAVAIR TA."
  },
  "pma207": {
   "aa": [
    "peo_a",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ],
   "note": "PMA-207 Tactical Airlift. KC-130J Super Hercules, C-130T, C-40A. Under PEO(A). NAVAIR TA. FRCE designated depot for C/KC-130 MRO."
  },
  "f35jpo": {
   "aa": [
    "secaf",
    "secdef"
   ],
   "ta": [
    "navair"
   ],
   "note": "F-35 Lightning II Joint Program Office. PEO-level joint program. Reports to alternating service acquisition executive (currently AF per JSF Charter). NAVAIR retains airworthiness TA for F-35B/C. Led by LtGen (3-star). Located Crystal City, Arlington VA."
  },
  "pma263": {
   "aa": [
    "peo_uw",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ],
   "note": "PMA-263 Small Tactical UAS (RQ-21A Blackjack, RQ-20B Puma, etc). Under PEO(U&W). Verified per navair.navy.mil. Note: MQ-25 Stingray is PMA-268, not PMA-263."
  },
  "pma262": {
   "aa": [
    "peo_uw",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navair"
   ]
  },
  "asn_mra": {
   "adcon": [
    "secnav"
   ]
  },
  "asn_fmc": {
   "adcon": [
    "secnav"
   ]
  },
  "asn_eie": {
   "adcon": [
    "secnav"
   ]
  },
  "unsecnav": {
   "adcon": [
    "secnav"
   ]
  },
  "indopacom": {
   "adcon": [
    "secdef"
   ]
  },
  "eucom": {
   "adcon": [
    "secdef"
   ]
  },
  "centcom": {
   "adcon": [
    "secdef"
   ]
  },
  "africom": {
   "adcon": [
    "secdef"
   ]
  },
  "southcom": {
   "adcon": [
    "secdef"
   ]
  },
  "northcom": {
   "adcon": [
    "secdef"
   ]
  },
  "cybercom": {
   "adcon": [
    "secdef"
   ]
  },
  "dcdc": {
   "opcon": [
    "cybercom"
   ],
   "adcon": [
    "secdef"
   ],
   "note": "DoD Cyber Defense Command (formerly JFHQ-DODIN). Sub-unified command under CYBERCOM, designated 28 May 2025 per NDAA FY2025 § 1502 (P.L. 118-159). CDR dual-hatted as DISA Director. Executes DACO on behalf of CYBERCOM to secure, operate, and defend the DODIN."
  },
  "socom": {
   "adcon": [
    "secdef"
   ]
  },
  "transcom": {
   "adcon": [
    "secdef"
   ]
  },
  "stratcom": {
   "adcon": [
    "secdef"
   ]
  },
  "spacecom": {
   "adcon": [
    "secdef"
   ]
  },
  "potus": {
   "note": "Commander in Chief per Article II, U.S. Constitution. National Command Authority with SECDEF. COCOM authority flows POTUS → SECDEF → CCDR per 10 USC §164."
  },
  "secdef": {
   "adcon": [
    "potus"
   ],
   "note": "Secretary of Defense. Exercises authority, direction, and control over DoD per 10 USC §113. COCOM chain: POTUS → SECDEF → CCDR."
  },
  "secnav": {
   "adcon": [
    "secdef"
   ],
   "note": "Secretary of the Navy per 10 USC §8013 (formerly §5013). Responsible for all affairs of DoN. SECNAV → CNO/CMC for military matters. SECNAV → ASNs for civilian oversight. UIC 31698. Source: SNDL."
  },
  "cjcs": {
   "adcon": [
    "secdef"
   ],
   "note": "Chairman, Joint Chiefs of Staff per 10 USC §152. Principal military advisor to POTUS, NSC, and SECDEF. No command authority over CCMDs — advisory only."
  },
  "vcjcs": {
   "adcon": [
    "cjcs"
   ],
   "note": "Vice Chairman, Joint Chiefs of Staff per 10 USC §154."
  },
  "cno": {
   "adcon": [
    "secnav"
   ],
   "note": "Chief of Naval Operations per 10 USC §8033 (formerly §5033). Senior military officer of the Navy. Member JCS. Exercises ADCON over all Navy commands. UIC 00011. Source: SNDL."
  },
  "vcno": {
   "adcon": [
    "cno"
   ],
   "note": "Vice Chief of Naval Operations. Principal deputy to CNO. Full authority to act for CNO in all matters not specifically reserved by law."
  },
  "cmc": {
   "adcon": [
    "secnav"
   ],
   "note": "Commandant of the Marine Corps per 10 USC §8043 (formerly §5043). Senior military officer of the USMC. Member JCS."
  },
  "acmc": {
   "adcon": [
    "cmc"
   ],
   "note": "Assistant Commandant of the Marine Corps per 10 USC §8044 (formerly §5044)."
  },
  "usd_as": {
   "adcon": [
    "secdef"
   ],
   "note": "Under Secretary of Defense for Acquisition & Sustainment. Oversees DoD-wide acquisition policy including DoDI 5000.02 Adaptive Acquisition Framework."
  },
  "usd_re": {
   "adcon": [
    "secdef"
   ],
   "note": "Under Secretary of Defense for Research & Engineering."
  },
  "sa": {
   "adcon": [
    "secdef"
   ],
   "note": "Secretary of the Army."
  },
  "secaf": {
   "adcon": [
    "secdef"
   ],
   "note": "Secretary of the Air Force (also Space Force)."
  },
  "csa": {
   "adcon": [
    "sa"
   ],
   "note": "Chief of Staff, Army."
  },
  "csaf": {
   "adcon": [
    "secaf"
   ],
   "note": "Chief of Staff, Air Force."
  },
  "pca": {
   "adcon": [
    "secdef"
   ],
   "note": "Principal Cyber Advisor to SECDEF."
  },
  "marforcent": {
   "adcon": [
    "cmc"
   ],
   "opcon": [
    "centcom"
   ],
   "note": "Marine Forces Central Command. CENTCOM Marine component."
  },
  "marforeur": {
   "adcon": [
    "cmc"
   ],
   "opcon": [
    "eucom"
   ],
   "note": "Marine Forces Europe/Africa. EUCOM/AFRICOM Marine component. MajGen billet."
  },
  "marsoc": {
   "adcon": [
    "cmc"
   ],
   "opcon": [
    "socom"
   ],
   "note": "Marine Forces Special Operations Command (Marine Raider Command). SOCOM Marine component. Est. 24 Feb 2006. Camp Lejeune, NC."
  },
  "imef": {
   "adcon": [
    "marforpac"
   ],
   "note": "I Marine Expeditionary Force. LtGen. Camp Pendleton, CA. Contains 1st MarDiv, 3d MAW, 1st MLG."
  },
  "iimef": {
   "adcon": [
    "marforcom"
   ],
   "note": "II Marine Expeditionary Force. LtGen. Camp Lejeune, NC. Contains 2d MarDiv, 2d MAW, 2d MLG."
  },
  "iiimef": {
   "adcon": [
    "marforpac"
   ],
   "note": "III Marine Expeditionary Force. LtGen. Okinawa, Japan. Contains 3d MarDiv, 1st MAW, 3d MLG."
  },
  "dmaw": {
   "adcon": [
    "iiimef"
   ],
   "note": "1st Marine Aircraft Wing. BGen. Okinawa. ACE for III MEF."
  },
  "smaw": {
   "adcon": [
    "iimef"
   ],
   "note": "2d Marine Aircraft Wing. MajGen. MCAS Cherry Point, NC. ACE for II MEF."
  },
  "tmaw": {
   "adcon": [
    "imef"
   ],
   "note": "3d Marine Aircraft Wing. MajGen. MCAS Miramar, CA. ACE for I MEF."
  },
  "mag16": {
   "adcon": [
    "tmaw"
   ],
   "note": "Marine Aircraft Group 16. Col. MCAS Miramar, CA. Under 3d MAW."
  },
  "mag26": {
   "adcon": [
    "smaw"
   ],
   "note": "Marine Aircraft Group 26. Col. MCAS New River, NC. Under 2d MAW."
  },
  "mag36": {
   "adcon": [
    "dmaw"
   ],
   "note": "Marine Aircraft Group 36. Col. MCAS Futenma, Okinawa. Under 1st MAW."
  },
  "mlr": {
   "adcon": [
    "iiimef"
   ],
   "note": "3d Marine Littoral Regiment. Part of Force Design 2030 restructuring under III MEF."
  },
  "af16": {
   "adcon": [
    "csaf"
   ],
   "opcon": [
    "cybercom"
   ],
   "note": "16th Air Force / Air Forces Cyber. CYBERCOM Air Force component."
  },
  "arcyber": {
   "adcon": [
    "csa"
   ],
   "opcon": [
    "cybercom"
   ],
   "note": "Army Cyber Command / 2nd Army. CYBERCOM Army component."
  },
  "cg_cyber": {
   "opcon": [
    "cybercom"
   ],
   "note": "USCG Cyber Command. CYBERCOM Coast Guard component (DHS for ADCON)."
  },
  "spaceops": {
   "adcon": [
    "csaf"
   ],
   "opcon": [
    "spacecom"
   ],
   "note": "Space Operations Command. SPACECOM component."
  },
  "pms400": {
   "aa": [
    "peo_ships",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navsea"
   ],
   "note": "PMS-400 DDG-51. Under PEO Ships. NAVSEA TA."
  },
  "pms317": {
   "aa": [
    "peo_lmw",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navsea"
   ],
   "note": "FFG-62 program. Under PEO USC (formerly PEO LCS). NAVSEA TA."
  },
  "pms385": {
   "aa": [
    "peo_subs",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navsea"
   ],
   "note": "PMS-385 Virginia SSN. Under PEO SSN (Attack Submarines). NAVSEA TA."
  },
  "pms425": {
   "aa": [
    "peo_subs",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navsea"
   ],
   "note": "PMS-425 Columbia SSBN. Under PEO SSBN (Strategic Submarines). NAVSEA TA."
  },
  "pms394": {
   "aa": [
    "peo_cvn",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navsea"
   ],
   "note": "CVN-78 class. Under PEO Carriers. NAVSEA TA."
  },
  "pms500": {
   "aa": [
    "peo_ships",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navsea"
   ],
   "note": "PMS-500 LPD-17. Under PEO Ships. NAVSEA TA."
  },
  "pmw120": {
   "aa": [
    "peo_c4i",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navwar"
   ],
   "note": "PMW-120 Battlespace Awareness & Information Operations. Under PEO C4I. Note: CANES is PMW-160, not PMW-120. Corrected per peoc4i.navy.mil."
  },
  "pmw130": {
   "aa": [
    "peo_c4i",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navwar"
   ],
   "note": "PMW-130 Cybersecurity. Under PEO C4I. Corrected per peoc4i.navy.mil."
  },
  "pmw160": {
   "aa": [
    "peo_c4i",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navwar"
   ],
   "note": "PMW-160 Tactical Networks — includes CANES (Consolidated Afloat Networks & Enterprise Services) and Automated Digital Networking System. Under PEO C4I. Verified per peoc4i.navy.mil."
  },
  "pmw240": {
   "aa": [
    "peo_dig",
    "asn_rda",
    "secnav"
   ],
   "ta": [
    "navwar"
   ],
   "note": "PMW-240 Sea Warrior Program. Under PEO MLB (Manpower, Logistics & Business Solutions), NOT PEO C4I or PEO Digital. Corrected per peoc4i.navy.mil."
  },
  "cso": {
   "adcon": [
    "secaf"
   ],
   "note": "Chief of Space Operations. Senior military officer of the Space Force. Member JCS. Reports through Secretary of the Air Force."
  }
 },
 "views": {
  "strategic": {
   "label": "National Command Authority — NCA to COCOMs",
   "ids": [
    "potus",
    "secdef",
    "cjcs",
    "secnav",
    "sa",
    "secaf",
    "cno",
    "cmc",
    "csa",
    "csaf",
    "cso",
    "indopacom",
    "northcom",
    "southcom",
    "eucom",
    "centcom",
    "africom",
    "socom",
    "transcom",
    "stratcom",
    "spacecom",
    "cybercom"
   ],
   "pos": {
    "potus": [
     560,
     25
    ],
    "secdef": [
     560,
     105
    ],
    "cjcs": [
     820,
     105
    ],
    "secnav": [
     120,
     200
    ],
    "sa": [
     350,
     200
    ],
    "secaf": [
     580,
     200
    ],
    "cno": [
     50,
     295
    ],
    "cmc": [
     155,
     295
    ],
    "csa": [
     285,
     295
    ],
    "csaf": [
     415,
     295
    ],
    "cso": [
     540,
     295
    ],
    "indopacom": [
     75,
     395
    ],
    "northcom": [
     215,
     395
    ],
    "southcom": [
     355,
     395
    ],
    "eucom": [
     495,
     395
    ],
    "centcom": [
     635,
     395
    ],
    "africom": [
     775,
     395
    ],
    "socom": [
     100,
     480
    ],
    "transcom": [
     255,
     480
    ],
    "stratcom": [
     410,
     480
    ],
    "spacecom": [
     565,
     480
    ],
    "cybercom": [
     720,
     480
    ]
   },
   "links": [
    {
     "s": "potus",
     "t": "secdef",
     "a": "nca"
    },
    {
     "s": "secdef",
     "t": "cjcs",
     "a": "dac"
    },
    {
     "s": "secdef",
     "t": "secnav",
     "a": "dac"
    },
    {
     "s": "secdef",
     "t": "sa",
     "a": "dac"
    },
    {
     "s": "secdef",
     "t": "secaf",
     "a": "dac"
    },
    {
     "s": "secnav",
     "t": "cno",
     "a": "dac"
    },
    {
     "s": "secnav",
     "t": "cmc",
     "a": "dac"
    },
    {
     "s": "sa",
     "t": "csa",
     "a": "dac"
    },
    {
     "s": "secaf",
     "t": "csaf",
     "a": "dac"
    },
    {
     "s": "secaf",
     "t": "cso",
     "a": "dac"
    },
    {
     "s": "potus",
     "t": "indopacom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "northcom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "southcom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "eucom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "centcom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "africom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "socom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "transcom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "stratcom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "spacecom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "cybercom",
     "a": "cocom"
    }
   ]
  },
  "cocoms": {
   "label": "Combatant Commands — Geographic & Functional",
   "ids": [
    "potus",
    "secdef",
    "cjcs",
    "indopacom",
    "northcom",
    "eucom",
    "centcom",
    "southcom",
    "africom",
    "socom",
    "cybercom",
    "stratcom",
    "transcom",
    "spacecom",
    "compacflt",
    "marforpac",
    "usffc",
    "naveur",
    "marforeur",
    "navcent",
    "marforcent",
    "navso",
    "navspecwar",
    "marsoc",
    "fltcybercom",
    "marforcyber",
    "spaceops",
    "msc",
    "marforcom"
   ],
   "pos": {
    "potus": [
     550,
     20
    ],
    "secdef": [
     550,
     110
    ],
    "cjcs": [
     800,
     110
    ],
    "indopacom": [
     30,
     230
    ],
    "northcom": [
     210,
     230
    ],
    "eucom": [
     390,
     230
    ],
    "centcom": [
     570,
     230
    ],
    "southcom": [
     750,
     230
    ],
    "africom": [
     930,
     230
    ],
    "socom": [
     30,
     360
    ],
    "cybercom": [
     210,
     360
    ],
    "stratcom": [
     390,
     360
    ],
    "transcom": [
     570,
     360
    ],
    "spacecom": [
     750,
     360
    ],
    "compacflt": [
     30,
     490
    ],
    "marforpac": [
     180,
     490
    ],
    "usffc": [
     330,
     490
    ],
    "naveur": [
     480,
     490
    ],
    "marforeur": [
     630,
     490
    ],
    "navcent": [
     780,
     490
    ],
    "marforcent": [
     930,
     490
    ],
    "navso": [
     1080,
     490
    ],
    "navspecwar": [
     30,
     600
    ],
    "marsoc": [
     180,
     600
    ],
    "fltcybercom": [
     330,
     600
    ],
    "marforcyber": [
     480,
     600
    ],
    "spaceops": [
     750,
     490
    ],
    "msc": [
     630,
     600
    ],
    "marforcom": [
     210,
     600
    ]
   },
   "links": [
    {
     "s": "potus",
     "t": "secdef",
     "a": "nca"
    },
    {
     "s": "secdef",
     "t": "cjcs",
     "a": "dac"
    },
    {
     "s": "potus",
     "t": "indopacom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "northcom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "eucom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "centcom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "southcom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "africom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "socom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "cybercom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "stratcom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "transcom",
     "a": "cocom"
    },
    {
     "s": "potus",
     "t": "spacecom",
     "a": "cocom"
    },
    {
     "s": "indopacom",
     "t": "compacflt",
     "a": "opcon"
    },
    {
     "s": "indopacom",
     "t": "marforpac",
     "a": "opcon"
    },
    {
     "s": "northcom",
     "t": "usffc",
     "a": "opcon"
    },
    {
     "s": "eucom",
     "t": "naveur",
     "a": "opcon"
    },
    {
     "s": "eucom",
     "t": "marforeur",
     "a": "opcon"
    },
    {
     "s": "centcom",
     "t": "navcent",
     "a": "opcon"
    },
    {
     "s": "centcom",
     "t": "marforcent",
     "a": "opcon"
    },
    {
     "s": "southcom",
     "t": "navso",
     "a": "opcon"
    },
    {
     "s": "socom",
     "t": "navspecwar",
     "a": "opcon"
    },
    {
     "s": "socom",
     "t": "marsoc",
     "a": "opcon"
    },
    {
     "s": "cybercom",
     "t": "fltcybercom",
     "a": "opcon"
    },
    {
     "s": "cybercom",
     "t": "marforcyber",
     "a": "opcon"
    },
    {
     "s": "spacecom",
     "t": "spaceops",
     "a": "opcon"
    },
    {
     "s": "africom",
     "t": "naveur",
     "a": "opcon"
    },
    {
     "s": "transcom",
     "t": "msc",
     "a": "opcon"
    },
    {
     "s": "northcom",
     "t": "marforcom",
     "a": "opcon"
    },
    {
     "s": "stratcom",
     "t": "usffc",
     "a": "opcon"
    }
   ]
  },
  "don": {
   "label": "Department of the Navy — SECNAV to Echelon 2",
   "dh_map": {
    "usffc": "COMLANTFLT"
   },
   "ids": [
    "secnav",
    "unsecnav",
    "asn_rda",
    "asn_eie",
    "asn_fmc",
    "asn_mra",
    "cno",
    "cmc",
    "vcno",
    "acmc",
    "usffc",
    "compacflt",
    "naveur",
    "navcent",
    "navso",
    "fltcybercom",
    "navsea",
    "navair",
    "navwar",
    "navsup",
    "navfac",
    "ssp",
    "netc",
    "bumed",
    "cnic",
    "chnavpers",
    "navresfor",
    "marforcom",
    "marforpac",
    "marforres"
   ],
   "pos": {
    "secnav": [
     530,
     20
    ],
    "unsecnav": [
     290,
     20
    ],
    "asn_rda": [
     80,
     120
    ],
    "asn_eie": [
     240,
     120
    ],
    "asn_fmc": [
     400,
     120
    ],
    "asn_mra": [
     560,
     120
    ],
    "cno": [
     730,
     120
    ],
    "cmc": [
     930,
     120
    ],
    "vcno": [
     730,
     230
    ],
    "acmc": [
     930,
     230
    ],
    "usffc": [
     30,
     340
    ],
    "compacflt": [
     200,
     340
    ],
    "naveur": [
     370,
     340
    ],
    "navcent": [
     540,
     340
    ],
    "navso": [
     710,
     340
    ],
    "fltcybercom": [
     880,
     340
    ],
    "navsea": [
     30,
     450
    ],
    "navair": [
     200,
     450
    ],
    "navwar": [
     370,
     450
    ],
    "navsup": [
     540,
     450
    ],
    "navfac": [
     710,
     450
    ],
    "ssp": [
     880,
     450
    ],
    "netc": [
     1050,
     450
    ],
    "bumed": [
     1220,
     450
    ],
    "cnic": [
     1050,
     340
    ],
    "chnavpers": [
     1220,
     340
    ],
    "navresfor": [
     1390,
     340
    ],
    "marforcom": [
     1050,
     230
    ],
    "marforpac": [
     1220,
     230
    ],
    "marforres": [
     1390,
     230
    ]
   },
   "links": [
    {
     "s": "secnav",
     "t": "unsecnav",
     "a": "dac"
    },
    {
     "s": "secnav",
     "t": "asn_rda",
     "a": "dac"
    },
    {
     "s": "secnav",
     "t": "asn_eie",
     "a": "dac"
    },
    {
     "s": "secnav",
     "t": "asn_fmc",
     "a": "dac"
    },
    {
     "s": "secnav",
     "t": "asn_mra",
     "a": "dac"
    },
    {
     "s": "secnav",
     "t": "cno",
     "a": "dac"
    },
    {
     "s": "secnav",
     "t": "cmc",
     "a": "dac"
    },
    {
     "s": "cno",
     "t": "vcno",
     "a": "adcon"
    },
    {
     "s": "cmc",
     "t": "acmc",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "usffc",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "compacflt",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "naveur",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "navcent",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "navso",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "fltcybercom",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "navsea",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "navair",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "navwar",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "navsup",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "navfac",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "ssp",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "netc",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "bumed",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "cnic",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "chnavpers",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "navresfor",
     "a": "adcon"
    },
    {
     "s": "cmc",
     "t": "marforcom",
     "a": "adcon"
    },
    {
     "s": "cmc",
     "t": "marforpac",
     "a": "adcon"
    },
    {
     "s": "cmc",
     "t": "marforres",
     "a": "adcon"
    },
    {
     "s": "asn_rda",
     "t": "navsea",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "navair",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "navwar",
     "a": "aa"
    }
   ]
  },
  "navy_fleet": {
   "label": "Navy Operational — Fleets, Numbered Fleets, TYCOMs",
   "dh_map": {
    "usffc": "COMLANTFLT"
   },
   "ids": [
    "cno",
    "usffc",
    "compacflt",
    "naveur",
    "navcent",
    "navso",
    "fl2",
    "fl3",
    "fl5",
    "fl6",
    "fl7",
    "airlant",
    "surflant",
    "sublant",
    "navifor",
    "msc",
    "necc",
    "airpac",
    "surfpac",
    "subpac",
    "cnmoc",
    "nwdc"
   ],
   "pos": {
    "cno": [
     550,
     20
    ],
    "usffc": [
     100,
     130
    ],
    "compacflt": [
     350,
     130
    ],
    "naveur": [
     600,
     130
    ],
    "navcent": [
     800,
     130
    ],
    "navso": [
     1000,
     130
    ],
    "fl2": [
     30,
     260
    ],
    "airlant": [
     180,
     260
    ],
    "surflant": [
     330,
     260
    ],
    "sublant": [
     480,
     260
    ],
    "navifor": [
     630,
     260
    ],
    "msc": [
     30,
     380
    ],
    "necc": [
     180,
     380
    ],
    "nwdc": [
     330,
     380
    ],
    "cnmoc": [
     480,
     380
    ],
    "fl3": [
     30,
     500
    ],
    "fl7": [
     180,
     500
    ],
    "airpac": [
     330,
     500
    ],
    "surfpac": [
     480,
     500
    ],
    "subpac": [
     630,
     500
    ],
    "fl6": [
     750,
     260
    ],
    "fl5": [
     900,
     260
    ]
   },
   "links": [
    {
     "s": "cno",
     "t": "usffc",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "compacflt",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "naveur",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "navcent",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "navso",
     "a": "adcon"
    },
    {
     "s": "usffc",
     "t": "fl2",
     "a": "adcon"
    },
    {
     "s": "usffc",
     "t": "airlant",
     "a": "adcon"
    },
    {
     "s": "usffc",
     "t": "surflant",
     "a": "adcon"
    },
    {
     "s": "usffc",
     "t": "sublant",
     "a": "adcon"
    },
    {
     "s": "usffc",
     "t": "navifor",
     "a": "adcon"
    },
    {
     "s": "usffc",
     "t": "msc",
     "a": "adcon"
    },
    {
     "s": "usffc",
     "t": "necc",
     "a": "adcon"
    },
    {
     "s": "usffc",
     "t": "nwdc",
     "a": "adcon"
    },
    {
     "s": "usffc",
     "t": "cnmoc",
     "a": "adcon"
    },
    {
     "s": "compacflt",
     "t": "fl3",
     "a": "adcon"
    },
    {
     "s": "compacflt",
     "t": "fl7",
     "a": "adcon"
    },
    {
     "s": "compacflt",
     "t": "airpac",
     "a": "adcon"
    },
    {
     "s": "compacflt",
     "t": "surfpac",
     "a": "adcon"
    },
    {
     "s": "compacflt",
     "t": "subpac",
     "a": "adcon"
    },
    {
     "s": "naveur",
     "t": "fl6",
     "a": "adcon"
    },
    {
     "s": "navcent",
     "t": "fl5",
     "a": "adcon"
    }
   ]
  },
  "navy_syscom": {
   "label": "Navy Institutional — SYSCOMs, Warfare Centers, FRCs",
   "ids": [
    "cno",
    "asn_rda",
    "navsea",
    "navair",
    "navwar",
    "navsup",
    "navfac",
    "ssp",
    "nawcad",
    "nawcwd",
    "comfrc",
    "navrmc",
    "peo_a",
    "peo_uw",
    "peo_t",
    "peo_ships",
    "peo_subs",
    "peo_c4i",
    "frce",
    "frcse",
    "frcsw",
    "frcw",
    "frcwp",
    "frcma",
    "frcnw",
    "frc_ase",
    "frc_rmw",
    "frcsw_yuma",
    "frcsw_hi",
    "frcsw_ptmugu",
    "frcse_mayport",
    "frcw_fallon"
   ],
   "pos": {
    "cno": [
     500,
     20
    ],
    "asn_rda": [
     750,
     20
    ],
    "navsea": [
     100,
     140
    ],
    "navair": [
     400,
     140
    ],
    "navwar": [
     700,
     140
    ],
    "navsup": [
     950,
     140
    ],
    "navfac": [
     1100,
     140
    ],
    "ssp": [
     1250,
     140
    ],
    "peo_ships": [
     30,
     270
    ],
    "peo_subs": [
     180,
     270
    ],
    "navrmc": [
     330,
     270
    ],
    "peo_a": [
     430,
     270
    ],
    "peo_uw": [
     580,
     270
    ],
    "peo_t": [
     730,
     270
    ],
    "nawcad": [
     430,
     390
    ],
    "nawcwd": [
     580,
     390
    ],
    "comfrc": [
     730,
     390
    ],
    "peo_c4i": [
     880,
     270
    ],
    "frce": [
     50,
     510
    ],
    "frcse": [
     200,
     510
    ],
    "frcsw": [
     350,
     510
    ],
    "frcw": [
     500,
     510
    ],
    "frcwp": [
     650,
     510
    ],
    "frcma": [
     800,
     510
    ],
    "frcnw": [
     950,
     510
    ],
    "frc_ase": [
     1100,
     510
    ],
    "frc_rmw": [
     1250,
     510
    ],
    "frcsw_yuma": [
     280,
     620
    ],
    "frcsw_hi": [
     460,
     620
    ],
    "frcsw_ptmugu": [
     640,
     620
    ],
    "frcse_mayport": [
     100,
     620
    ],
    "frcw_fallon": [
     820,
     620
    ]
   },
   "links": [
    {
     "s": "cno",
     "t": "navsea",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "navair",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "navwar",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "navsup",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "navfac",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "ssp",
     "a": "adcon"
    },
    {
     "s": "asn_rda",
     "t": "navsea",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "navair",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "navwar",
     "a": "aa"
    },
    {
     "s": "navsea",
     "t": "peo_ships",
     "a": "align"
    },
    {
     "s": "navsea",
     "t": "peo_subs",
     "a": "align"
    },
    {
     "s": "navsea",
     "t": "navrmc",
     "a": "adcon"
    },
    {
     "s": "navair",
     "t": "peo_a",
     "a": "align"
    },
    {
     "s": "navair",
     "t": "peo_uw",
     "a": "align"
    },
    {
     "s": "navair",
     "t": "peo_t",
     "a": "align"
    },
    {
     "s": "navair",
     "t": "nawcad",
     "a": "adcon"
    },
    {
     "s": "navair",
     "t": "nawcwd",
     "a": "adcon"
    },
    {
     "s": "navair",
     "t": "comfrc",
     "a": "adcon"
    },
    {
     "s": "navwar",
     "t": "peo_c4i",
     "a": "align"
    },
    {
     "s": "comfrc",
     "t": "frce",
     "a": "adcon"
    },
    {
     "s": "comfrc",
     "t": "frcse",
     "a": "adcon"
    },
    {
     "s": "comfrc",
     "t": "frcsw",
     "a": "adcon"
    },
    {
     "s": "frcsw",
     "t": "frcw",
     "a": "adcon"
    },
    {
     "s": "comfrc",
     "t": "frcwp",
     "a": "adcon"
    },
    {
     "s": "comfrc",
     "t": "frcma",
     "a": "adcon"
    },
    {
     "s": "frcsw",
     "t": "frcnw",
     "a": "adcon"
    },
    {
     "s": "comfrc",
     "t": "frc_ase",
     "a": "adcon"
    },
    {
     "s": "comfrc",
     "t": "frc_rmw",
     "a": "align"
    },
    {
     "s": "frcse",
     "t": "frcse_mayport",
     "a": "adcon"
    },
    {
     "s": "frcsw",
     "t": "frcsw_yuma",
     "a": "adcon"
    },
    {
     "s": "frcsw",
     "t": "frcsw_hi",
     "a": "adcon"
    },
    {
     "s": "frcsw",
     "t": "frcsw_ptmugu",
     "a": "adcon"
    },
    {
     "s": "frcw",
     "t": "frcw_fallon",
     "a": "adcon"
    }
   ]
  },
  "navair_auth": {
   "label": "NAVAIR Authority — Acquisition | Industrial | TYCOM",
   "dh_map": {
    "usffc": "COMLANTFLT"
   },
   "ids": [
    "cno",
    "asn_rda",
    "navair",
    "usffc",
    "compacflt",
    "airlant",
    "airpac",
    "peo_a",
    "peo_uw",
    "peo_t",
    "comfrc",
    "nawcad",
    "nawcwd",
    "pma265",
    "pma299",
    "pma261",
    "pma272",
    "pma276",
    "pma281",
    "pma275",
    "pma263",
    "frce",
    "frcse",
    "frcsw",
    "frcw",
    "pma262"
   ],
   "pos": {
    "cno": [
     530,
     20
    ],
    "asn_rda": [
     780,
     20
    ],
    "navair": [
     530,
     115
    ],
    "usffc": [
     110,
     115
    ],
    "compacflt": [
     275,
     115
    ],
    "airlant": [
     110,
     225
    ],
    "airpac": [
     275,
     225
    ],
    "peo_a": [
     480,
     225
    ],
    "peo_uw": [
     628,
     225
    ],
    "peo_t": [
     776,
     225
    ],
    "comfrc": [
     924,
     225
    ],
    "nawcad": [
     1072,
     225
    ],
    "nawcwd": [
     1220,
     225
    ],
    "pma265": [
     340,
     340
    ],
    "pma299": [
     480,
     340
    ],
    "pma261": [
     620,
     340
    ],
    "pma272": [
     340,
     430
    ],
    "pma276": [
     480,
     430
    ],
    "pma281": [
     620,
     430
    ],
    "pma275": [
     760,
     430
    ],
    "pma263": [
     628,
     340
    ],
    "frce": [
     840,
     340
    ],
    "frcse": [
     980,
     340
    ],
    "frcsw": [
     1120,
     340
    ],
    "frcw": [
     1260,
     340
    ],
    "pma262": [
     776,
     340
    ]
   },
   "links": [
    {
     "s": "asn_rda",
     "t": "navair",
     "a": "aa"
    },
    {
     "s": "cno",
     "t": "navair",
     "a": "adcon"
    },
    {
     "s": "usffc",
     "t": "airlant",
     "a": "adcon"
    },
    {
     "s": "compacflt",
     "t": "airpac",
     "a": "adcon"
    },
    {
     "s": "navair",
     "t": "airlant",
     "a": "ta"
    },
    {
     "s": "navair",
     "t": "airpac",
     "a": "ta"
    },
    {
     "s": "navair",
     "t": "peo_a",
     "a": "align"
    },
    {
     "s": "navair",
     "t": "peo_uw",
     "a": "align"
    },
    {
     "s": "navair",
     "t": "peo_t",
     "a": "align"
    },
    {
     "s": "navair",
     "t": "comfrc",
     "a": "adcon"
    },
    {
     "s": "navair",
     "t": "nawcad",
     "a": "adcon"
    },
    {
     "s": "navair",
     "t": "nawcwd",
     "a": "adcon"
    },
    {
     "s": "peo_a",
     "t": "pma265",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma299",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma261",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma272",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma276",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma281",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma275",
     "a": "aa"
    },
    {
     "s": "peo_uw",
     "t": "pma263",
     "a": "aa"
    },
    {
     "s": "comfrc",
     "t": "frce",
     "a": "adcon"
    },
    {
     "s": "comfrc",
     "t": "frcse",
     "a": "adcon"
    },
    {
     "s": "comfrc",
     "t": "frcsw",
     "a": "adcon"
    },
    {
     "s": "frcsw",
     "t": "frcw",
     "a": "adcon"
    },
    {
     "s": "peo_uw",
     "t": "pma262",
     "a": "aa"
    },
    {
     "s": "frce",
     "t": "pma265",
     "a": "lcsp"
    },
    {
     "s": "frce",
     "t": "pma299",
     "a": "lcsp"
    },
    {
     "s": "frcse",
     "t": "pma265",
     "a": "lcsp"
    },
    {
     "s": "frcse",
     "t": "pma299",
     "a": "lcsp"
    },
    {
     "s": "frcse",
     "t": "pma261",
     "a": "lcsp"
    },
    {
     "s": "frcse",
     "t": "pma275",
     "a": "lcsp"
    },
    {
     "s": "frcsw",
     "t": "pma265",
     "a": "lcsp"
    },
    {
     "s": "frcsw",
     "t": "pma272",
     "a": "lcsp"
    },
    {
     "s": "frcsw",
     "t": "pma281",
     "a": "lcsp"
    },
    {
     "s": "frcsw",
     "t": "pma261",
     "a": "lcsp"
    },
    {
     "s": "frcw",
     "t": "pma265",
     "a": "lcsp"
    },
    {
     "s": "frcw",
     "t": "pma261",
     "a": "lcsp"
    },
    {
     "s": "frcw",
     "t": "pma275",
     "a": "lcsp"
    }
   ]
  },
  "usmc": {
   "label": "Marine Corps — CMC Chain",
   "ids": [
    "cmc",
    "acmc",
    "marforcom",
    "marforpac",
    "marforres",
    "marforcent",
    "marforeur",
    "iimef",
    "imef",
    "iiimef",
    "mlr",
    "dmaw",
    "smaw",
    "tmaw",
    "fmaw",
    "mag11",
    "mag12",
    "mag13",
    "mag14",
    "mag16",
    "mag24",
    "mag26",
    "mag29",
    "mag31",
    "mag36",
    "mag39",
    "mag41",
    "mag42",
    "mag49",
    "mals11",
    "mals12",
    "mals13",
    "mals14",
    "mals16",
    "mals24",
    "mals26",
    "mals29",
    "mals31",
    "mals36",
    "mals39",
    "mals41",
    "mals42",
    "mals49",
    "marsoc",
    "marforcyber"
   ],
   "pos": {
    "cmc": [
     640,
     25
    ],
    "acmc": [
     380,
     105
    ],
    "marsoc": [
     900,
     105
    ],
    "marforcyber": [
     1100,
     105
    ],
    "marforcom": [
     100,
     205
    ],
    "marforpac": [
     380,
     205
    ],
    "marforres": [
     660,
     205
    ],
    "marforcent": [
     940,
     205
    ],
    "marforeur": [
     1140,
     205
    ],
    "iimef": [
     100,
     305
    ],
    "imef": [
     340,
     305
    ],
    "iiimef": [
     540,
     305
    ],
    "fmaw": [
     740,
     305
    ],
    "mlr": [
     620,
     395
    ],
    "smaw": [
     100,
     395
    ],
    "tmaw": [
     350,
     395
    ],
    "dmaw": [
     560,
     395
    ],
    "mag14": [
     15,
     485
    ],
    "mag26": [
     115,
     485
    ],
    "mag29": [
     215,
     485
    ],
    "mag31": [
     315,
     485
    ],
    "mag11": [
     415,
     485
    ],
    "mag13": [
     515,
     485
    ],
    "mag16": [
     615,
     485
    ],
    "mag39": [
     715,
     485
    ],
    "mag12": [
     815,
     485
    ],
    "mag24": [
     915,
     485
    ],
    "mag36": [
     1015,
     485
    ],
    "mag41": [
     1115,
     485
    ],
    "mag42": [
     1215,
     485
    ],
    "mag49": [
     1315,
     485
    ],
    "mals14": [
     15,
     575
    ],
    "mals26": [
     115,
     575
    ],
    "mals29": [
     215,
     575
    ],
    "mals31": [
     315,
     575
    ],
    "mals11": [
     415,
     575
    ],
    "mals13": [
     515,
     575
    ],
    "mals16": [
     615,
     575
    ],
    "mals39": [
     715,
     575
    ],
    "mals12": [
     815,
     575
    ],
    "mals24": [
     915,
     575
    ],
    "mals36": [
     1015,
     575
    ],
    "mals41": [
     1115,
     575
    ],
    "mals42": [
     1215,
     575
    ],
    "mals49": [
     1315,
     575
    ]
   },
   "links": [
    {
     "s": "cmc",
     "t": "acmc",
     "a": "adcon"
    },
    {
     "s": "cmc",
     "t": "marforcom",
     "a": "adcon"
    },
    {
     "s": "cmc",
     "t": "marforpac",
     "a": "adcon"
    },
    {
     "s": "cmc",
     "t": "marforres",
     "a": "adcon"
    },
    {
     "s": "cmc",
     "t": "marforcent",
     "a": "adcon"
    },
    {
     "s": "cmc",
     "t": "marforeur",
     "a": "adcon"
    },
    {
     "s": "cmc",
     "t": "marsoc",
     "a": "adcon"
    },
    {
     "s": "cmc",
     "t": "marforcyber",
     "a": "adcon"
    },
    {
     "s": "marforcom",
     "t": "iimef",
     "a": "adcon"
    },
    {
     "s": "marforpac",
     "t": "imef",
     "a": "adcon"
    },
    {
     "s": "marforpac",
     "t": "iiimef",
     "a": "adcon"
    },
    {
     "s": "iiimef",
     "t": "mlr",
     "a": "adcon"
    },
    {
     "s": "marforres",
     "t": "fmaw",
     "a": "adcon"
    },
    {
     "s": "iimef",
     "t": "smaw",
     "a": "adcon"
    },
    {
     "s": "imef",
     "t": "tmaw",
     "a": "adcon"
    },
    {
     "s": "iiimef",
     "t": "dmaw",
     "a": "adcon"
    },
    {
     "s": "smaw",
     "t": "mag14",
     "a": "adcon"
    },
    {
     "s": "smaw",
     "t": "mag26",
     "a": "adcon"
    },
    {
     "s": "smaw",
     "t": "mag29",
     "a": "adcon"
    },
    {
     "s": "smaw",
     "t": "mag31",
     "a": "adcon"
    },
    {
     "s": "tmaw",
     "t": "mag11",
     "a": "adcon"
    },
    {
     "s": "tmaw",
     "t": "mag13",
     "a": "adcon"
    },
    {
     "s": "tmaw",
     "t": "mag16",
     "a": "adcon"
    },
    {
     "s": "tmaw",
     "t": "mag39",
     "a": "adcon"
    },
    {
     "s": "dmaw",
     "t": "mag12",
     "a": "adcon"
    },
    {
     "s": "dmaw",
     "t": "mag24",
     "a": "adcon"
    },
    {
     "s": "dmaw",
     "t": "mag36",
     "a": "adcon"
    },
    {
     "s": "fmaw",
     "t": "mag41",
     "a": "adcon"
    },
    {
     "s": "fmaw",
     "t": "mag42",
     "a": "adcon"
    },
    {
     "s": "fmaw",
     "t": "mag49",
     "a": "adcon"
    },
    {
     "s": "mag14",
     "t": "mals14",
     "a": "adcon"
    },
    {
     "s": "mag26",
     "t": "mals26",
     "a": "adcon"
    },
    {
     "s": "mag29",
     "t": "mals29",
     "a": "adcon"
    },
    {
     "s": "mag31",
     "t": "mals31",
     "a": "adcon"
    },
    {
     "s": "mag11",
     "t": "mals11",
     "a": "adcon"
    },
    {
     "s": "mag13",
     "t": "mals13",
     "a": "adcon"
    },
    {
     "s": "mag16",
     "t": "mals16",
     "a": "adcon"
    },
    {
     "s": "mag39",
     "t": "mals39",
     "a": "adcon"
    },
    {
     "s": "mag12",
     "t": "mals12",
     "a": "adcon"
    },
    {
     "s": "mag24",
     "t": "mals24",
     "a": "adcon"
    },
    {
     "s": "mag36",
     "t": "mals36",
     "a": "adcon"
    },
    {
     "s": "mag41",
     "t": "mals41",
     "a": "adcon"
    },
    {
     "s": "mag42",
     "t": "mals42",
     "a": "adcon"
    },
    {
     "s": "mag49",
     "t": "mals49",
     "a": "adcon"
    }
   ]
  },
  "acq": {
   "label": "Acquisition — ASN(RD&A) Chain",
   "ids": [
    "secnav",
    "asn_rda",
    "usd_as",
    "usd_re",
    "navsea",
    "navair",
    "navwar",
    "peo_a",
    "peo_uw",
    "peo_ships",
    "peo_subs",
    "peo_cvn",
    "peo_iws",
    "peo_c4i",
    "pma265",
    "pma299",
    "pma261",
    "pma272",
    "pma276",
    "pma281",
    "pma263",
    "pms400",
    "pms317",
    "pms385",
    "pms425",
    "pms394",
    "pmw120",
    "pmw130",
    "peo_lmw",
    "peo_dig",
    "pms500",
    "pmw160",
    "pmw240",
    "pma207",
    "f35jpo",
    "peo_t",
    "secaf"
   ],
   "pos": {
    "secnav": [
     640,
     20
    ],
    "asn_rda": [
     640,
     95
    ],
    "usd_as": [
     900,
     20
    ],
    "usd_re": [
     1060,
     20
    ],
    "navsea": [
     90,
     185
    ],
    "navair": [
     330,
     185
    ],
    "navwar": [
     570,
     185
    ],
    "peo_ships": [
     30,
     275
    ],
    "peo_subs": [
     130,
     275
    ],
    "peo_cvn": [
     220,
     275
    ],
    "peo_iws": [
     310,
     275
    ],
    "peo_a": [
     285,
     275
    ],
    "peo_uw": [
     400,
     275
    ],
    "peo_c4i": [
     540,
     275
    ],
    "pms400": [
     20,
     360
    ],
    "pms317": [
     105,
     360
    ],
    "pms385": [
     185,
     360
    ],
    "pms425": [
     265,
     360
    ],
    "pms394": [
     345,
     360
    ],
    "pma265": [
     270,
     360
    ],
    "pma299": [
     365,
     360
    ],
    "pma261": [
     455,
     360
    ],
    "pma272": [
     545,
     360
    ],
    "pma276": [
     635,
     360
    ],
    "pma281": [
     725,
     360
    ],
    "pma263": [
     810,
     360
    ],
    "pmw120": [
     530,
     360
    ],
    "pmw130": [
     630,
     360
    ],
    "peo_lmw": [
     400,
     275
    ],
    "peo_dig": [
     680,
     275
    ],
    "pms500": [
     425,
     360
    ],
    "pmw160": [
     720,
     360
    ],
    "pmw240": [
     810,
     360
    ],
    "pma207": [
     900,
     360
    ],
    "peo_t": [
     485,
     275
    ],
    "f35jpo": [
     1060,
     185
    ],
    "secaf": [
     1060,
     95
    ]
   },
   "links": [
    {
     "s": "secnav",
     "t": "asn_rda",
     "a": "dac"
    },
    {
     "s": "usd_as",
     "t": "asn_rda",
     "a": "dac"
    },
    {
     "s": "usd_re",
     "t": "asn_rda",
     "a": "dac"
    },
    {
     "s": "asn_rda",
     "t": "navsea",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "navair",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "navwar",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "peo_a",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "peo_uw",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "peo_ships",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "peo_subs",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "peo_cvn",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "peo_iws",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "peo_c4i",
     "a": "aa"
    },
    {
     "s": "navsea",
     "t": "peo_ships",
     "a": "align"
    },
    {
     "s": "navsea",
     "t": "peo_subs",
     "a": "align"
    },
    {
     "s": "navsea",
     "t": "peo_cvn",
     "a": "align"
    },
    {
     "s": "navsea",
     "t": "peo_iws",
     "a": "align"
    },
    {
     "s": "navair",
     "t": "peo_a",
     "a": "align"
    },
    {
     "s": "navair",
     "t": "peo_uw",
     "a": "align"
    },
    {
     "s": "navwar",
     "t": "peo_c4i",
     "a": "align"
    },
    {
     "s": "peo_ships",
     "t": "pms400",
     "a": "aa"
    },
    {
     "s": "peo_ships",
     "t": "pms317",
     "a": "aa"
    },
    {
     "s": "peo_ships",
     "t": "pms394",
     "a": "aa"
    },
    {
     "s": "peo_subs",
     "t": "pms385",
     "a": "aa"
    },
    {
     "s": "peo_subs",
     "t": "pms425",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma265",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma299",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma261",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma272",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma276",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma281",
     "a": "aa"
    },
    {
     "s": "peo_uw",
     "t": "pma263",
     "a": "aa"
    },
    {
     "s": "peo_c4i",
     "t": "pmw120",
     "a": "aa"
    },
    {
     "s": "peo_c4i",
     "t": "pmw130",
     "a": "aa"
    },
    {
     "s": "navsea",
     "t": "peo_lmw",
     "a": "align"
    },
    {
     "s": "navwar",
     "t": "peo_dig",
     "a": "align"
    },
    {
     "s": "peo_lmw",
     "t": "pms500",
     "a": "aa"
    },
    {
     "s": "peo_c4i",
     "t": "pmw160",
     "a": "aa"
    },
    {
     "s": "peo_c4i",
     "t": "pmw240",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma207",
     "a": "aa"
    },
    {
     "s": "navair",
     "t": "peo_t",
     "a": "align"
    },
    {
     "s": "asn_rda",
     "t": "peo_t",
     "a": "aa"
    },
    {
     "s": "secaf",
     "t": "f35jpo",
     "a": "aa"
    },
    {
     "s": "navair",
     "t": "f35jpo",
     "a": "ta"
    }
   ]
  },
  "ta_navair": {
   "label": "NAVAIR TA — Aviation Weapon System Authority",
   "ids": [
    "asn_rda",
    "navair",
    "peo_a",
    "peo_uw",
    "peo_t",
    "f35jpo",
    "pma265",
    "pma299",
    "pma261",
    "pma272",
    "pma276",
    "pma281",
    "pma275",
    "pma207",
    "pma263",
    "pma262",
    "mals11",
    "mals12",
    "mals13",
    "mals14",
    "mals16",
    "mals24",
    "mals26",
    "mals29",
    "mals31",
    "mals36",
    "mals39",
    "mals41",
    "mals49",
    "frce",
    "frcse",
    "frcsw",
    "frcw"
   ],
   "pos": {
    "asn_rda": [
     500,
     20
    ],
    "navair": [
     500,
     100
    ],
    "f35jpo": [
     780,
     100
    ],
    "peo_a": [
     200,
     190
    ],
    "peo_uw": [
     450,
     190
    ],
    "peo_t": [
     650,
     190
    ],
    "pma265": [
     50,
     280
    ],
    "pma299": [
     150,
     280
    ],
    "pma261": [
     250,
     280
    ],
    "pma272": [
     350,
     280
    ],
    "pma276": [
     450,
     280
    ],
    "pma281": [
     550,
     280
    ],
    "pma275": [
     650,
     280
    ],
    "pma207": [
     750,
     280
    ],
    "pma263": [
     850,
     280
    ],
    "pma262": [
     950,
     280
    ],
    "mals11": [
     50,
     410
    ],
    "mals12": [
     150,
     410
    ],
    "mals13": [
     250,
     410
    ],
    "mals14": [
     350,
     410
    ],
    "mals16": [
     450,
     410
    ],
    "mals24": [
     550,
     410
    ],
    "mals26": [
     650,
     410
    ],
    "mals29": [
     750,
     410
    ],
    "mals31": [
     850,
     410
    ],
    "mals36": [
     950,
     410
    ],
    "mals39": [
     1050,
     410
    ],
    "mals41": [
     1150,
     410
    ],
    "mals49": [
     1250,
     410
    ],
    "frce": [
     200,
     510
    ],
    "frcse": [
     400,
     510
    ],
    "frcsw": [
     600,
     510
    ],
    "frcw": [
     800,
     510
    ]
   },
   "links": [
    {
     "s": "asn_rda",
     "t": "navair",
     "a": "aa"
    },
    {
     "s": "navair",
     "t": "peo_a",
     "a": "align"
    },
    {
     "s": "navair",
     "t": "peo_uw",
     "a": "align"
    },
    {
     "s": "navair",
     "t": "peo_t",
     "a": "align"
    },
    {
     "s": "asn_rda",
     "t": "peo_a",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "peo_uw",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "peo_t",
     "a": "aa"
    },
    {
     "s": "navair",
     "t": "f35jpo",
     "a": "ta"
    },
    {
     "s": "peo_a",
     "t": "pma299",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma261",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma272",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma276",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma207",
     "a": "aa"
    },
    {
     "s": "peo_uw",
     "t": "pma281",
     "a": "aa"
    },
    {
     "s": "peo_uw",
     "t": "pma263",
     "a": "aa"
    },
    {
     "s": "peo_uw",
     "t": "pma262",
     "a": "aa"
    },
    {
     "s": "peo_t",
     "t": "pma265",
     "a": "aa"
    },
    {
     "s": "peo_t",
     "t": "pma275",
     "a": "aa"
    },
    {
     "s": "pma265",
     "t": "mals11",
     "a": "ta"
    },
    {
     "s": "f35jpo",
     "t": "mals11",
     "a": "ta"
    },
    {
     "s": "pma207",
     "t": "mals11",
     "a": "ta"
    },
    {
     "s": "f35jpo",
     "t": "mals12",
     "a": "ta"
    },
    {
     "s": "pma207",
     "t": "mals12",
     "a": "ta"
    },
    {
     "s": "f35jpo",
     "t": "mals13",
     "a": "ta"
    },
    {
     "s": "pma263",
     "t": "mals13",
     "a": "ta"
    },
    {
     "s": "f35jpo",
     "t": "mals14",
     "a": "ta"
    },
    {
     "s": "pma263",
     "t": "mals14",
     "a": "ta"
    },
    {
     "s": "pma207",
     "t": "mals14",
     "a": "ta"
    },
    {
     "s": "pma261",
     "t": "mals16",
     "a": "ta"
    },
    {
     "s": "pma272",
     "t": "mals16",
     "a": "ta"
    },
    {
     "s": "pma272",
     "t": "mals24",
     "a": "ta"
    },
    {
     "s": "pma263",
     "t": "mals24",
     "a": "ta"
    },
    {
     "s": "pma207",
     "t": "mals24",
     "a": "ta"
    },
    {
     "s": "pma272",
     "t": "mals26",
     "a": "ta"
    },
    {
     "s": "pma261",
     "t": "mals29",
     "a": "ta"
    },
    {
     "s": "pma276",
     "t": "mals29",
     "a": "ta"
    },
    {
     "s": "pma265",
     "t": "mals31",
     "a": "ta"
    },
    {
     "s": "f35jpo",
     "t": "mals31",
     "a": "ta"
    },
    {
     "s": "pma272",
     "t": "mals36",
     "a": "ta"
    },
    {
     "s": "pma276",
     "t": "mals39",
     "a": "ta"
    },
    {
     "s": "pma272",
     "t": "mals39",
     "a": "ta"
    },
    {
     "s": "pma265",
     "t": "mals41",
     "a": "ta"
    },
    {
     "s": "pma276",
     "t": "mals41",
     "a": "ta"
    },
    {
     "s": "pma207",
     "t": "mals41",
     "a": "ta"
    },
    {
     "s": "pma261",
     "t": "mals49",
     "a": "ta"
    },
    {
     "s": "pma276",
     "t": "mals49",
     "a": "ta"
    },
    {
     "s": "pma272",
     "t": "mals49",
     "a": "ta"
    },
    {
     "s": "mals11",
     "t": "pma265",
     "a": "lcsp"
    },
    {
     "s": "mals11",
     "t": "f35jpo",
     "a": "lcsp"
    },
    {
     "s": "mals11",
     "t": "pma207",
     "a": "lcsp"
    },
    {
     "s": "mals12",
     "t": "f35jpo",
     "a": "lcsp"
    },
    {
     "s": "mals12",
     "t": "pma207",
     "a": "lcsp"
    },
    {
     "s": "mals13",
     "t": "f35jpo",
     "a": "lcsp"
    },
    {
     "s": "mals13",
     "t": "pma263",
     "a": "lcsp"
    },
    {
     "s": "mals14",
     "t": "f35jpo",
     "a": "lcsp"
    },
    {
     "s": "mals14",
     "t": "pma263",
     "a": "lcsp"
    },
    {
     "s": "mals14",
     "t": "pma207",
     "a": "lcsp"
    },
    {
     "s": "mals16",
     "t": "pma261",
     "a": "lcsp"
    },
    {
     "s": "mals16",
     "t": "pma272",
     "a": "lcsp"
    },
    {
     "s": "mals24",
     "t": "pma272",
     "a": "lcsp"
    },
    {
     "s": "mals24",
     "t": "pma263",
     "a": "lcsp"
    },
    {
     "s": "mals24",
     "t": "pma207",
     "a": "lcsp"
    },
    {
     "s": "mals26",
     "t": "pma272",
     "a": "lcsp"
    },
    {
     "s": "mals29",
     "t": "pma261",
     "a": "lcsp"
    },
    {
     "s": "mals29",
     "t": "pma276",
     "a": "lcsp"
    },
    {
     "s": "mals31",
     "t": "pma265",
     "a": "lcsp"
    },
    {
     "s": "mals31",
     "t": "f35jpo",
     "a": "lcsp"
    },
    {
     "s": "mals36",
     "t": "pma272",
     "a": "lcsp"
    },
    {
     "s": "mals39",
     "t": "pma276",
     "a": "lcsp"
    },
    {
     "s": "mals39",
     "t": "pma272",
     "a": "lcsp"
    },
    {
     "s": "mals41",
     "t": "pma265",
     "a": "lcsp"
    },
    {
     "s": "mals41",
     "t": "pma276",
     "a": "lcsp"
    },
    {
     "s": "mals41",
     "t": "pma207",
     "a": "lcsp"
    },
    {
     "s": "mals49",
     "t": "pma261",
     "a": "lcsp"
    },
    {
     "s": "mals49",
     "t": "pma276",
     "a": "lcsp"
    },
    {
     "s": "mals49",
     "t": "pma272",
     "a": "lcsp"
    },
    {
     "s": "frce",
     "t": "pma265",
     "a": "lcsp"
    },
    {
     "s": "frce",
     "t": "pma299",
     "a": "lcsp"
    },
    {
     "s": "frcse",
     "t": "pma265",
     "a": "lcsp"
    },
    {
     "s": "frcse",
     "t": "pma299",
     "a": "lcsp"
    },
    {
     "s": "frcse",
     "t": "pma261",
     "a": "lcsp"
    },
    {
     "s": "frcse",
     "t": "pma275",
     "a": "lcsp"
    },
    {
     "s": "frcsw",
     "t": "pma265",
     "a": "lcsp"
    },
    {
     "s": "frcsw",
     "t": "pma272",
     "a": "lcsp"
    },
    {
     "s": "frcsw",
     "t": "pma281",
     "a": "lcsp"
    },
    {
     "s": "frcsw",
     "t": "pma261",
     "a": "lcsp"
    },
    {
     "s": "frcw",
     "t": "pma265",
     "a": "lcsp"
    },
    {
     "s": "frcw",
     "t": "pma261",
     "a": "lcsp"
    },
    {
     "s": "frcw",
     "t": "pma275",
     "a": "lcsp"
    }
   ]
  },
  "ta_navsea": {
   "label": "NAVSEA TA — Ship/Sub Weapon System Authority",
   "ids": [
    "asn_rda",
    "navsea",
    "peo_ships",
    "peo_subs",
    "peo_cvn",
    "peo_iws",
    "peo_lmw",
    "pms400",
    "pms317",
    "pms385",
    "pms425",
    "pms394",
    "pms500"
   ],
   "pos": {
    "asn_rda": [
     400,
     20
    ],
    "navsea": [
     400,
     100
    ],
    "peo_ships": [
     100,
     190
    ],
    "peo_subs": [
     280,
     190
    ],
    "peo_cvn": [
     460,
     190
    ],
    "peo_iws": [
     640,
     190
    ],
    "peo_lmw": [
     820,
     190
    ],
    "pms400": [
     50,
     280
    ],
    "pms317": [
     820,
     280
    ],
    "pms385": [
     230,
     280
    ],
    "pms425": [
     330,
     280
    ],
    "pms394": [
     460,
     280
    ],
    "pms500": [
     150,
     280
    ]
   },
   "links": [
    {
     "s": "asn_rda",
     "t": "navsea",
     "a": "aa"
    },
    {
     "s": "navsea",
     "t": "peo_ships",
     "a": "align"
    },
    {
     "s": "navsea",
     "t": "peo_subs",
     "a": "align"
    },
    {
     "s": "navsea",
     "t": "peo_cvn",
     "a": "align"
    },
    {
     "s": "navsea",
     "t": "peo_iws",
     "a": "align"
    },
    {
     "s": "navsea",
     "t": "peo_lmw",
     "a": "align"
    },
    {
     "s": "asn_rda",
     "t": "peo_ships",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "peo_subs",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "peo_cvn",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "peo_iws",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "peo_lmw",
     "a": "aa"
    },
    {
     "s": "peo_ships",
     "t": "pms400",
     "a": "aa"
    },
    {
     "s": "peo_ships",
     "t": "pms500",
     "a": "aa"
    },
    {
     "s": "peo_subs",
     "t": "pms385",
     "a": "aa"
    },
    {
     "s": "peo_subs",
     "t": "pms425",
     "a": "aa"
    },
    {
     "s": "peo_cvn",
     "t": "pms394",
     "a": "aa"
    },
    {
     "s": "peo_lmw",
     "t": "pms317",
     "a": "aa"
    }
   ]
  },
  "ta_navwar": {
   "label": "NAVWAR TA — C4I/Cyber System Authority",
   "ids": [
    "asn_rda",
    "navwar",
    "peo_c4i",
    "peo_dig",
    "pmw120",
    "pmw130",
    "pmw160",
    "pmw240"
   ],
   "pos": {
    "asn_rda": [
     350,
     20
    ],
    "navwar": [
     350,
     100
    ],
    "peo_c4i": [
     200,
     190
    ],
    "peo_dig": [
     500,
     190
    ],
    "pmw120": [
     100,
     280
    ],
    "pmw130": [
     200,
     280
    ],
    "pmw160": [
     300,
     280
    ],
    "pmw240": [
     500,
     280
    ]
   },
   "links": [
    {
     "s": "asn_rda",
     "t": "navwar",
     "a": "aa"
    },
    {
     "s": "navwar",
     "t": "peo_c4i",
     "a": "align"
    },
    {
     "s": "navwar",
     "t": "peo_dig",
     "a": "align"
    },
    {
     "s": "asn_rda",
     "t": "peo_c4i",
     "a": "aa"
    },
    {
     "s": "asn_rda",
     "t": "peo_dig",
     "a": "aa"
    },
    {
     "s": "peo_c4i",
     "t": "pmw120",
     "a": "aa"
    },
    {
     "s": "peo_c4i",
     "t": "pmw130",
     "a": "aa"
    },
    {
     "s": "peo_c4i",
     "t": "pmw160",
     "a": "aa"
    },
    {
     "s": "peo_dig",
     "t": "pmw240",
     "a": "aa"
    }
   ]
  },
  "mals": {
   "label": "MALS — Authority Convergence",
   "ids": [
    "potus",
    "secdef",
    "cmc",
    "cno",
    "indopacom",
    "marforpac",
    "imef",
    "tmaw",
    "mag16",
    "mals16",
    "asn_rda",
    "navair",
    "peo_a",
    "pma281",
    "pma272",
    "pma276",
    "cybercom",
    "dcdc",
    "marforcyber"
   ],
   "pos": {
    "potus": [
     450,
     20
    ],
    "secdef": [
     450,
     95
    ],
    "cmc": [
     200,
     180
    ],
    "cno": [
     700,
     180
    ],
    "asn_rda": [
     950,
     180
    ],
    "indopacom": [
     155,
     270
    ],
    "marforpac": [
     290,
     270
    ],
    "navair": [
     700,
     270
    ],
    "cybercom": [
     950,
     270
    ],
    "imef": [
     240,
     360
    ],
    "tmaw": [
     370,
     360
    ],
    "peo_a": [
     700,
     360
    ],
    "dcdc": [
     880,
     360
    ],
    "marforcyber": [
     1010,
     360
    ],
    "mag16": [
     370,
     450
    ],
    "mals16": [
     370,
     540
    ],
    "pma281": [
     600,
     450
    ],
    "pma272": [
     730,
     450
    ],
    "pma276": [
     855,
     450
    ]
   },
   "links": [
    {
     "s": "potus",
     "t": "secdef",
     "a": "nca"
    },
    {
     "s": "secdef",
     "t": "cmc",
     "a": "dac"
    },
    {
     "s": "secdef",
     "t": "cno",
     "a": "dac"
    },
    {
     "s": "secdef",
     "t": "asn_rda",
     "a": "dac"
    },
    {
     "s": "indopacom",
     "t": "marforpac",
     "a": "opcon"
    },
    {
     "s": "marforpac",
     "t": "imef",
     "a": "adcon"
    },
    {
     "s": "imef",
     "t": "tmaw",
     "a": "adcon"
    },
    {
     "s": "tmaw",
     "t": "mag16",
     "a": "adcon"
    },
    {
     "s": "mag16",
     "t": "mals16",
     "a": "adcon"
    },
    {
     "s": "cmc",
     "t": "marforpac",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "navair",
     "a": "adcon"
    },
    {
     "s": "asn_rda",
     "t": "navair",
     "a": "aa"
    },
    {
     "s": "navair",
     "t": "peo_a",
     "a": "align"
    },
    {
     "s": "peo_a",
     "t": "pma281",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma272",
     "a": "aa"
    },
    {
     "s": "peo_a",
     "t": "pma276",
     "a": "aa"
    },
    {
     "s": "pma281",
     "t": "mals16",
     "a": "ta"
    },
    {
     "s": "pma272",
     "t": "mals16",
     "a": "ta"
    },
    {
     "s": "pma276",
     "t": "mals16",
     "a": "ta"
    },
    {
     "s": "mals16",
     "t": "pma281",
     "a": "lcsp"
    },
    {
     "s": "mals16",
     "t": "pma272",
     "a": "lcsp"
    },
    {
     "s": "mals16",
     "t": "pma276",
     "a": "lcsp"
    },
    {
     "s": "potus",
     "t": "cybercom",
     "a": "cocom"
    },
    {
     "s": "cybercom",
     "t": "dcdc",
     "a": "cyber"
    },
    {
     "s": "dcdc",
     "t": "marforcyber",
     "a": "cyber"
    },
    {
     "s": "marforcyber",
     "t": "mals16",
     "a": "cyber"
    }
   ]
  },
  "cyber": {
   "label": "DACO — Cyber Command Chain",
   "ids": [
    "potus",
    "secdef",
    "cjcs",
    "pca",
    "secnav",
    "cno",
    "cmc",
    "cybercom",
    "dcdc",
    "fltcybercom",
    "fl10",
    "arcyber",
    "af16",
    "marforcyber",
    "cg_cyber",
    "navifor",
    "navwar",
    "pmw120",
    "pmw130"
   ],
   "pos": {
    "potus": [
     560,
     25
    ],
    "secdef": [
     560,
     105
    ],
    "cjcs": [
     820,
     105
    ],
    "pca": [
     300,
     105
    ],
    "secnav": [
     300,
     200
    ],
    "cno": [
     190,
     295
    ],
    "cmc": [
     420,
     295
    ],
    "cybercom": [
     740,
     200
    ],
    "dcdc": [
     560,
     295
    ],
    "fltcybercom": [
     600,
     390
    ],
    "fl10": [
     600,
     490
    ],
    "arcyber": [
     740,
     390
    ],
    "af16": [
     880,
     390
    ],
    "marforcyber": [
     1020,
     390
    ],
    "cg_cyber": [
     740,
     490
    ],
    "navifor": [
     185,
     375
    ],
    "navwar": [
     340,
     375
    ],
    "pmw120": [
     310,
     455
    ],
    "pmw130": [
     440,
     455
    ]
   },
   "links": [
    {
     "s": "potus",
     "t": "secdef",
     "a": "nca"
    },
    {
     "s": "secdef",
     "t": "cjcs",
     "a": "dac"
    },
    {
     "s": "secdef",
     "t": "pca",
     "a": "dac"
    },
    {
     "s": "secdef",
     "t": "secnav",
     "a": "dac"
    },
    {
     "s": "secnav",
     "t": "cno",
     "a": "dac"
    },
    {
     "s": "secnav",
     "t": "cmc",
     "a": "dac"
    },
    {
     "s": "potus",
     "t": "cybercom",
     "a": "cocom"
    },
    {
     "s": "cybercom",
     "t": "fltcybercom",
     "a": "opcon"
    },
    {
     "s": "cybercom",
     "t": "arcyber",
     "a": "opcon"
    },
    {
     "s": "cybercom",
     "t": "af16",
     "a": "opcon"
    },
    {
     "s": "cybercom",
     "t": "marforcyber",
     "a": "opcon"
    },
    {
     "s": "cybercom",
     "t": "cg_cyber",
     "a": "opcon"
    },
    {
     "s": "fltcybercom",
     "t": "fl10",
     "a": "opcon"
    },
    {
     "s": "cybercom",
     "t": "dcdc",
     "a": "cyber"
    },
    {
     "s": "dcdc",
     "t": "fltcybercom",
     "a": "cyber"
    },
    {
     "s": "dcdc",
     "t": "arcyber",
     "a": "cyber"
    },
    {
     "s": "dcdc",
     "t": "af16",
     "a": "cyber"
    },
    {
     "s": "dcdc",
     "t": "marforcyber",
     "a": "cyber"
    },
    {
     "s": "dcdc",
     "t": "cg_cyber",
     "a": "cyber"
    },
    {
     "s": "cno",
     "t": "navifor",
     "a": "adcon"
    },
    {
     "s": "cno",
     "t": "navwar",
     "a": "adcon"
    },
    {
     "s": "navwar",
     "t": "pmw120",
     "a": "ta"
    },
    {
     "s": "navwar",
     "t": "pmw130",
     "a": "ta"
    }
   ]
  }
 },
 "documents": [
  {
   "id": "jp1",
   "type": "JOINT PUB",
   "service": "Joint",
   "number": "JP 1",
   "title": "JP 1 — Doctrine for the Armed Forces of the US",
   "date": "2023-03-25",
   "classification": "UNCLASSIFIED",
   "issuer": "CJCS",
   "affects": [
    "potus",
    "secdef",
    "cjcs",
    "indopacom",
    "northcom",
    "eucom",
    "centcom",
    "cybercom",
    "usffc",
    "compacflt",
    "marforpac",
    "marforcom"
   ],
   "chain": [
    "POTUS",
    "SECDEF",
    "CJCS",
    "COCOM CDRs"
   ],
   "refs": [
    "10 U.S.C. §§ 161-167",
    "DoDD 5100.01",
    "UCP"
   ],
   "tags": [
    "t-joint",
    "t-doc"
   ],
   "summary": "Capstone joint doctrine. Defines COCOM, OPCON, TACON, ADCON. Critically: ADCON flows through the Military Department (SECNAV), NOT through the operational chain. UIC/PUC hierarchy is the administrative expression of ADCON.",
   "body": "<p>Key authority definitions:</p><ul><li><span>COCOM</span> — Non-transferable to below combatant command level; all aspects of military ops</li><li><span>OPCON</span> — Delegable; organize/employ forces; excludes logistics and discipline</li><li><span>TACON</span> — Local direction; limited scope and duration</li><li><strong>ADCON</strong> — Administration and support; retained by SECNAV even when forces are OPCON to a COCOM. The UIC/PUC chain maps this authority. A MALS's PUC chain flows through the MAG → MAW → MEF → MARFOR → CMC → SECNAV regardless of COCOM assignment.</li></ul>"
  },
  {
   "id": "jp3_12",
   "type": "JOINT PUB",
   "service": "Joint",
   "number": "JP 3-12",
   "title": "JP 3-12 — Cyberspace Operations",
   "date": "2022-12-19",
   "classification": "UNCLASSIFIED",
   "issuer": "CJCS",
   "affects": [
    "cybercom",
    "fltcybercom",
    "arcyber",
    "af16",
    "marforcyber",
    "cg_cyber",
    "pca",
    "navifor"
   ],
   "chain": [
    "POTUS",
    "SECDEF",
    "CJCS",
    "CYBERCOM",
    "SCCs"
   ],
   "refs": [
    "10 U.S.C. § 394",
    "DoDD 8000.01",
    "JP 1"
   ],
   "tags": [
    "t-joint",
    "t-doc",
    "t-cyber"
   ],
   "summary": "Defines DODIN Ops, DCO, OCO. Establishes DACO framework. DACO authority for MALS networks flows CYBERCOM → FLTCYBERCOM → MARFORCYBER → MEF/MAW/MALS.",
   "body": "<p><strong>DACO (Defensive Actions in Cyberspace Operations):</strong></p><ul><li>Authority flows: CYBERCOM → FLTCYBERCOM → MARFORCYBER</li><li>MALS networks fall under MARFORCYBER for DACO execution</li><li>ADCON chain does NOT govern DACO — it flows through the SCC chain</li><li>PMA program offices receive DACO support through NAVWAR/FLTCYBERCOM for acquisition network defense</li></ul>"
  },
  {
   "id": "secnavinst5000",
   "type": "SECNAVINST",
   "service": "USN",
   "number": "SECNAVINST 5000.2G",
   "title": "SECNAVINST 5000.2G — DoN Acquisition Policy",
   "date": "2022-03-15",
   "classification": "UNCLASSIFIED",
   "issuer": "SECNAV",
   "affects": [
    "asn_rda",
    "navsea",
    "navair",
    "navwar",
    "peo_a",
    "peo_ships",
    "peo_subs",
    "peo_c4i",
    "pma281",
    "pma272",
    "pma276",
    "pma261",
    "pms400",
    "pms385"
   ],
   "chain": [
    "SECNAV",
    "ASN(RD&A)",
    "SYSCOM CDRs",
    "PEO Commanders",
    "Program Managers"
   ],
   "refs": [
    "10 U.S.C. § 2430",
    "DODI 5000.02"
   ],
   "tags": [
    "t-navy",
    "t-doc",
    "t-ta"
   ],
   "summary": "ASN(RD&A) is the DoN Component Acquisition Executive and REPORTING SENIOR for all PEOs and DRPMs (SECNAVINST 5000.2E). Acquisition ADCON: ASN(RD&A) → PEO → PM. SYSCOMs (NAVAIR, NAVSEA, NAVWAR) provide TA support and host command services to PEOs but are NOT in the PEO ADCON chain. The SYSCOM→PEO relationship is administrative alignment and TA support — not command authority. This distinction is the doctrinal core this application exists to visualize.",
   "body": "<p>Technical Authority chain for MALS:</p><ul><li><span>ASN(RD&A)</span> → NAVAIR → PEO(A) → PMA-281: governs CH-53K airworthiness</li><li><span>ASN(RD&A)</span> → NAVAIR → PEO(A) → PMA-272: governs MV-22 configuration</li><li><strong>The TA holder (PM) issues Technical Directives</strong> that the MALS must comply with regardless of ADCON or OPCON assignments</li><li>PUC for a MALS traces to the MAG (ADCON); TA compliance flows independently to the applicable PM</li></ul>"
  },
  {
   "id": "usc5013",
   "type": "STATUTE",
   "service": "USN",
   "number": "10 U.S.C. § 5013",
   "title": "10 U.S.C. § 5013 — Secretary of the Navy",
   "date": "2022-01-01",
   "classification": "UNCLASSIFIED",
   "issuer": "U.S. Congress",
   "affects": [
    "secnav",
    "cno",
    "cmc",
    "asn_rda",
    "asn_eie",
    "asn_fmc",
    "asn_mra",
    "usffc",
    "compacflt"
   ],
   "chain": [
    "POTUS",
    "SECDEF",
    "SECNAV"
   ],
   "refs": [
    "10 U.S.C. § 5011",
    "DoDD 5100.01"
   ],
   "tags": [
    "t-law",
    "t-navy",
    "t-usmc"
   ],
   "summary": "SECNAV is the head of the DoN. SECNAV retains ADCON of all Navy and Marine Corps forces. This is the statutory basis for UIC/PUC chains terminating at SECNAV.",
   "body": "<p>SECNAV authorities include:</p><ul><li><span>ADCON</span> of all DoN forces — the UIC/PUC chain is the administrative expression of this authority</li><li><span>MTE Authority</span> — Man, Train, Equip is delegated through CNO (USN) and CMC (USMC)</li><li><span>Acquisition Authority</span> delegated to ASN(RD&A) as Component Acquisition Executive</li><li>Even when a MALS is OPCON to INDOPACOM, its UIC/PUC chain still flows to SECNAV through CMC</li></ul>"
  },
  {
   "id": "usc5043",
   "type": "STATUTE",
   "service": "USN",
   "number": "10 U.S.C. § 5043",
   "title": "10 U.S.C. § 5043 — Functions of CNO",
   "date": "2022-01-01",
   "classification": "UNCLASSIFIED",
   "issuer": "U.S. Congress",
   "affects": [
    "cno",
    "vcno",
    "usffc",
    "compacflt",
    "naveur",
    "navcent",
    "navso",
    "navsea",
    "navair",
    "navwar",
    "fl2",
    "fl3",
    "fl5",
    "fl6",
    "fl7"
   ],
   "chain": [
    "POTUS",
    "SECDEF",
    "SECNAV",
    "CNO"
   ],
   "refs": [
    "10 U.S.C. § 5013"
   ],
   "tags": [
    "t-law",
    "t-navy"
   ],
   "summary": "CNO is the principal advisor on naval matters. CNO exercises ADCON (not COCOM or OPCON) over Navy forces. CNO delegates MTE authority through the TYCOM chain.",
   "body": "<p>CNO responsibilities:</p><ul><li><span>ADCON / MTE</span> over Navy forces not under COCOM OPCON</li><li><span>SYSCOM oversight</span> through administrative chain</li><li><strong>Note:</strong> CNO is NOT in the NCA-to-COCOM operational chain — that flows POTUS → SECDEF → COCOM CDR directly</li></ul>"
  },
  {
   "id": "usc5044",
   "type": "STATUTE",
   "service": "USMC",
   "number": "10 U.S.C. § 5044",
   "title": "10 U.S.C. § 5044 — Functions of CMC",
   "date": "2022-01-01",
   "classification": "UNCLASSIFIED",
   "issuer": "U.S. Congress",
   "affects": [
    "cmc",
    "acmc",
    "marforcom",
    "marforpac",
    "marforres",
    "marforcent",
    "marforeur",
    "iimef",
    "imef",
    "iiimef",
    "dmaw",
    "smaw",
    "tmaw",
    "mag16",
    "mag26",
    "mals16",
    "mals14",
    "mals36",
    "marforcyber"
   ],
   "chain": [
    "POTUS",
    "SECDEF",
    "SECNAV",
    "CMC"
   ],
   "refs": [
    "10 U.S.C. § 5013"
   ],
   "tags": [
    "t-law",
    "t-usmc"
   ],
   "summary": "CMC retains ADCON over all USMC forces even when assigned OPCON to a COCOM. The UIC/PUC chain for every MALS terminates at CMC then SECNAV, regardless of OPCON assignment.",
   "body": "<p>CMC MTE authority flows through:</p><ul><li>CMC → MARFORPAC/MARFORCOM → MEF → MAW → MAG → MALS</li><li>This is the <strong>ADCON and UIC/PUC chain</strong> — it is independent of OPCON</li><li>A MALS under OPCON of INDOPACOM still has PUC tracing to MAG → MAW → MEF → MARFORPAC → CMC</li></ul>"
  },
  {
   "id": "dodi5000_02",
   "type": "DODI",
   "service": "Joint",
   "number": "DoDI 5000.02",
   "title": "DoDI 5000.02 — Operation of the Adaptive Acquisition Framework",
   "date": "2020-01-23",
   "classification": "UNCLASSIFIED",
   "issuer": "USD(A&S)",
   "affects": [
    "asn_rda",
    "navair",
    "navsea",
    "navwar",
    "peo_a",
    "peo_ships",
    "peo_subs",
    "peo_c4i",
    "pma281",
    "pma272",
    "pma276",
    "pma261",
    "pma265",
    "pma299",
    "pms400",
    "pms385",
    "pmw120"
   ],
   "chain": [
    "SECDEF",
    "USD(A&S)",
    "Service CAE (ASN(RD&A))",
    "PEO",
    "PM"
   ],
   "refs": [
    "10 U.S.C. § 2430",
    "DoDD 5000.01"
   ],
   "tags": [
    "t-joint",
    "t-doc",
    "t-ta"
   ],
   "summary": "Governs DoD acquisition. Establishes that PMs hold Technical Authority (airworthiness, configuration baseline) independent of the operational chain. This is the legal basis distinguishing TA from ADCON.",
   "body": "<p>Key TA provisions:</p><ul><li><span>PM authority</span> — Program Managers (PMA-281, PMA-272, etc.) hold technical authority over their system regardless of where it is operationally deployed</li><li><span>Airworthiness</span> — PMA-281 certifies CH-53K airworthy; a MALS cannot fly outside technical directives even under operational pressure from ADCON chain</li><li><strong>Conflict resolution:</strong> If OPCON commander directs flight that violates TA (tech directive), the PM's airworthiness authority governs — not the operational chain</li></ul>"
  },
  {
   "id": "ucp2022",
   "type": "EXEC ORDER",
   "service": "Joint",
   "number": "UCP 2022",
   "title": "Unified Command Plan 2022",
   "date": "2022-04-04",
   "classification": "SECRET (notional summary)",
   "issuer": "POTUS",
   "affects": [
    "potus",
    "secdef",
    "cjcs",
    "indopacom",
    "northcom",
    "southcom",
    "eucom",
    "centcom",
    "africom",
    "socom",
    "cybercom",
    "usffc",
    "compacflt",
    "naveur",
    "navcent",
    "marforpac",
    "marforcom"
   ],
   "chain": [
    "POTUS",
    "SECDEF",
    "CJCS",
    "COCOM CDRs"
   ],
   "refs": [
    "10 U.S.C. § 162",
    "DoDD 5100.01",
    "JP 1"
   ],
   "tags": [
    "t-joint",
    "t-doc"
   ],
   "summary": "Assigns missions, AORs, and force assignments. CYBERCOM is a Unified Combatant Command. INDOPACOM prioritized. MARFORPAC forces (including MALS in INDOPACOM AOR) are OPCON to INDOPACOM.",
   "body": "<p>DoN-relevant assignments:</p><ul><li><span>COMPACFLT</span> → INDOPACOM SCC</li><li><span>MARFORPAC</span> → INDOPACOM Marine component</li><li><span>USFFC</span> → NORTHCOM SCC</li><li><span>MARFORCOM</span> → NORTHCOM Marine component</li><li><span>FLTCYBERCOM</span> → CYBERCOM SCC for DACO</li><li><strong>MALS forward-deployed to INDOPACOM AOR</strong> are OPCON to INDOPACOM through their MEF/MAW chain, while retaining ADCON through CMC</li></ul>"
  },
  {
   "id": "usc4324",
   "type": "STATUTE",
   "service": "USN",
   "number": "10 U.S.C. § 4324",
   "title": "10 U.S.C. § 4324 — Life-Cycle Management and Product Support",
   "date": "2021-12-27",
   "classification": "UNCLASSIFIED",
   "issuer": "U.S. Congress",
   "affects": [
    "navair",
    "comfrc",
    "frce",
    "frcse",
    "frcsw",
    "frcwp",
    "frcw",
    "pma265",
    "pma281",
    "pma272",
    "pma276",
    "pma261",
    "pma275",
    "pma299",
    "peo_a",
    "asn_rda"
   ],
   "chain": [
    "SECDEF",
    "USD(A&S)",
    "ASN(RD&A)",
    "SYSCOM",
    "PEO",
    "PM"
   ],
   "refs": [
    "10 U.S.C. § 2460",
    "DoDI 5000.02"
   ],
   "tags": [
    "t-law",
    "t-navy",
    "t-ta"
   ],
   "summary": "PM accountable for lifecycle objectives from inception to disposal. LCSP required including: technical data and IP management plan (§ 4324(b)(1)(G)), sustainment metrics and materiel availability tracking (§ 4324(b)(1)(H-I)). Configuration currency mandatory throughout life cycle. PRIMARY statutory basis for LCSP/MDS data return line.",
   "body": "<p><strong>§ 4324(b) LCSP Requirements driving MDS Return:</strong></p><ul><li><span>§ 4324(b)(1)(G)</span> — Technical data and IP management plan: PM must have the data to sustain configuration baseline</li><li><span>§ 4324(b)(1)(H)</span> — Sustainment metrics: materiel availability, reliability — all require continuous data return from the operating force</li><li><span>§ 4324(b)(1)(I)</span> — Configuration management: currency cannot be maintained without FRC maintenance data return to PM</li><li><strong>Lifecycle obligation:</strong> NAVAIR contractually produces aircraft, retains configuration baseline authority for system life. When FRC → PMA data does not flow, airworthiness certifications become unreliable.</li></ul>"
  },
  {
   "id": "usc4614",
   "type": "STATUTE",
   "service": "Joint",
   "number": "10 U.S.C. § 4614 (§ 2460)",
   "title": "10 U.S.C. § 4614 — Depot-Level Maintenance: Definition",
   "date": "2021-12-27",
   "classification": "UNCLASSIFIED",
   "issuer": "U.S. Congress",
   "affects": [
    "comfrc",
    "frce",
    "frcse",
    "frcsw",
    "frcwp",
    "frcw",
    "navair"
   ],
   "chain": [
    "SECDEF",
    "Service Secretary",
    "SYSCOM"
   ],
   "refs": [
    "10 U.S.C. § 4618",
    "10 U.S.C. § 4622"
   ],
   "tags": [
    "t-law",
    "t-navy"
   ],
   "summary": "Defines depot-level maintenance as overhaul, upgrading, rebuilding of parts/assemblies/subassemblies, testing and reclamation. Source-of-funds neutral — function defines depot work, not who funds it.",
   "body": "<p>Depot-level maintenance includes:</p><ul><li>Overhaul and rebuilding of parts, assemblies, subassemblies</li><li>Manufacturing of parts, testing, and reclamation</li><li>Source-of-funds neutral — the function defines depot work regardless of appropriation</li><li>FRCE, FRCSE, FRCSW, FRCWP all perform depot-level work under this definition</li></ul>"
  },
  {
   "id": "usc4618",
   "type": "STATUTE",
   "service": "Joint",
   "number": "10 U.S.C. § 4618 (§ 2464)",
   "title": "10 U.S.C. § 4618 — Core Logistics Capabilities",
   "date": "2021-12-27",
   "classification": "UNCLASSIFIED",
   "issuer": "U.S. Congress",
   "affects": [
    "comfrc",
    "frce",
    "frcse",
    "frcsw",
    "frcwp",
    "navair",
    "asn_rda"
   ],
   "chain": [
    "SECDEF",
    "Service Secretary",
    "SYSCOM",
    "FRC CDR"
   ],
   "refs": [
    "10 U.S.C. § 4614",
    "10 U.S.C. § 4622",
    "DoDI 4151.18"
   ],
   "tags": [
    "t-law",
    "t-navy"
   ],
   "summary": "DoD must maintain core depot maintenance capability. Assessed at Milestone A (§ 4251) and Milestone B (§ 4252). Statutory basis for COMFRC organic capacity as national requirement, not just efficiency measure.",
   "body": "<p>Core logistics capability requirements:</p><ul><li>Must be assessed at Milestone A and B — this means FRC capacity is a program acquisition requirement</li><li>Organic industrial base is a statutory floor, not a policy preference</li><li>If core capability assessment shows gap, PM must address it in the acquisition strategy</li><li>FRCE, FRCSE, FRCSW existence as organic depots is mandated by this section</li></ul>"
  },
  {
   "id": "usc4622",
   "type": "STATUTE",
   "service": "Joint",
   "number": "10 U.S.C. § 4622 (§ 2466)",
   "title": "10 U.S.C. § 4622 — Limitations on Contracting for Depot-Level Maintenance",
   "date": "2021-12-27",
   "classification": "UNCLASSIFIED",
   "issuer": "U.S. Congress",
   "affects": [
    "comfrc",
    "frce",
    "frcse",
    "frcsw",
    "frcwp",
    "frcw",
    "navair",
    "asn_rda"
   ],
   "chain": [
    "SECDEF",
    "Service Secretary"
   ],
   "refs": [
    "10 U.S.C. § 4618"
   ],
   "tags": [
    "t-law",
    "t-navy"
   ],
   "summary": "No more than 50% of depot-level maintenance workload may be contracted out. SECDEF is sole waiver authority. COMFRC organic workload floor is established by statute, not policy.",
   "body": "<p>50% ceiling implications:</p><ul><li>At least 50% of depot workload must remain organic (COMFRC FRCs)</li><li>SECDEF sole waiver authority — no lower echelon can waive this</li><li>Workload measured in labor-hours across each DoD component</li><li>NAVAIR must ensure COMFRC FRCs retain sufficient workload to maintain core capabilities under § 4618</li></ul>"
  },
  {
   "id": "usc3774",
   "type": "STATUTE",
   "service": "Joint",
   "number": "10 U.S.C. §§ 3771–3774",
   "title": "10 U.S.C. §§ 3771–3774 — Rights in Technical Data",
   "date": "2021-12-27",
   "classification": "UNCLASSIFIED",
   "issuer": "U.S. Congress",
   "affects": [
    "navair",
    "pma265",
    "pma281",
    "pma272",
    "pma276",
    "pma261",
    "pma275",
    "pma299",
    "asn_rda",
    "peo_a"
   ],
   "chain": [
    "SECDEF",
    "USD(A&S)",
    "ASN(RD&A)",
    "PM"
   ],
   "refs": [
    "10 U.S.C. § 4324",
    "DFARS Part 227"
   ],
   "tags": [
    "t-law",
    "t-ta"
   ],
   "summary": "PM must assess technical data needs and establish acquisition strategies to sustain system over life cycle. § 3774 specifically: long-term data rights. NAVAIR configuration baseline data ownership and rights to FRC maintenance data both derive from these sections.",
   "body": "<p>Technical data rights driving LCSP data return:</p><ul><li><span>§ 3774</span> — PM must assess technical data needs at program initiation for full system life cycle</li><li>NAVAIR holds rights to maintenance data generated by FRCs — this is not contractor proprietary data</li><li>Configuration baseline data is a Government deliverable — FRC MDS data return is an exercise of Government data rights</li><li>When FRC maintenance data does not return to PMA, NAVAIR may be unable to exercise its rights under these sections to sustain the configuration baseline</li></ul>"
  },
  {
   "id": "namp4790",
   "type": "SECNAVINST",
   "service": "USN",
   "number": "COMNAVAIRFORINST 4790.2E",
   "title": "COMNAVAIRFORINST 4790.2E — Naval Aviation Maintenance Program (NAMP)",
   "date": "2024-01-15",
   "classification": "UNCLASSIFIED",
   "issuer": "COMNAVAIRFOR",
   "affects": [
    "comfrc",
    "frce",
    "frcse",
    "frcsw",
    "frcwp",
    "frcw",
    "frcma",
    "frcnw",
    "frc_ase",
    "frc_rmw",
    "mals16",
    "mals14",
    "mals36",
    "mals24",
    "navair",
    "pma265",
    "pma281",
    "pma272",
    "pma276"
   ],
   "chain": [
    "CNO",
    "NAVAIRSYSCOM",
    "COMFRC",
    "FRC CDRs",
    "MALS CDOs"
   ],
   "refs": [
    "10 U.S.C. § 4614",
    "10 U.S.C. § 4618",
    "10 U.S.C. § 4324"
   ],
   "tags": [
    "t-navy",
    "t-doc",
    "t-ta"
   ],
   "summary": "Defines three maintenance levels (O/I/D), maintenance data system (MDS) reporting requirements, aircraft logbook standards, and SYSCOM/COMFRC organizational roles. Regulatory implementation of Title 10 depot maintenance statutes. Note: OPNAVINST 4790.2K (25 Apr 2025) supersedes 4790.2J as OPNAV-level NAMP policy. COMNAVAIRFORINST 4790.2E is the current implementation instruction.",
   "body": "<p>Key NAMP provisions for v5.2:</p><ul><li><strong>Chapter 2:</strong> SYSCOM/COMFRC organizational roles — NAVAIRSYSCOM exercises TA, COMFRC exercises industrial authority</li><li><strong>Chapter 4:</strong> MALS organization — O+I level dual designation; MALS as primary interface between flying unit and depot</li><li><strong>Chapter 5 (MDS):</strong> Maintenance Data System — all maintenance actions, man-hours, discrepancies at O/I/D levels captured and reported upward to PM. This is the data pathway visualized by the LCSP Return line.</li><li><strong>Chapter 8:</strong> Aircraft logbooks and configuration records held by operating activities, reported to PM/SYSCOM. Enables PM to maintain configuration currency per § 4324.</li><li><strong>Chapter 12:</strong> Depot industrial program — COMFRC scheduling, workload allocation, 50% ceiling compliance tracking per § 4622.</li></ul>"
  },
  {
   "id": "ndaa2019_cyber",
   "type": "STATUTE",
   "service": "Joint",
   "number": "NDAA FY2019 § 1642",
   "title": "NDAA FY2019 § 1642 — Cyberspace Operations Authority",
   "date": "2018-08-13",
   "classification": "UNCLASSIFIED",
   "issuer": "U.S. Congress",
   "affects": [
    "cybercom",
    "fltcybercom",
    "arcyber",
    "af16",
    "marforcyber",
    "pca",
    "secdef"
   ],
   "chain": [
    "POTUS",
    "SECDEF",
    "CYBERCOM"
   ],
   "refs": [
    "10 U.S.C. § 394",
    "JP 3-12"
   ],
   "tags": [
    "t-law",
    "t-cyber"
   ],
   "summary": "Elevates CYBERCOM to Unified Combatant Command. Formalizes DACO. SCCs including FLTCYBERCOM/MARFORCYBER hold DACO authority over their component networks — including MALS networks.",
   "body": "<p>DACO for MALS networks:</p><ul><li><span>MARFORCYBER</span> executes DACO on behalf of USMC networks</li><li>MALS have organic network infrastructure; DACO authority for these networks flows: CYBERCOM → FLTCYBERCOM → MARFORCYBER</li><li>This is independent of the ADCON chain (CMC → MARFORPAC → MEF → MAW → MAG → MALS)</li><li>Three separate authority chains apply simultaneously to a single MALS</li></ul>"
  },
  {
   "id": "opnav5450_350b",
   "type": "OPNAVINST",
   "service": "USN",
   "number": "OPNAVINST 5450.350B",
   "title": "OPNAVINST 5450.350B — Mission, Functions and Tasks of COMNAVAIRSYSCOM",
   "date": "2022-10-06",
   "classification": "UNCLASSIFIED",
   "issuer": "CNO",
   "affects": [
    "navair",
    "nawcad",
    "nawcwd",
    "comfrc",
    "peo_a",
    "peo_uw",
    "peo_t",
    "pma265",
    "pma299",
    "pma261",
    "pma272",
    "pma276",
    "pma281",
    "pma275",
    "pma263",
    "frce",
    "frcse",
    "frcsw",
    "frcw",
    "frcwp",
    "asn_rda",
    "cno",
    "cmc"
   ],
   "chain": [
    "CNO",
    "COMNAVAIRSYSCOM"
   ],
   "refs": [
    "OPNAVINST 5400.44A",
    "SECNAVINST 5400.15D",
    "DoDD 5030.61"
   ],
   "tags": [
    "t-navy",
    "t-doc",
    "t-ta"
   ],
   "summary": "Primary source authority for NAVAIR mission, TA functions, airworthiness certification, PEO support relationships, and COMFRC/NAWC subordination. NAVAIR is ISIC of NAWCAD, NAWCWD, and COMFRC. Exercises TA including airworthiness flight clearance and configuration baseline authority. Serves as Aircraft Controlling Custodian (ACC) for all DON aircraft.",
   "body": "<p>Key provisions:</p><ul><li><strong>Para 1a-b:</strong> NAVAIR has management authority for designated naval aviation programs except authority assigned to PEO/DRPM. Reports to ASN(RD&A) for acquisition, to CNO/CMC for MTE.</li><li><strong>Para 1d(5-6):</strong> Exercises technical authority and life cycle management; provides independent engineering assessment and airworthiness flight clearance for all DON aircraft.</li><li><strong>Para 1d(6):</strong> Aircraft Controlling Custodian (ACC) for assigned DON weapons systems.</li><li><strong>Para 6a:</strong> ISIC of NAWCAD (Pax River), NAWCWD (China Lake), COMFRC.</li><li><strong>Para 6b:</strong> Supports PEO(A), PEO(U&W), PEO(T), PEO(CS).</li><li><strong>Para 1g:</strong> NAE Lead Technical Activity — sustainment, engineering, cyber warfare, configuration management.</li></ul>"
  },
  {
   "id": "opnav5450_340a",
   "type": "OPNAVINST",
   "service": "USN",
   "number": "OPNAVINST 5450.340A CH-1",
   "title": "OPNAVINST 5450.340A CH-1 — Mission, Functions and Tasks of COMNAVSEASYSCOM",
   "date": "2019-12-09",
   "classification": "UNCLASSIFIED",
   "issuer": "CNO",
   "affects": [
    "navsea",
    "peo_ships",
    "peo_subs",
    "peo_cvn",
    "peo_iws",
    "peo_lmw",
    "navrmc",
    "asn_rda",
    "cno",
    "cmc"
   ],
   "chain": [
    "CNO",
    "COMNAVSEASYSCOM"
   ],
   "refs": [
    "OPNAVINST 5400.44A",
    "SECNAVINST 5400.15C"
   ],
   "tags": [
    "t-navy",
    "t-doc",
    "t-ta"
   ],
   "summary": "NAVSEA provides material support for ships, submersibles, sea platforms, and associated combat/weapons systems. Serves as single technical authority for explosive safety. Exercises TA as operator of maintenance activities (RMCs, shipyards). SEA 08 (Naval Reactors) assigned per Executive Order 12344.",
   "body": "<p>Key provisions:</p><ul><li><strong>Para 3a-b:</strong> Material support to Navy, Marine Corps for ships, combat systems, equipment.</li><li><strong>Para 3c:</strong> Executive manager, DoD EOD Technology and Training. Single TA for explosive safety.</li><li><strong>Para 3e:</strong> TA and operational safety certification authority for diving and salvage.</li><li><strong>Para 3f:</strong> SEA 08 (Deputy Commander, Nuclear Propulsion) assigned per EO 12344.</li><li><strong>CH-1:</strong> Adds NAVRMC oversight, cybersecurity functions, EDO responsibilities.</li><li><strong>TA over maintenance:</strong> NAVSEA exercises technical authority as operator of RMCs and shipyards.</li></ul>"
  },
  {
   "id": "opnav5440_77c",
   "type": "OPNAVINST",
   "service": "USN",
   "number": "OPNAVINST 5440.77C",
   "title": "OPNAVINST 5440.77C — Missions, Functions and Tasks of USFFC, NAVNORTH, NAVSTRAT",
   "date": "2021-02-26",
   "classification": "UNCLASSIFIED",
   "issuer": "CNO",
   "affects": [
    "usffc",
    "fl2",
    "surflant",
    "airlant",
    "sublant",
    "navifor",
    "cno",
    "compacflt",
    "navsea",
    "navwar",
    "northcom"
   ],
   "chain": [
    "CNO",
    "COMUSFLTFORCOM"
   ],
   "refs": [
    "10 U.S.C. §5032",
    "SECNAVINST 7000.27C",
    "OPNAVINST 5450.340A CH-1",
    "OPNAVINST 5450.343"
   ],
   "tags": [
    "t-navy",
    "t-doc"
   ],
   "summary": "USFFC echelon 2 under CNO ADCON. ISIC of 19+ commands including SUBLANT, AIRLANT, SURFLANT, NAVIFOR, MSC, NECC, 2nd Fleet, NWDC, CNMOC. Dual-hat as COMNAVNORTH (NCC to NORTHCOM) and COMNAVSTRAT (NCC to STRATCOM). NAVSEA and NAVWAR exercise TA over maintenance activities and information warfare systems respectively.",
   "body": "<p>Key provisions:</p><ul><li><strong>Para 6a(2):</strong> USFFC is ISIC of: SUBLANT, AIRLANT, SURFLANT, NECC, NAVIFOR, MSC, 2nd Fleet, INSURV, NWDC, CNMOC, NMCL, CSG-4, and others.</li><li><strong>Para 6b:</strong> COMNAVNORTH = NCC/JFMCC to NORTHCOM. COMNAVSTRAT = NCC/JFMCC to STRATCOM.</li><li><strong>Para 7b:</strong> NAVSEA exercises TA as operator of RMCs and shipyards. NAVWAR exercises TA for information warfare systems.</li><li><strong>Prepare the Force:</strong> Man, train, equip, organize, maintain readiness of USN forces per Title 10.</li><li><strong>Provide the Force:</strong> Train, certify, provide combat-ready forces to CCDRs.</li></ul>"
  },
  {
   "id": "opnav5450_352b",
   "type": "OPNAVINST",
   "service": "USN",
   "number": "OPNAVINST 5450.352B",
   "title": "OPNAVINST 5450.352B — Mission, Functions and Tasks of OPNAV",
   "date": "2022-03-09",
   "classification": "UNCLASSIFIED",
   "issuer": "CNO",
   "affects": [
    "cno",
    "vcno",
    "usffc",
    "compacflt",
    "naveur",
    "navcent",
    "navso",
    "navsea",
    "navair",
    "navwar",
    "navsup",
    "navfac",
    "netc",
    "bumed",
    "ssp"
   ],
   "chain": [
    "SECNAV",
    "CNO"
   ],
   "refs": [
    "10 U.S.C. §5032",
    "DoDD 5100.01",
    "OPNAVINST 5400.44A"
   ],
   "tags": [
    "t-navy",
    "t-doc"
   ],
   "summary": "OPNAV establishes policies, provides resources, ensures combat-ready naval forces. Lists all 27+ echelon 2 commands under CNO including CNIC, NAVRESFORCOM, NAVSPECWARCOM, CHNAVPERS, NAVSAFECEN. Defines resource sponsor / requirements sponsor framework for PPBES.",
   "body": "<p>Key provisions:</p><ul><li><strong>Para 3:</strong> OPNAV mission — establish policies, provide resources, ensure combat-ready naval forces for maritime capabilities.</li><li><strong>Para 4:</strong> Lists all echelon 2 commanders under CNO (27+ commands).</li><li><strong>Para 4c-d:</strong> Resource sponsor and requirements sponsor roles — the framework for Navy PPBES programming.</li><li><strong>Para 7:</strong> Strategic functions and tasks assigned to OPNAV principal officials with lead organizations.</li><li><strong>Missing from previous KMS versions:</strong> CNIC, NAVRESFORCOM, NAVSPECWARCOM, CHNAVPERS, NAVSAFECEN, NPS, NWC, NIA.</li></ul>"
  },
  {
   "id": "opnav5450_345",
   "type": "OPNAVINST",
   "service": "USN",
   "number": "OPNAVINST 5450.345",
   "title": "OPNAVINST 5450.345 — Mission, Functions and Tasks of COMFLTCYBERCOM and COMTENTHFLT",
   "date": "2012-04-04",
   "classification": "UNCLASSIFIED",
   "issuer": "CNO",
   "affects": [
    "fltcybercom",
    "fl10",
    "navifor",
    "cybercom",
    "usffc",
    "marforcyber"
   ],
   "chain": [
    "CNO",
    "COMFLTCYBERCOM",
    "COMTENTHFLT"
   ],
   "refs": [
    "DoDD 5100.20",
    "OPNAVINST 3430.25",
    "OPNAVINST 5239.1C"
   ],
   "tags": [
    "t-navy",
    "t-doc",
    "t-cyber"
   ],
   "summary": "FLTCYBERCOM established as echelon 2 NCC to USCYBERCOM and USSTRATCOM. Also designated as Navy SCC to DIRNSA/CHCSS. CNO designates COMFLTCYBERCOM as \"central operational authority\" for Navy networks, cryptology, SIGINT, IO, cyber, EW and space. 10th Fleet is the numbered fleet commander exercising OPCON of assigned forces.",
   "body": "<p>Key provisions:</p><ul><li><strong>Para 2a:</strong> FLTCYBERCOM established 29 Jan 2010 as echelon 2 NCC to USSTRATCOM/USCYBERCOM.</li><li><strong>Para 2b:</strong> Designated as Navy SCC to DIRNSA/CHCSS — primary Service authority for cryptologic activities.</li><li><strong>Para 2c:</strong> \"Central operational authority\" for Navy networks, cryptology, SIGINT, IO, cyber, EW, space. Scope includes all Navy-operated/defended networks except combat/weapon system control functions.</li><li><strong>Encl 1, 1a:</strong> COMFLTCYBERCOM missions — direct cyber ops, operate/defend Navy portion of GIG, manage MTE for NCC/SCC.</li><li><strong>Encl 1, 1b:</strong> COMTENTHFLT — numbered fleet commander, exercises OPCON of assigned forces.</li></ul>"
  }
 ],
 "timeline": [
  {
   "year": 1775,
   "date": "1775-10-13",
   "type": "Legislative",
   "service": "USN",
   "title": "Continental Navy Established",
   "body": "Second Continental Congress authorizes two armed vessels — origin of the UIC hierarchy.",
   "tags": [
    "t-navy",
    "t-law"
   ],
   "nodes": [
    "cno"
   ]
  },
  {
   "year": 1775,
   "date": "1775-11-10",
   "type": "Legislative",
   "service": "USMC",
   "title": "Continental Marines Established",
   "body": "Continental Marines founded at Tun Tavern. Separate service identity — distinct ADCON chain from USN.",
   "tags": [
    "t-usmc",
    "t-law"
   ],
   "nodes": [
    "cmc"
   ]
  },
  {
   "year": 1798,
   "date": "1798-04-30",
   "type": "Legislative",
   "service": "Joint",
   "title": "Department of the Navy Created",
   "body": "Act of Congress establishes DoN. SECNAV becomes head — origin of the administrative authority chain under which all UIC/PUC relationships ultimately terminate.",
   "tags": [
    "t-navy",
    "t-usmc",
    "t-law"
   ],
   "nodes": [
    "secnav",
    "cno",
    "cmc"
   ]
  },
  {
   "year": 1947,
   "date": "1947-07-26",
   "type": "Legislative",
   "service": "Joint",
   "title": "National Security Act of 1947",
   "body": "Creates DoD, JCS, NSC. Separates operational (COCOM) chain from administrative (ADCON/MTE) chain. Foundation for the modern dual-chain structure.",
   "tags": [
    "t-joint",
    "t-law"
   ],
   "nodes": [
    "secdef",
    "cjcs",
    "secnav",
    "cno",
    "cmc"
   ]
  },
  {
   "year": 1952,
   "date": "1952-07-07",
   "type": "Legislative",
   "service": "USMC",
   "title": "Douglas-Mansfield Act",
   "body": "USMC codified as separate armed service with guaranteed force structure. CMC gains JCS seat. USMC MTE chain formally established separate from USN.",
   "tags": [
    "t-usmc",
    "t-law"
   ],
   "nodes": [
    "cmc",
    "acmc"
   ]
  },
  {
   "year": 1958,
   "date": "1958-08-06",
   "type": "Legislative",
   "service": "Joint",
   "title": "DoD Reorganization Act",
   "body": "Military departments removed from operational chain. COCOM flows POTUS → SECDEF → COCOM CDR. ADCON flows separately through Military Departments — the legal foundation for UIC/PUC independence from operational authority.",
   "tags": [
    "t-joint",
    "t-law"
   ],
   "nodes": [
    "potus",
    "secdef",
    "cjcs"
   ]
  },
  {
   "year": 1986,
   "date": "1986-10-04",
   "type": "Legislative",
   "service": "Joint",
   "title": "Goldwater-Nichols Act",
   "body": "Formally defines COCOM, OPCON, TACON, ADCON as distinct authorities. Establishes that Service Secretaries retain ADCON even when forces are OPCON to COCOMs.",
   "tags": [
    "t-joint",
    "t-law"
   ],
   "nodes": [
    "potus",
    "secdef",
    "cjcs",
    "indopacom",
    "eucom",
    "centcom"
   ]
  },
  {
   "year": 2009,
   "date": "2009-06-23",
   "type": "Administrative",
   "service": "Cyber",
   "title": "USCYBERCOM Established",
   "body": "Creates a fourth authority chain: DACO. Now MALS, PEOs, and SYSCOMs simultaneously answer to OPCON (operational), ADCON/MTE (CMC/CNO), TA (PMA/PEO/ASN(RD&A)), and DACO (CYBERCOM → SCC) chains.",
   "tags": [
    "t-cyber",
    "t-joint"
   ],
   "nodes": [
    "cybercom",
    "fltcybercom",
    "arcyber",
    "af16"
   ]
  },
  {
   "year": 2010,
   "date": "2010-05-21",
   "type": "Administrative",
   "service": "Cyber",
   "title": "Fleet Cyber Command / 10th Fleet Stood Up",
   "body": "FLTCYBERCOM established as Navy Service Cyber Component. Dual-hatted Commander, 10th Fleet. MARFORCYBER subordinate. DACO for MALS networks formally assigned.",
   "tags": [
    "t-cyber",
    "t-navy"
   ],
   "nodes": [
    "fltcybercom",
    "navifor",
    "marforcyber"
   ]
  },
  {
   "year": 2018,
   "date": "2018-05-04",
   "type": "Administrative",
   "service": "Cyber",
   "title": "CYBERCOM Elevated to Unified COCOM",
   "body": "NDAA FY2019 formalizes CYBERCOM as the 11th Unified Combatant Command. DACO doctrine matures. Service Cyber Component authority clarified.",
   "tags": [
    "t-cyber",
    "t-law"
   ],
   "nodes": [
    "cybercom",
    "fltcybercom",
    "arcyber",
    "af16",
    "marforcyber"
   ]
  },
  {
   "year": 2020,
   "date": "2020-08-14",
   "type": "Directive",
   "service": "USN",
   "title": "OPNAVINST 5400.44 Reissued",
   "body": "Updates Navy organizational structure. Incorporates NAVIFOR and NAVWAR. NAVWAR's role in TA for C4I programs (PMW) formally established.",
   "tags": [
    "t-navy",
    "t-doc"
   ],
   "nodes": [
    "cno",
    "usffc",
    "compacflt",
    "navifor",
    "navwar"
   ]
  },
  {
   "year": 2021,
   "date": "2021-03-02",
   "type": "Directive",
   "service": "USMC",
   "title": "MCO 5400.56 / Force Design 2030",
   "body": "Establishes MLRs, eliminates tank battalions. Creates new TA relationships: MLR's distributed platforms require PMA TA flows across geographically dispersed locations in INDOPACOM.",
   "tags": [
    "t-usmc",
    "t-doc"
   ],
   "nodes": [
    "cmc",
    "marforpac",
    "iiimef",
    "mlr",
    "mals36"
   ]
  },
  {
   "year": 2022,
   "date": "2022-04-04",
   "type": "Executive Order",
   "service": "Joint",
   "title": "Unified Command Plan 2022",
   "body": "UCP 2022 formalizes CYBERCOM as Unified COCOM. INDOPACOM priority drives MARFORPAC MALS forward deployment — creating the UIC/PUC vs. OPCON tension this tool is designed to visualize.",
   "tags": [
    "t-joint",
    "t-doc"
   ],
   "nodes": [
    "potus",
    "secdef",
    "indopacom",
    "cybercom",
    "compacflt",
    "mals36",
    "mals24"
   ]
  },
  {
   "year": 2022,
   "date": "2022-12-19",
   "type": "Directive",
   "service": "Cyber",
   "title": "JP 3-12 Cyberspace Operations Reissued",
   "body": "Formalizes DACO as a distinct authority. Clarifies that MALS networks are defended by MARFORCYBER under DACO delegation from CYBERCOM — independent of operational and administrative chains.",
   "tags": [
    "t-cyber",
    "t-joint"
   ],
   "nodes": [
    "cjcs",
    "cybercom",
    "fltcybercom",
    "marforcyber",
    "mals16",
    "mals36"
   ]
  },
  {
   "year": 2012,
   "date": "2012-04-04",
   "type": "Directive",
   "service": "USN",
   "title": "OPNAVINST 5450.345 — FLTCYBERCOM/10th Fleet MFT Published",
   "body": "Establishes FLTCYBERCOM as echelon 2 NCC to USCYBERCOM/USSTRATCOM. Designates COMFLTCYBERCOM as central operational authority for Navy networks, cryptology, SIGINT, IO, cyber, EW, and space. 10th Fleet exercises OPCON of assigned forces.",
   "tags": [
    "t-navy",
    "t-cyber",
    "t-doc"
   ],
   "nodes": [
    "fltcybercom",
    "fl10",
    "cybercom",
    "navifor"
   ]
  },
  {
   "year": 2016,
   "date": "2016-06-29",
   "type": "Directive",
   "service": "USN",
   "title": "OPNAVINST 5450.340A — NAVSEA MFT Published",
   "body": "Defines NAVSEA mission, functions, tasks. Material support for ships, submersibles, combat systems. Single TA for explosive safety. TA as operator of RMCs and shipyards. Nuclear propulsion (SEA 08) per EO 12344.",
   "tags": [
    "t-navy",
    "t-doc",
    "t-ta"
   ],
   "nodes": [
    "navsea",
    "peo_ships",
    "peo_subs",
    "navrmc",
    "asn_rda"
   ]
  },
  {
   "year": 2019,
   "date": "2019-12-09",
   "type": "Directive",
   "service": "USN",
   "title": "OPNAVINST 5450.340A CH-1 — NAVSEA MFT Updated",
   "body": "Change transmittal adds NAVRMC oversight, cybersecurity functions, EDO responsibilities. Removes functions transferred to SSP.",
   "tags": [
    "t-navy",
    "t-doc"
   ],
   "nodes": [
    "navsea",
    "navrmc"
   ]
  },
  {
   "year": 2021,
   "date": "2021-02-26",
   "type": "Directive",
   "service": "USN",
   "title": "OPNAVINST 5440.77C — USFFC/NAVNORTH/NAVSTRAT MFT Published",
   "body": "Complete revision of USFFC MFT. Lists 19+ ISIC subordinates. Establishes COMNAVNORTH and COMNAVSTRAT dual-hats. Codifies NAVSEA TA over maintenance activities and NAVWAR TA over information warfare systems.",
   "tags": [
    "t-navy",
    "t-doc"
   ],
   "nodes": [
    "usffc",
    "navifor",
    "necc",
    "msc",
    "nwdc",
    "navsea",
    "navwar"
   ]
  },
  {
   "year": 2022,
   "date": "2022-03-09",
   "type": "Directive",
   "service": "USN",
   "title": "OPNAVINST 5450.352B — OPNAV MFT Published",
   "body": "Lists all 27+ echelon 2 commands under CNO. Defines resource sponsor and requirements sponsor framework. Strategic tasks assigned to OPNAV principal officials.",
   "tags": [
    "t-navy",
    "t-doc"
   ],
   "nodes": [
    "cno",
    "vcno",
    "cnic",
    "chnavpers",
    "navresfor",
    "navspecwar"
   ]
  },
  {
   "year": 2022,
   "date": "2022-10-06",
   "type": "Directive",
   "service": "USN",
   "title": "OPNAVINST 5450.350B — NAVAIR MFT Published",
   "body": "Primary source for NAVAIR TA functions, airworthiness certification, ACC designation, PEO support relationships, and NAWCAD/NAWCWD/COMFRC subordination. Complete revision of NAVAIR MFT.",
   "tags": [
    "t-navy",
    "t-doc",
    "t-ta"
   ],
   "nodes": [
    "navair",
    "nawcad",
    "nawcwd",
    "comfrc",
    "peo_a",
    "peo_uw",
    "peo_t",
    "asn_rda"
   ]
  }
 ]
};
