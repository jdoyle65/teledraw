export enum GameState {
  Lobby = "lobby",
  Playing = "playing",
  Reviewing = "reviewing",
}

export enum EntryType {
  Draw = "draw",
  Guess = "guess",
  Prompt = "prompt",
}

export interface RoomState {
  code: string;
  state: GameState;
  users: { [key: string]: User };
  sessionName: { [sessionId: string]: string };
  partyLeader: string;
  flipbooks: { [owner: string]: Flipbook };
  flipbookAssignments: { [name: string]: string };
  userOrder: string[];
  rotations: number;
  reviewBook: string;
}

export interface User {
  sessionId: string;
  name: string;
  isPresent: boolean;
}

export interface Flipbook {
  owner: string;
  prompt: string;
  entries: FlipbookEntry[];
}

export interface FlipbookEntry {
  author: string;
  type: EntryType;
  value: string;
  doShowReview: boolean;
}
