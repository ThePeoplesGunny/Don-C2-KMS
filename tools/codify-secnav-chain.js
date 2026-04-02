#!/usr/bin/env node
// Codify SECNAV chain auth entries with ref document chains
// Run: node tools/codify-secnav-chain.js

const fs = require('fs');
const path = require('path');
const dataPath = path.resolve(__dirname, '..', 'web', 'data', 'kms-data.js');
const src = fs.readFileSync(dataPath, 'utf-8');
const fn = new Function(src + '\nreturn KMS_DATA;');
const data = fn();

// ═══ 1. ADD MISSING FOUNDATION DOCUMENTS ═══
const newDocs = [
  {
    id:"secnavinst_5400_15d", type:"SECNAVINST", service:"USN",
    number:"SECNAVINST 5400.15D", title:"SECNAVINST 5400.15D \u2014 DoN Research, Development and Acquisition",
    date:"2021-01-19", classification:"UNCLASSIFIED", issuer:"SECNAV",
    affects:["secnav","asn_rda","navair","navsea","navwar","peo_a","peo_uw","peo_t","peo_ships","peo_subs","peo_iws","peo_cvn","peo_lmw","peo_c4i","peo_dig"],
    chain:["SECNAV","ASN(RD&A)","PEOs","PMs"],
    refs:["10 USC \u00a78016","DoDD 5000.01","DoDI 5000.02"],
    tags:["t-navy","t-doc","t-ta"],
    summary:"Establishes the DoN two-chain structure. Chain 1: SECNAV\u2192CNO\u2192commands (ADCON). Chain 2: SECNAV\u2192ASN(RD&A)\u2192PEOs\u2192PMs (Acquisition Authority). Defines Technical Authority (TA), Acquisition Authority (AA), and their separation at SYSCOMs. ASN(RD&A) designated as Service Acquisition Executive. SYSCOMs are PEO Holding Commands providing workforce and TA, NOT acquisition authority.",
    body:""
  },
  {
    id:"usc_10_8033", type:"STATUTE", service:"USN",
    number:"10 USC \u00a78033", title:"10 USC \u00a78033 \u2014 Chief of Naval Operations",
    date:"1947-07-26", classification:"UNCLASSIFIED", issuer:"U.S. Congress",
    affects:["cno","secnav"],
    chain:["POTUS","SECDEF","SECNAV","CNO"],
    refs:["10 USC \u00a78013","10 USC \u00a7113"],
    tags:["t-law","t-navy"],
    summary:"Establishes CNO duties. \u00a78033(b): Under authority, direction, and control of SECNAV. \u00a78033(b)(4): Exercises supervision over Navy and Marine Corps organizations as SECNAV determines \u2014 statutory basis for ADCON. CNO is principal naval adviser to President, NSC, and SECNAV.",
    body:""
  },
  {
    id:"usc_10_8043", type:"STATUTE", service:"USMC",
    number:"10 USC \u00a78043", title:"10 USC \u00a78043 \u2014 Commandant of the Marine Corps",
    date:"1947-07-26", classification:"UNCLASSIFIED", issuer:"U.S. Congress",
    affects:["cmc","secnav"],
    chain:["POTUS","SECDEF","SECNAV","CMC"],
    refs:["10 USC \u00a78013","10 USC \u00a7113"],
    tags:["t-law","t-usmc"],
    summary:"Establishes CMC duties. Subject to authority, direction, and control of SECNAV. \u00a78043(a): Directly responsible to SECNAV for administration, discipline, training, readiness, recruiting, support, and budgetary matters of the Marine Corps.",
    body:""
  },
  {
    id:"usc_10_8016", type:"STATUTE", service:"USN",
    number:"10 USC \u00a78016", title:"10 USC \u00a78016 \u2014 Assistant Secretaries of the Navy",
    date:"1986-10-01", classification:"UNCLASSIFIED", issuer:"U.S. Congress",
    affects:["secnav","asn_rda"],
    chain:["POTUS","SECDEF","SECNAV","ASNs"],
    refs:["10 USC \u00a78013"],
    tags:["t-law","t-navy"],
    summary:"Authorizes up to 4 ASNs appointed by President with Senate consent. Functional assignments set by SECNAV (not statute): ASN(RD&A), ASN(M&RA), ASN(FM&C), ASN(EI&E). ASN(RD&A) designated as DoN Service Acquisition Executive per SECNAVINST 5400.15D.",
    body:""
  },
  {
    id:"usc_10_8015", type:"STATUTE", service:"USN",
    number:"10 USC \u00a78015", title:"10 USC \u00a78015 \u2014 Under Secretary of the Navy",
    date:"1947-07-26", classification:"UNCLASSIFIED", issuer:"U.S. Congress",
    affects:["secnav"],
    chain:["POTUS","SECDEF","SECNAV","UNSECNAV"],
    refs:["10 USC \u00a78013"],
    tags:["t-law","t-navy"],
    summary:"Establishes UNSECNAV. Acts as SECNAV when vacancy or absence/disability. First in SECNAV succession chain. All authority delegated from SECNAV \u2014 no independent statutory authority.",
    body:""
  },
  {
    id:"dodd_5000_01", type:"DODD", service:"Joint",
    number:"DoDD 5000.01", title:"DoDD 5000.01 \u2014 The Defense Acquisition System",
    date:"2020-09-09", classification:"UNCLASSIFIED", issuer:"USD(A&S)",
    affects:["secdef","asn_rda","navair","navsea","navwar"],
    chain:["SECDEF","USD(A&S)","Service SAEs","PEOs","PMs"],
    refs:["10 USC \u00a7133b","10 USC \u00a7113"],
    tags:["t-joint","t-doc","t-ta"],
    summary:"Governs the Defense Acquisition System. Requires each military department to designate a Service Acquisition Executive (SAE). For DoN: ASN(RD&A). Establishes MDA hierarchy: USD(A&S) for ACAT I, SAE for ACAT II/III. Foundation for PEO/PM authority structure.",
    body:""
  }
];

newDocs.forEach(d => {
  if (!data.documents.find(e => e.id === d.id)) {
    data.documents.push(d);
    console.log('Added doc:', d.id);
  } else {
    console.log('Exists:', d.id);
  }
});

// ═══ 2. UPDATE AUTH ENTRIES ═══

// Ref chain building blocks (reusable fragments)
const REF_TO_CONSTITUTION = ['usc_10_113', 'constitution_art2'];
const REF_SECNAV_CHAIN = ['usc_10_8013', ...REF_TO_CONSTITUTION];
const REF_CNO_ADCON = ['usc_10_8033', ...REF_SECNAV_CHAIN];
const REF_CMC_ADCON = ['usc_10_8043', ...REF_SECNAV_CHAIN];
const REF_OPCON_CHAIN = ['usc_10_162', ...REF_TO_CONSTITUTION];
const REF_DACO_CHAIN = ['dodi_8530_01', ...REF_TO_CONSTITUTION];
const REF_ASN_AA = ['secnavinst_5400_15d', 'usc_10_8016', ...REF_SECNAV_CHAIN];
const REF_PEO_AA = ['secnavinst_5400_15d', 'dodd_5000_01', 'usc_10_8016', ...REF_SECNAV_CHAIN];

// SECNAV
data.auth.secnav = {
  dac: ['secdef'],
  ref: { dac: ['usc_10_8013', ...REF_TO_CONSTITUTION] },
  note: 'Secretary of the Navy per 10 USC \u00a78013. EX-II (5 USC \u00a75313). Subject to authority, direction, and control of SECDEF per \u00a78013(b). Responsible for all affairs of DoN. Constrained by 10 USC \u00a7162 \u2014 cannot operationally command COCOM-assigned forces. Delegates through two chains: ADCON (CNO/CMC) and Acquisition (ASN(RD&A)) per SECNAVINST 5400.15D.'
};

// CNO
data.auth.cno = {
  adcon: ['secnav'],
  ref: { adcon: REF_CNO_ADCON },
  note: 'Chief of Naval Operations per 10 USC \u00a78033. Under authority, direction, and control of SECNAV. \u00a78033(b)(4): Exercises supervision over Navy organizations as SECNAV determines \u2014 statutory basis for ADCON over all Navy Echelon 2 commands. Principal naval adviser to President, NSC, SECNAV. Member JCS. Does NOT have acquisition authority. UIC 00011.'
};

// VCNO
data.auth.vcno = {
  adcon: ['cno'],
  ref: { adcon: REF_CNO_ADCON },
  note: 'Vice Chief of Naval Operations. Principal deputy to CNO. Full authority to act for CNO in all matters not specifically reserved by law.'
};

// CMC
data.auth.cmc = {
  adcon: ['secnav'],
  ref: { adcon: REF_CMC_ADCON },
  note: 'Commandant of the Marine Corps per 10 USC \u00a78043. Subject to authority, direction, and control of SECNAV. Directly responsible to SECNAV for administration, discipline, training, readiness, recruiting, support, and budgetary matters of USMC. Member JCS.'
};

// ASN(RD&A)
data.auth.asn_rda = {
  dac: ['secnav'],
  aa: ['usd_as', 'usd_re'],
  ref: {
    dac: REF_ASN_AA,
    aa: ['dodd_5135_02', 'dodd_5137_02', 'usc_10_133b', 'usc_10_133a', ...REF_TO_CONSTITUTION]
  },
  note: 'ASN(RD&A) per 10 USC \u00a78016. DoN Service Acquisition Executive (SAE) per SECNAVINST 5400.15D and DoDD 5000.01. Exercises SECNAV-delegated acquisition authority over PEOs and PMs. MDA for ACAT II/III. USD(A&S) exercises oversight as DAE for ACAT I. SYSCOMs provide workforce and TA but NOT acquisition authority.'
};

// SYSCOMs
const syscomBase = (mftDoc, note) => ({
  adcon: ['cno'],
  aa: ['asn_rda'],
  daco: ['fltcybercom'],
  ref: {
    adcon: [mftDoc, ...REF_CNO_ADCON],
    aa: REF_ASN_AA,
    daco: REF_DACO_CHAIN
  },
  note: note
});

data.auth.navair = syscomBase('opnav5450_350b',
  'Naval Air Systems Command. Echelon 2 under CNO for ADCON per OPNAVINST 5450.350B. PEO Holding Command \u2014 provides workforce and TA for aviation programs. COMNAVAIR exercises Technical Authority for airworthiness, configuration management, engineering standards (NAVAIRINST 13034 series). Acquisition authority flows through ASN(RD&A)\u2192PEOs, NOT through NAVAIR. UIC 00019.');

data.auth.navsea = syscomBase('opnav5450_340a',
  'Naval Sea Systems Command. Echelon 2 under CNO for ADCON per OPNAVINST 5450.340A. PEO Holding Command for ship/sub programs. COMNAVSEA exercises TA for HM&E, ship design, propulsion (conventional). NAVSEA 08 exercises independent nuclear TA per 50 USC \u00a72406 / EO 12344. UIC 00017.');

data.auth.navwar = syscomBase('opnav5450_345',
  'Naval Information Warfare Systems Command (formerly SPAWAR, renamed 2019). Echelon 2 under CNO for ADCON. PEO Holding Command for C4ISR programs. COMNAVWAR exercises TA for C4I networks, communications, enterprise IT, CANES, SATCOM, data links.');

// Fix PEO TA references — NAVSEA PEOs get TA from navsea, NAVWAR PEOs from navwar
['peo_ships','peo_subs','peo_iws','peo_cvn','peo_lmw'].forEach(id => {
  if (data.auth[id]) {
    data.auth[id].ta = ['navsea'];
    data.auth[id].ref = { aa: REF_PEO_AA, ta: ['opnav5450_340a', 'secnavinst_5400_15d', ...REF_SECNAV_CHAIN] };
    console.log('Fixed TA + ref:', id);
  }
});

['peo_c4i','peo_dig'].forEach(id => {
  if (data.auth[id]) {
    data.auth[id].ta = ['navwar'];
    data.auth[id].ref = { aa: REF_PEO_AA, ta: ['secnavinst_5400_15d', ...REF_SECNAV_CHAIN] };
    console.log('Fixed TA + ref:', id);
  }
});

// NAVAIR PEOs — TA correctly from navair
['peo_a','peo_uw','peo_t'].forEach(id => {
  if (data.auth[id]) {
    data.auth[id].ref = { aa: REF_PEO_AA, ta: ['opnav5450_350b', 'secnavinst_5400_15d', ...REF_SECNAV_CHAIN] };
    console.log('Added ref:', id);
  }
});

// Fleet Commanders
const fleetCmd = (id, opconParent, mftDoc, note) => {
  data.auth[id] = {
    opcon: [opconParent],
    adcon: ['cno'],
    daco: ['fltcybercom'],
    ref: {
      adcon: [mftDoc || 'usc_10_8033', ...REF_CNO_ADCON.slice(mftDoc ? 0 : 1)],
      opcon: REF_OPCON_CHAIN,
      daco: REF_DACO_CHAIN
    },
    note: note
  };
  // Deduplicate ref.adcon if mftDoc was already in REF_CNO_ADCON
  if (mftDoc) {
    data.auth[id].ref.adcon = [mftDoc, ...REF_CNO_ADCON];
  }
  console.log('Updated:', id);
};

fleetCmd('usffc', 'stratcom', 'opnav5440_77c',
  'Fleet Forces Command. Echelon 2 under CNO ADCON per OPNAVINST 5440.77C. OPCON to STRATCOM as NAVSTRAT. CDR quad-hatted: NAVNORTH, NAVSTRAT, COMLANTFLT, C2F. UIC 00060.');
fleetCmd('compacflt', 'indopacom', null,
  'Pacific Fleet. Echelon 2 under CNO ADCON. OPCON to INDOPACOM as Navy component. Dual-hat: 3rd Fleet. UIC 00070.');
fleetCmd('naveur', 'eucom', null,
  'Naval Forces Europe/Africa. Echelon 2 under CNO ADCON. OPCON to EUCOM. Dual-hat: 6th Fleet.');
fleetCmd('navcent', 'centcom', null,
  'Naval Forces Central. Echelon 2 under CNO ADCON. OPCON to CENTCOM. Dual-hat: 5th Fleet.');
fleetCmd('navso', 'southcom', null,
  'Naval Forces Southern. Echelon 2 under CNO ADCON. OPCON to SOUTHCOM. Dual-hat: 4th Fleet.');
fleetCmd('navspecwar', 'socom', null,
  'Naval Special Warfare Command. Echelon 2 under CNO ADCON. OPCON to SOCOM per UCP.');

// FLTCYBERCOM
data.auth.fltcybercom = {
  opcon: ['cybercom'],
  adcon: ['cno'],
  daco: ['dcdc'],
  mte: 'usffc',
  ref: {
    adcon: ['opnav5450_345', ...REF_CNO_ADCON],
    opcon: REF_OPCON_CHAIN,
    daco: REF_DACO_CHAIN
  },
  note: 'Fleet Cyber Command / 10th Fleet. Echelon 2 under CNO ADCON per OPNAVINST 5450.345. OPCON to CYBERCOM. DACO from DCDC per DoDI 8530.01. CDR dual-hatted: COMTENTHFLT + Naval Space Command. Central operational authority for Navy networks, cryptology, SIGINT, IO, cyber, EW, space. UIC 00055.'
};
console.log('Updated: fltcybercom');

// USMC commands
const usmcCmd = (id, opconParent, note) => {
  const entry = {
    adcon: ['cmc'],
    ref: { adcon: REF_CMC_ADCON },
    note: note
  };
  if (opconParent) {
    entry.opcon = [opconParent];
    entry.ref.opcon = REF_OPCON_CHAIN;
  }
  data.auth[id] = entry;
  console.log('Updated:', id);
};

usmcCmd('marforcom', 'northcom', 'Marine Forces Command. ADCON from CMC per 10 USC \u00a78043. OPCON to NORTHCOM. Dual-hat: MARFORLANT.');
usmcCmd('marforpac', 'indopacom', 'Marine Forces Pacific. ADCON from CMC per 10 USC \u00a78043. OPCON to INDOPACOM.');
usmcCmd('marsoc', 'socom', 'Marine Forces Special Operations Command (Marine Raider Command). ADCON from CMC. OPCON to SOCOM per UCP.');

data.auth.marforcyber = {
  opcon: ['cybercom'],
  adcon: ['cmc'],
  daco: ['dcdc'],
  mte: 'marforcom',
  ref: {
    adcon: REF_CMC_ADCON,
    opcon: REF_OPCON_CHAIN,
    daco: REF_DACO_CHAIN
  },
  note: 'Marine Forces Cyberspace Command. ADCON from CMC. OPCON to CYBERCOM. DACO from DCDC per DoDI 8530.01.'
};
console.log('Updated: marforcyber');

// Other Navy Echelon 2 commands under CNO
const navE2 = (id, note) => {
  data.auth[id] = {
    adcon: ['cno'],
    daco: ['fltcybercom'],
    ref: {
      adcon: REF_CNO_ADCON,
      daco: REF_DACO_CHAIN
    },
    note: note
  };
  console.log('Updated:', id);
};

navE2('chnavpers', 'Chief of Naval Personnel / BUPERS. Echelon 2 under CNO ADCON. Manages Navy personnel policy, assignment, career management.');
navE2('cnic', 'Commander, Navy Installations Command. Echelon 2 under CNO ADCON. Supporting commander for installation services to fleet. UIC 00052.');
navE2('navresfor', 'Navy Reserve Forces Command. Echelon 2 under CNO ADCON. Manages all Navy Reserve units and personnel.');

if (data.auth.bumed) {
  data.auth.bumed = {
    adcon: ['cno'],
    ref: { adcon: REF_CNO_ADCON },
    note: 'Bureau of Medicine and Surgery. Echelon 2 under CNO ADCON. Navy medical policy and healthcare delivery.'
  };
  console.log('Updated: bumed');
}

// TYCOMs — ADCON from fleet commanders, TA from SYSCOMs
const tycomUpdates = [
  {id:'airlant', adcon:'usffc', ta:'navair', opcon:'usffc', mte:'usffc',
   note:'Naval Air Force Atlantic. ADCON: CNO\u2192USFFC\u2192AIRLANT. TA from NAVAIR for airworthiness and configuration. Dual authority nexus.'},
  {id:'airpac', adcon:'compacflt', ta:'navair', opcon:'compacflt', mte:'compacflt',
   note:'Naval Air Force Pacific. ADCON: CNO\u2192COMPACFLT\u2192AIRPAC. TA from NAVAIR. CDR dual-hatted as COMNAVAIRFOR. UIC 57025.'},
  {id:'sublant', adcon:'usffc', ta:'navsea', mte:'usffc',
   note:'Submarine Force Atlantic. ADCON: CNO\u2192USFFC\u2192SUBLANT. TA from NAVSEA for HM&E. CDR dual-hatted as COMSUBFOR. UIC 57016.'},
  {id:'surfpac', adcon:'compacflt', ta:'navsea', mte:'compacflt',
   note:'Surface Force Pacific. ADCON: CNO\u2192COMPACFLT\u2192SURFPAC. TA from NAVSEA for HM&E. CDR dual-hatted as COMNAVSURFOR. UIC 53824.'}
];

tycomUpdates.forEach(t => {
  const entry = {
    adcon: [t.adcon],
    ta: [t.ta],
    daco: ['fltcybercom'],
    mte: t.mte || null,
    ref: {
      adcon: REF_CNO_ADCON,
      ta: [(t.ta === 'navair' ? 'opnav5450_350b' : 'opnav5450_340a'), 'secnavinst_5400_15d', ...REF_SECNAV_CHAIN],
      daco: REF_DACO_CHAIN
    },
    note: t.note
  };
  if (t.opcon) entry.opcon = [t.opcon];
  data.auth[t.id] = entry;
  console.log('Updated:', t.id);
});

// NAVAIR subordinates
['comfrc','nawcad','nawcwd'].forEach(id => {
  if (data.auth[id]) {
    data.auth[id].ref = {
      adcon: ['opnav5450_350b', ...REF_CNO_ADCON],
      ta: ['opnav5450_350b', 'secnavinst_5400_15d', ...REF_SECNAV_CHAIN],
      daco: REF_DACO_CHAIN
    };
    console.log('Added ref:', id);
  }
});

// Echelon 3 under fleet commanders
['necc','navifor'].forEach(id => {
  if (data.auth[id]) {
    data.auth[id].ref = {
      adcon: ['opnav5440_77c', ...REF_CNO_ADCON],
      daco: REF_DACO_CHAIN
    };
    console.log('Added ref:', id);
  }
});

// Summary
console.log('\n=== SUMMARY ===');
console.log('Documents:', data.documents.length);
console.log('Auth entries:', Object.keys(data.auth).length);

// Count entries with ref
let refCount = 0;
Object.values(data.auth).forEach(a => { if (a.ref) refCount++; });
console.log('Auth entries with ref:', refCount, 'of', Object.keys(data.auth).length);

// Write
const output = 'const KMS_DATA = ' + JSON.stringify(data, null, 1) + ';\n';
fs.writeFileSync(dataPath, output, 'utf8');
console.log('File written:', output.length, 'bytes');
