import React, { useEffect, useState } from "react";
import { Room } from "colyseus.js";

import "./Review.css";

import {
  RoomState,
  Flipbook,
  FlipbookEntry,
  EntryType,
} from "../../interfaces";

import { ServerUrl } from "../../contants";

export interface Props {
  room: Room<RoomState>;
}

interface EntryWithKey extends FlipbookEntry {
  key: number | string;
}

const Review = (props: Props) => {
  const [book, setBook] = useState<Flipbook>();

  const init = (state: RoomState) => {
    if (!state) {
      return;
    }

    if (state.reviewBook) {
      const book = state.flipbooks[state.reviewBook];
      setBook(JSON.parse(JSON.stringify(book)));
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
        ([...book.entries] as EntryWithKey[])
          .map((entry, index) => {
            entry.key = index;
            return entry;
          })
          .filter((entry) => entry.doShowReview)
          .map((entry) => (
            <div key={entry.key}>
              {entry.type === EntryType.Draw && (
                <>
                  <div className="ReviewEntryLabel">
                    {entry.author}'s drawing
                  </div>
                  <img
                    src={`https://${ServerUrl}/${entry.value}`}
                    style={{ width: "80%", maxWidth: "640px" }}
                    alt={`${entry.author}'s drawing`}
                  />
                </>
              )}
              {entry.type === EntryType.Guess && (
                <>
                  <div className="ReviewEntryLabel">{entry.author}'s guess</div>
                  <div className="ReviewEntryGuess">{entry.value}</div>
                </>
              )}
              {entry.type === EntryType.Prompt && (
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
