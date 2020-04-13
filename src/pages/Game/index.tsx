import React, { useState, useEffect } from "react";
import { Room } from "colyseus.js";

import DrawCanvas from "../../components/DrawCanvas";
import Guess from "../../components/Guess";

import "./Game.css";

enum GameState {
  Draw = "draw",
  Guess = "guess",
  Unknown = "unknown",
}

export interface Props {
  room: Room;
}

const Game = (props: Props) => {
  const [gameState, setGameState] = useState<GameState>(GameState.Draw);
  const [prompt, setPrompt] = useState<string>();
  const [flipbook, setFlipbook] = useState({ owner: "" });

  const init = (state: any) => {
    if (!state) {
      return;
    }

    const name = state.sessionName && state.sessionName[props.room.sessionId];
    const flipbook =
      state.flipbookAssignments && state.flipbookAssignments[name];

    if (flipbook && state.state === "playing") {
      setFlipbook(flipbook);

      if (!flipbook.entries) {
        return;
      }

      const entry = flipbook.entries[state.rotations];

      switch (entry.type) {
        case "draw":
          setGameState(GameState.Draw);
          break;
        case "guess":
          setGameState(GameState.Guess);
          break;
        default:
          setGameState(GameState.Unknown);
      }

      if (entry.type === "draw" && state.rotations > 0) {
        const prevEntry = flipbook.entries[state.rotations - 1];
        setPrompt(prevEntry.value);
      } else {
        setPrompt(flipbook.prompt);
      }
    }
  };

  useEffect(() => {
    const state = props.room.state;
    init(state);

    const listener = props.room.onStateChange((state) => {
      init(state);
    });

    return () => listener.remove(() => {});
  }, []);

  return (
    <div className="Game">
      {gameState === GameState.Draw && prompt && (
        <DrawCanvas word={prompt} room={props.room} owner={flipbook.owner} />
      )}
      {gameState === GameState.Guess && <Guess room={props.room} />}
      {gameState === GameState.Unknown && (
        <div>Oops! Something went wrong...</div>
      )}
    </div>
  );
};

export default Game;
