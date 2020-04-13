import React, { useEffect, useState } from "react";
import { Room } from "colyseus.js";

import "./Review.css";

export interface Props {
  room: Room;
}

const Review = (props: Props) => {
  const [book, setBook] = useState<any>({});

  const init = (state: any) => {
    if (state.reviewBook) {
      setBook(JSON.parse(JSON.stringify(state.reviewBook)));
    }
  };

  useEffect(() => {
    init(props.room.state);
    props.room.onStateChange((state) => init(state));
  }, []);

  return (
    <div className="Review">
      {book && <div className="ReviewOwner">{book.owner}'s Flipbook</div>}
      {book &&
        Array.isArray(book.entries) &&
        [...book.entries]
          .map((entry: any, index) => {
            entry.key = index;
            return entry;
          })
          .reverse()
          .map((entry: any) => (
            <div key={entry.key}>
              {entry.type === "draw" && (
                <>
                  <div className="ReviewEntryLabel">
                    {entry.author}'s drawing
                  </div>
                  <img
                    src={entry.value}
                    style={{ width: "80%", maxWidth: "640px" }}
                  />
                </>
              )}
              {entry.type === "guess" && (
                <>
                  <div className="ReviewEntryLabel">{entry.author}'s guess</div>
                  <div className="ReviewEntryGuess">{entry.value}</div>
                </>
              )}
              {entry.type === "prompt" && (
                <>
                  <div className="ReviewEntryLabel">Original Prompt</div>
                  <div className="ReviewEntryGuess">{entry.value}</div>
                </>
              )}
            </div>
          ))}
    </div>
  );
};

export default Review;
