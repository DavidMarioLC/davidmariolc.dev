#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const MESSAGES_DIR = new URL("../messages/", import.meta.url).pathname;

function flatten(value, prefix = "") {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return new Set([prefix]);
  }

  const keys = new Set();
  for (const [key, child] of Object.entries(value)) {
    for (const nested of flatten(child, prefix ? `${prefix}.${key}` : key)) {
      keys.add(nested);
    }
  }

  return keys;
}

const files = (await readdir(MESSAGES_DIR)).filter((file) =>
  file.endsWith(".json")
);

if (files.length < 2) {
  console.error(
    `Expected at least two message catalogs, found ${files.length}.`
  );
  process.exit(1);
}

const catalogs = new Map(
  await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(join(MESSAGES_DIR, file), "utf8");
      return [file, flatten(JSON.parse(raw))];
    })
  )
);

const [reference, ...rest] = [...catalogs.keys()];
const problems = [];

for (const other of rest) {
  const a = catalogs.get(reference);
  const b = catalogs.get(other);

  for (const key of a) {
    if (!b.has(key)) {
      problems.push(`${other} is missing "${key}" (present in ${reference})`);
    }
  }

  for (const key of b) {
    if (!a.has(key)) {
      problems.push(`${reference} is missing "${key}" (present in ${other})`);
    }
  }
}

if (problems.length > 0) {
  console.error("Message catalogs are out of sync:");
  for (const problem of problems.sort()) {
    console.error(`  - ${problem}`);
  }
  process.exit(1);
}

console.log(`Message catalogs in sync (${catalogs.get(reference).size} keys).`);
