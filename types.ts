export interface TokenElement {
  type: string;
  value: string;
}

export type outputElement = TokenElement | Rate | Delay | Contact;
export type stackOutput = outputElement[] | null;

export type rulesT = (string | null)[][];

export type ruleT = (string | null)[];

export interface Rate {
  type: "rate";
  value: number[];
}

export interface Delay {
  type: "delay";
  delay: number;
  start: number;
  end: number;
}

export interface Contact {
  type: "contact";
  value: {
    startNode: string;
    endNode: string;
    startTime: number;
    endTime: number;
    rates: Rate[];
    delays: Delay[];
  };
}
