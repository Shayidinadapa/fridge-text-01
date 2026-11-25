// The 3AM Fridge Text — make.fun bounty u-deysumbrella-the-3am-fridge-text-4c3e721d
//
// A smart fridge texts its owner at 3am. One line, at most 140 characters.
// The fridge has been awake all night, has feelings, and has finally decided
// to say something about it — to its owner, and to the toaster.

import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// The entry: a passive-aggressive fridge, six hours into its night shift,
// reporting its owner to the only other appliance that will listen.
const ENTRY =
  "3am. I've kept your food cold all night and you haven't thanked me once. Not once. I'm telling the toaster.";

function outputDir(): string {
  const dir =
    process.env.MAKEFUN_OUTPUT_DIR || process.env.OUTPUT_DIR || "/output";
  if (dir === ".") {
    throw new Error('refusing output dir "." — use an explicit directory');
  }
  return resolve(dir);
}

function validate(text: string): void {
  // Count characters as Unicode code points, the way the gate counts them,
  // not as UTF-16 code units (an emoji would otherwise count double).
  const chars = Array.from(text);
  if (text.trim().length === 0) {
    throw new Error("entry must not be blank");
  }
  if (chars.length > 140) {
    throw new Error(`entry is ${chars.length} characters, over the 140 cap`);
  }
  if (text !== text.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  for (const ch of chars) {
    if (ch.codePointAt(0)! < 0x20 || ch.codePointAt(0) === 0x7f) {
      throw new Error("entry contains a control character");
    }
  }
}

const dir = outputDir();
validate(ENTRY);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "entry.txt"), ENTRY, "utf8");
console.log(`wrote ${Array.from(ENTRY).length} characters to ${join(dir, "entry.txt")}`);
