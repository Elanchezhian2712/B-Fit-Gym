import clsx, { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date = new Date()) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function parseRestSeconds(rest: string): number {
  const matches = rest.match(/\d+/g);
  if (!matches) return 60;
  const numbers = matches.map(Number);
  return Math.max(...numbers);
}

export function parseWarmup(warmup: string): { weight: string; reps: string } {
  const repsMatch = warmup.match(/×\s*(\d+)/);
  const reps = repsMatch ? repsMatch[1] : "12";
  let weight = warmup.split("×")[0].trim();
  weight = weight.replace(/^1\s+/i, "").replace(/warm-up set$/i, "").trim();
  if (/light-weight/i.test(weight) || /^light$/i.test(weight)) weight = "Light";
  return { weight: weight || "Light", reps };
}
