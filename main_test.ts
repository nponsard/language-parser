import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { fullParse, lexing, loadGrammar } from "./main.ts";

Deno.test(function lexingTest() {
  assertEquals(
    lexing(`
  contact A B 20 50
  rate 5 20 35
  rate 10 35 50
  delay 1 20 50

  contact B C 100 140
  rate 10 100 140
  delay 1 100 130
  delay 2 130 140
  
  
  `),
    [
      "contact",
      "A",
      "B",
      "20",
      "50",
      "\n",
      "rate",
      "5",
      "20",
      "35",
      "\n",
      "rate",
      "10",
      "35",
      "50",
      "\n",
      "delay",
      "1",
      "20",
      "50",
      "\n",
      "contact",
      "B",
      "C",
      "100",
      "140",
      "\n",
      "rate",
      "10",
      "100",
      "140",
      "\n",
      "delay",
      "1",
      "100",
      "130",
      "\n",
      "delay",
      "2",
      "130",
      "140",
      "\n",
    ]
  );
});

Deno.test(async function fullParseTest() {
  const grammar = await loadGrammar();
  const result = fullParse(
    `
  contact A B 20 50
  rate 5 20 35
  rate 10 35 50
  delay 1 20 50

  contact B C 100 140
  rate 10 100 140
  delay 1 100 130
  delay 2 130 140

  `,
    grammar
  );
  assertEquals(result.valid, true);
});

Deno.test(async function invalidOrder() {
  const grammar = await loadGrammar();
  const result = fullParse(
    `
  rate 5 20 35
  contact A B 20 50
  rate 10 35 50
  delay 1 20 50

  contact B C 100 140
  rate 10 100 140
  delay 1 100 130
  delay 2 130 140

  `,
    grammar
  );
  assertEquals(result.valid, false);
});

Deno.test(async function garbage() {
  const grammar = await loadGrammar();
  const result = fullParse(
    `astoarsetaorsenredareihdsoraesntaro

  `,
    grammar
  );
  assertEquals(result.valid, false);
});

Deno.test(async function invalidOrder2() {
  const grammar = await loadGrammar();
  const result = fullParse(
    `
  contact A B 20 50
  rate 5 20 35
  rate 10 35 50
  delay 1 20 50

  contact B 100 140 C
  delay 2 130 140
  rate 10 100 140
  delay 1 100 130

  `,
    grammar
  );
  assertEquals(result.valid, false);
});

Deno.test(async function mixedDelayRate() {
  const grammar = await loadGrammar();
  const result = fullParse(
    `
  contact A B 20 50
  rate 5 20 35
  delay 1 20 50
  rate 10 35 50

  contact B C 100 140
  delay 2 130 140
  rate 10 100 140
  delay 1 100 130

  `,
    grammar
  );
  assertEquals(result.valid, true);
});

Deno.test(async function invalidType() {
  const grammar = await loadGrammar();
  const result = fullParse(
    `
    contact A B B 50
    rate 5 20 35
    delay 1 20 50
    rate 10 35 50
  
    contact B C 100 140
    delay 2 130 140
    rate 10 100 140
    delay 1 100 130

  `,
    grammar
  );
  assertEquals(result.valid, false);
});
