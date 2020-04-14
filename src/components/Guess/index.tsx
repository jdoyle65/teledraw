import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { TextField, Button } from "@material-ui/core";
import { Room } from "colyseus.js";

import "./Guess.css";

import { RoomState, FlipbookEntry } from "../../interfaces";
import { ServerUrl } from "../../contants";

export interface Props {
  room: Room;
}

const Guess = (props: Props) => {
  const [guess, setGuess] = useState<string>("");
  const [imageEntry, setImageEntry] = useState<FlipbookEntry>();
  const [isSubmitted, setIsSumitted] = useState<boolean>(false);
  const [guessError, setGuessError] = useState<string | null>(null);

  const init = (state: RoomState) => {
    if (!state) {
      return;
    }

    const name = state.sessionName[props.room.sessionId];
    const assignedName = state.flipbookAssignments[name];
    const flipbook = state.flipbooks[assignedName];

    if (flipbook) {
      const rotation = state.rotations;
      const prevEntry = flipbook.entries[rotation - 1];
      setImageEntry(prevEntry);
    }
  };

  useEffect(() => {
    init(props.room.state);
    const listener = props.room.onStateChange((state) => init(state));

    return () => listener.remove(() => {});
  }, []);

  useEffect(() => {
    if (guess.length < 1) {
      setGuessError(`Too short!`);
    } else if (guess.length > 40) {
      setGuessError(`Too long!`);
    } else {
      setGuessError(null);
    }
  }, [guess]);

  const submitGuess = () => {
    setIsSumitted(true);
    props.room.send({
      type: "submitGuess",
      guess,
    });
  };

  return (
    <div className="Guess">
      <div>Guess {imageEntry && imageEntry.author}'s picture</div>
      {!isSubmitted && (
        <>
          {imageEntry && (
            <img
              src={`https://${ServerUrl}/${imageEntry.value}`}
              alt="drawing"
              style={{ width: "100%" }}
            />
          )}
          <TextField
            value={guess}
            variant="outlined"
            label="Your guess"
            required
            onChange={(e) => setGuess(e.target.value)}
            error={!!guessError}
            helperText={guessError}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => submitGuess()}
            disabled={!!guessError}
          >
            Submit
          </Button>
        </>
      )}
      {isSubmitted && <div>Waiting for other players...</div>}
    </div>
  );
};

export default connect((state: any) => ({}))(Guess);
