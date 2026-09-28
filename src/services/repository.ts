import "server-only";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { seed } from "@/data/platform";
import type { Database } from "@/types/platform";

// Local, single-process demo adapter. Replace with transactional database storage for deployment.
const file = path.join(process.cwd(), ".demo-data", "repository.json");
const globalStore = globalThis as typeof globalThis & {
  tmQueue?: Promise<unknown>;
};
async function read(): Promise<Database> {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return structuredClone(seed);
  }
}
export async function repository(): Promise<Database> {
  await globalStore.tmQueue;
  return read();
}
export function mutate<T>(fn: (db: Database) => T | Promise<T>): Promise<T> {
  const next = (globalStore.tmQueue ?? Promise.resolve()).then(async () => {
    const db = await read();
    const result = await fn(db);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(`${file}.tmp`, JSON.stringify(db, null, 2));
    await rename(`${file}.tmp`, file);
    return result;
  });
  globalStore.tmQueue = next.catch(() => undefined);
  return next;
}
export function seats(db: Database, id: string) {
  const c = db.courses.find((c) => c.id === id);
  return Math.max(
    0,
    (c?.capacity ?? 0) -
      db.registrations.filter(
        (r) =>
          r.courseId === id &&
          ["confirmed", "completed"].includes(r.registrationStatus),
      ).length,
  );
}
