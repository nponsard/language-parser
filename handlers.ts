import { Contact, Delay, Rate, outputElement, TokenElement } from "./types.ts";
// Tested with the grammars in grammar3.json and grammar4.json
export function HandleNonTerminal(
  elements: outputElement[],
  token: string
): outputElement[] {
  const out = elements;
  if (elements.length === 0) {
    return out;
  }

  switch (token) {
    // contact
    case "C": {
      console.log(out);
      out.shift();
      const obj = {
        type: "contact",
        value: {
          startNode: "",
          endNode: "",
          startTime: 0,
          endTime: 0,
          rates: [] as Rate[],
          delays: [] as Delay[],
        },
      } as Contact;

      // 2 string
      obj.value.startNode = (out.shift() as TokenElement).value;
      obj.value.endNode = (out.shift() as TokenElement).value;
      // 2 num
      obj.value.startTime = parseInt((out.shift() as TokenElement).value);
      obj.value.endTime = parseInt((out.shift() as TokenElement).value);

      // remove linebreak
      out.shift();
      out.push(obj);

      console.log(out);

      // pile temporaire pour stocker les contacts déjà traités
      const temp = [] as outputElement[];

      // read all rates and delays
      while (out.length) {
        const e = out.shift() as Rate | Delay;

        if (e.type === "rate") {
          obj.value.rates.push(e);
        } else if (e.type === "delay") {
          obj.value.delays.push(e);
        } else {
          temp.unshift(e);
        }
      }
      out.push(...temp);
      break;
    }

    // rate
    case "R": {
      out.shift();
      const obj = {
        type: "rate",
        value: [] as number[],
      } as Rate;

      // Lectures des 3 valeurs
      for (let i = 0; i < 3; i++) {
        const e = out.shift();

        if (e != undefined && e.type === "num") {
          obj.value.push(parseInt(e.value));
        }
      }
      // remove linebreak
      out.shift();
      out.push(obj);
      break;
    }

    // delay
    case "D": {
      out.shift();
      const obj = {
        type: "delay",
        delay: 0,
        start: 0,
        end: 0,
      } as Delay;

      // Lecture des 3 valeurs, on sait déjà que c'est 3 num

      obj.delay = parseInt((out.shift() as TokenElement).value);
      obj.start = parseInt((out.shift() as TokenElement).value);
      obj.end = parseInt((out.shift() as TokenElement).value);

      // remove linebreak
      out.shift();
      out.push(obj);
      break;
    }
  }
  return out;
}
