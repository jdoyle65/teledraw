import { Reducer } from "redux";

export interface State {
  gameState: number;
  wordToDraw: string;
  drawingUrl: string;
}

const initialState: State = {
  gameState: 0,
  wordToDraw: "Something",
  drawingUrl: "",
};

export enum ActionType {
  SetGameState = "SetGameState",
  SetDrawingUrl = "SetDrawingUrl",
  SetWordToDraw = "SetWordToDraw",
}

export const reducer: Reducer = (
  state: State = initialState,
  action: any
): State => {
  switch (action.type) {
    case ActionType.SetGameState:
      return {
        ...state,
        gameState: action.payload.gameState,
      };
    case ActionType.SetDrawingUrl:
      return {
        ...state,
        drawingUrl: action.payload.url,
      };
    case ActionType.SetWordToDraw:
      return {
        ...state,
        wordToDraw: action.payload.word,
      };
    default:
      return state;
  }
};
