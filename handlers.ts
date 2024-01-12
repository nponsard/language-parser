import { Contact, Delay, Rate, outputElement } from "./types.ts";
// these handlers work for the grammar in grammar3.json
export function HandleNonTerminal(
  elements: outputElement[],
  token: string
): outputElement[] {
  const out = elements;
  if (elements.length === 0) {
    return out;
  }

  switch (token) {
    case "C": {
      console.log(out);
      out.shift();
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
      obj.value.startNode = out.shift()?.value as string;
      obj.value.endNode = out.shift()?.value as string;
      obj.value.startTime = out.shift()?.value as string;
      obj.value.endTime = out.shift()?.value as string;

      // remove linebreak
      out.shift();
      out.push(obj);

      console.log(out);

      while (
        out.length > 0 &&
        (out[0].type === "rate" || out[0].type === "delay")
      ) {
        const e = out.shift() as Rate | Delay;

        if (e.type === "rate") {
          obj.value.rates.push(e);
        }
        if (e.type === "delay") {
          obj.value.delays.push(e);
        }
      }
      break;
    }

    case "R": {
      out.shift();
      const obj = {
        type: "rate",
        value: [] as string[],
      } as Rate;

      for (let i = 0; i < 3; i++) {
        const e = out.shift();

        if (e != undefined && e.type === "num") {
          obj.value.push(e.value);
        }
      }
      // remove linebreak
      out.shift();
      out.push(obj);
      break;
    }
    case "D": {
      out.shift();
      const obj = {
        type: "delay",
        value: [] as string[],
      } as Delay;

      for (let i = 0; i < 3; i++) {
        const e = out.shift();

        if (e != undefined && e.type === "num") {
          obj.value.push(e.value);
        }
      }
      // remove linebreak
      out.shift();
      out.push(obj);
      break;
    }
  }
  return out;
}
