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
  value: string[];
}

export interface Delay {
  type: "delay";
  value: string[];
}

export interface Contact {
  type: "contact";
  value: {
    startNode: string;
    endNode: string;
    startTime: string;
    endTime: string;
    rates: Rate[];
    delays: Delay[];
  };
}
