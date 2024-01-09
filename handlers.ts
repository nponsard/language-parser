import { Contact, Delay, Rate, outputElement } from "./types.ts";
// these handlers work for the grammar in grammar3.json
export function HandleNonTerminal(
  elements: outputElement[],
  token: string
): outputElement[] {
  const out = [] as outputElement[];
  if (elements.length === 0) {
    return out;
  }

  switch (token) {
    case "C": {
      const obj = {
        type: "contact",
        value: {
          startNode: "",
          endNode: "",
          startTime: "",
          endTime: "",
          rates: [] as Rate[],
          delays: [] as Delay[],
        },
      } as Contact;
      obj.value.startNode = elements[1].value as string;
      obj.value.endNode = elements[2].value as string;
      obj.value.startTime = elements[3].value as string;
      obj.value.endTime = elements[4].value as string;
      for (const e of elements) {
        if (e.type === "rate") {
          obj.value.rates.push(e as Rate);
        }
        if (e.type === "delay") {
          obj.value.delays.push(e as Delay);
        }
      }
      out.push(obj);
      break;
    }

    case "R": {
      const obj = {
        type: "rate",
        value: [] as string[],
      } as Rate;

      for (const e of elements) {
        if (e.type === "num") {
          obj.value.push(e.value);
        }
      }
      out.push(obj);
      break;
    }
    case "D": {
      const obj = {
        type: "delay",
        value: [] as string[],
      } as Delay;

      for (const e of elements) {
        if (e.type === "num") {
          obj.value.push(e.value);
        }
      }
      out.push(obj);
      break;
    }
  }
  return out;
}
