/* NCODE N — Lint dos jogos: registro correto, sem APIs proibidas, sem cópias. */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const ROOT = path.join(__dirname, "..");
const GAMES = path.join(ROOT, "games");

const FORBID = [
  /\bdocument\b/, /\bwindow\b/, /\blocalStorage\b/, /\bsessionStorage\b/,
  /\bsetTimeout\b/, /\bsetInterval\b/, /\brequestAnimationFrame\b/,
  /\bAudioContext\b/, /\bwebkitAudioContext\b/, /\bfetch\s*\(/, /\bXMLHttpRequest\b/,
  /\bquerySelector(All)?\b/, /\bgetElementById\b/, /\bgetElementsBy/, /\bcreateElement\b/,
  /\blocation\b/, /\bnavigator\b/, /\bhistory\b/, /\balert\s*\(/, /\bconfirm\s*\(/, /\bprompt\s*\(/,
  /\brequire\s*\(/, /\bimport\b/, /\bexport\b/, /\.click\(\)/, /\bFunction\s*\(/
];

let fails = 0;
const hashes = new Map();
for(let id = 1; id <= 400; id++){
  const f = path.join(GAMES, "g"+String(id).padStart(3,"0")+".js");
  const tag = "g"+String(id).padStart(3,"0");
  if(!fs.existsSync(f)){ console.log(`FAIL ${tag} arquivo inexistente`); fails++; continue; }
  const code = fs.readFileSync(f, "utf8");
  const probs = [];
  const m = code.match(/GREG\((\d+)\s*,/);
  if(!m) probs.push("GREG(id) ausente");
  else if(+m[1] !== id) probs.push(`GREG registra id ${m[1]} no arquivo ${id}`);
  if(!/init\s*\(\s*root\s*,\s*H\s*\)/.test(code)) probs.push("init(root,H) ausente");
  for(const rx of FORBID){ if(rx.test(code)) probs.push("token proibido: "+rx.source); }
  const h = crypto.createHash("sha1").update(code).digest("hex");
  if(hashes.has(h)) probs.push("CÓPIA de "+hashes.get(h));
  else hashes.set(h, tag);
  if(code.length < 800) probs.push("arquivo muito pequeno ("+code.length+"b)");
  if(probs.length){ console.log(`FAIL ${tag} :: ${probs.join(" · ")}`); fails++; }
}
console.log(fails ? `\n== LINT: ${fails} PROBLEMAS ==` : "\n== LINT OK: 400 arquivos únicos e conformes ==");
process.exitCode = fails ? 1 : 0;
