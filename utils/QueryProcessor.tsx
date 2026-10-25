function numbersIn(text: string): number[] {
  return (text.match(/-?\d+(\.\d+)?/g) || []).map(Number);
}

function isPrime(n: number): boolean {
  if (n < 2 || !Number.isInteger(n)) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function isSquareAndCube(n: number): boolean {
  const root = Math.round(Math.pow(n, 1 / 6));
  return [root - 1, root, root + 1].some((r) => r >= 0 && Math.pow(r, 6) === n);
}

function bigPow(base: bigint, exp: bigint): bigint {
  let result = BigInt(1);
  for (let i = BigInt(0); i < exp; i++) result *= base;
  return result;
}

// Evaluates "24 plus 12 multiplied by 3" style questions with normal operator precedence.
function arithmetic(q: string): string | null {
  const match = q.match(/what is (.+?)\??$/);
  if (!match) return null;
  const expr = match[1]
    .replace(/to the power of/g, " ^ ")
    .replace(/multiplied by|times/g, " * ")
    .replace(/divided by/g, " / ")
    .replace(/plus/g, " + ")
    .replace(/minus/g, " - ");
  const tokens = expr.trim().split(/\s+/);
  if (tokens.length < 3 || tokens.length % 2 === 0) return null;
  for (let i = 0; i < tokens.length; i++) {
    const isNumber = /^-?\d+(\.\d+)?$/.test(tokens[i]);
    const isOp = ["+", "-", "*", "/", "^"].includes(tokens[i]);
    if (i % 2 === 0 ? !isNumber : !isOp) return null;
  }

  const allInts = tokens.every((t, i) => i % 2 === 1 || /^-?\d+$/.test(t));
  if (allInts && !tokens.includes("/")) {
    const nums: bigint[] = [];
    const ops: string[] = [];
    const rank: Record<string, number> = { "+": 1, "-": 1, "*": 2, "^": 3 };
    const apply = () => {
      const b = nums.pop() as bigint;
      const a = nums.pop() as bigint;
      const op = ops.pop();
      nums.push(op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : bigPow(a, b));
    };
    tokens.forEach((t, i) => {
      if (i % 2 === 0) {
        nums.push(BigInt(t));
        return;
      }
      while (ops.length && rank[ops[ops.length - 1]] >= rank[t] && t !== "^") apply();
      ops.push(t);
    });
    while (ops.length) apply();
    return nums[0].toString();
  }

  const js = tokens.map((t) => (t === "^" ? "**" : t)).join(" ");
  const value = Function(`"use strict"; return (${js});`)() as number;
  return Number.isFinite(value) ? String(Number(value.toFixed(10))) : null;
}

function scrabbleScore(word: string): number {
  const points: Record<string, number> = {};
  const groups: [string, number][] = [
    ["aeioulnstr", 1], ["dg", 2], ["bcmp", 3], ["fhvwy", 4],
    ["k", 5], ["jx", 8], ["qz", 10],
  ];
  groups.forEach(([letters, value]) => letters.split("").forEach((c) => (points[c] = value)));
  return word.split("").reduce((sum, c) => sum + (points[c] || 0), 0);
}

export default function QueryProcessor(query: string): string {
  const q = query.toLowerCase().trim();

  if (q.includes("shakespeare")) {
    return (
      "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
      "English poet, playwright, and actor, widely regarded as the greatest " +
      "writer in the English language and the world's pre-eminent dramatist."
    );
  }

  if (q.includes("largest")) {
    const nums = numbersIn(q.split(":").pop() || q);
    if (nums.length) return String(Math.max(...nums));
  }

  if (q.includes("smallest")) {
    const nums = numbersIn(q.split(":").pop() || q);
    if (nums.length) return String(Math.min(...nums));
  }

  if (q.includes("square and a cube")) {
    return numbersIn(q.split(":").pop() || q).filter(isSquareAndCube).join(", ");
  }

  if (q.includes("prime")) {
    return numbersIn(q.split(":").pop() || q).filter(isPrime).join(", ");
  }

  if (q.includes("anagram")) {
    const target = (q.match(/anagram of "?([a-z]+)"?/) || [])[1];
    const options = (q.split(":").pop() || "").split(",").map((w) => w.trim().replace(/[^a-z]/g, ""));
    const sorted = (w: string) => w.split("").sort().join("");
    if (target) return options.filter((w) => w && w !== target && sorted(w) === sorted(target)).join(", ");
  }

  if (q.includes("scrabble score")) {
    const word = (q.match(/scrabble score of ([a-z]+)/) || [])[1];
    if (word) return String(scrabbleScore(word));
  }

  if (q.includes("fibonacci")) {
    const n = numbersIn(q)[0];
    if (n !== undefined) {
      let a = BigInt(0);
      let b = BigInt(1);
      for (let i = 0; i < n; i++) [a, b] = [b, a + b];
      return a.toString();
    }
  }

  const math = arithmetic(q);
  if (math !== null) return math;

  if (q.includes("andrew id")) {
    return "wrakab";
  }

  if (q.includes("name")) {
    return "Wassim";
  }

  if (q.includes("age")) {
    return "67";
  }

  if (q.includes("eiffel tower")) return "Paris";
  if (q.includes("banana")) return "yellow";
  if (q.includes("james bond") && q.includes("dr no")) return "Sean Connery";
  if (q.includes("spain") && q.includes("currency")) return "peseta";

  return "";
}
