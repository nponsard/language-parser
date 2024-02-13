import { HandleNonTerminal } from "./handlers.ts";
import { outputElement, ruleT, rulesT, stackOutput } from "./types.ts";

// Lexer, chaque ligne est séparée par un \n, si la ligne est vide, on ne la prend pas en compte
export function lexing(input: string): string[] {
  return input.split("\n").flatMap((l) => {
    const words = l.trim().split(" ");
    if (words.length === 0 || (words.length === 1 && words[0] === "")) {
      return [];
    }
    words.push("\n");
    return words;
  });
}

// Représentation de la grammaire (récupérée depuis un fichier JSON)
interface Grammar {
  tokens: {
    [index: string]: {
      pattern: string;
    };
  };
  rules: {
    [index: string]: (string | null)[][];
  };
}

// chargement de la grammaire
export async function loadGrammar(file = "./grammar.json"): Promise<Grammar> {
  const grammarFile = await Deno.readTextFile(file);
  return JSON.parse(grammarFile);
}

// Application d'une règle de la grammaire sur un ensemble de tokens
function applyRule(
  input: string[],
  rule: ruleT,
  cursor: number,
  grammar: Grammar
): { cursor: number; output: stackOutput } {
  const elements: outputElement[] = [];
  for (const matcher of rule) {
    // si l'élément de la règle est null, on passe
    if (matcher === null) {
      continue;
    }

    // terminal, on vérifie que le mot correspond, on avance le curseur et ajoute le token à la sortie
    if (Object.keys(grammar.tokens).includes(matcher)) {
      const word = input[cursor];
      if (word === undefined) {
        return { cursor: -1, output: null };
      }
      cursor++;

      const regexp = new RegExp(grammar.tokens[matcher].pattern);

      console.log(cursor, regexp, word, regexp.test(word));
      if (!regexp.test(word)) {
        return { cursor: -1, output: null };
      }
      elements.push({ type: matcher, value: word });
    }

    // non terminal, on appelle la règle associée
    else if (Object.keys(grammar.rules).includes(matcher)) {
      console.log("début " + matcher);
      // exécution de la règle associée
      const step_output = parseStep(
        input,
        grammar.rules[matcher],
        cursor,
        grammar
      );
      console.log("fin " + matcher);
      // si la règle n'a pas fonctionné
      if (step_output.cursor === -1) {
        return { cursor: -1, output: null };
      }
      cursor = step_output.cursor;

      // on ajoute la sortie de la règle à la sortie
      if (step_output.output !== null) {
        // on applique le handler sur la sortie de la règle`
        const ret = HandleNonTerminal(step_output.output, matcher);

        // Erreur on annule tout
        if (ret.error) {
          console.error(ret.error);
          return { cursor: -1, output: null };
        }

        // si le handler n'a pas retourné d'éléments, on pousse la sortie de la règle
        if (ret.elements.length === 0) {
          elements.push(...step_output.output);
        } else {
          elements.push(...ret.elements);
        }
      }
    } else {
      console.error("invalid token type");
      return { cursor: -1, output: null };
    }
  }

  return { cursor, output: elements };
}

// on essaie d'appliquer toutes les règles
function parseStep(
  input: string[],
  rules: rulesT,
  cursor: number,
  grammar: Grammar
): { cursor: number; output: stackOutput } {
  let best: { cursor: number; output: stackOutput } = {
    cursor: -1,
    output: null,
  };

  // On exécute toutes les règles et on retient celle qui a consommé le plus de tokens
  for (const rule of rules) {
    const inputCopy = input.slice();
    const result = applyRule(inputCopy, rule, cursor, grammar);

    // si la règle a tout consommé, on retourne le résultat
    if (result.cursor >= best.cursor) {
      best = result;
    }
  }

  // si aucune règle n'a fonctionné
  return best;
}

// On fait le parsing sur les tokens (après lexing)
export function parseTokens(
  intput: string[],
  grammar: Grammar
): { valid: boolean; output: stackOutput } {
  // On démarre avec la règle de départ
  const result = parseStep(intput, [["S"]], 0, grammar);
  console.log(result, intput.length);
  // On vérifie que la règle a consommé tous les tokens
  const valid = result.cursor >= intput.length;
  return { valid, output: result.output };
}

// Lexing + parsing
export function fullParse(
  input: string,
  grammar: Grammar
): { valid: boolean; output: stackOutput } {
  return parseTokens(lexing(input), grammar);
}

// si ce fichier est appelé directement, on lance le parsing
if (import.meta.main) {
  if (Deno.args.length < 2) {
    console.error(
      "usage: deno run --allow-read=. main.ts <grammar file> <input file>"
    );
    Deno.exit(1);
  }

  // arguments
  const grammarFilePath = Deno.args[0];
  const inputFilePath = Deno.args[1];

  // on charge la grammaire et le fichier d'entrée
  const grammar = await loadGrammar(grammarFilePath);
  const input = await Deno.readTextFile(inputFilePath);

  // on fait le parsing
  const result = fullParse(input, grammar);
  if (!result.valid) {
    console.error("invalid input file");
    Deno.exit(1);
  }
  console.log(JSON.stringify(result.output, null, 1));
}
