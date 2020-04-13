import React, { useState, useEffect } from "react";
import { Room } from "colyseus.js";

import { Consumer } from "./components/Colyseus";
import Join from "./pages/Join";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Review from "./pages/Review";

enum Page {
  Join,
  Lobby,
  Game,
  Review,
}

const Container = () => {
  const [room, setRoom] = useState<Room>();
  const [page, setPage] = useState<Page>(Page.Join);

  const init = (state: any) => {
    if (!state) {
      return;
    }

    if (state.state) {
      switch (state.state) {
        case "lobby":
          setPage(Page.Lobby);
          break;
        case "playing":
          setPage(Page.Game);
          break;
        case "reviewing":
          setPage(Page.Review);
          break;
        default:
          setPage(Page.Join);
      }
    }
  };

  useEffect(() => {
    let stateListener: import("strong-events/lib").EventEmitter<(
      state: any
    ) => void>;
    if (room) {
      init(room.state);
      stateListener = room.onStateChange((state) => init(state));
    }

    return () => {
      if (stateListener) {
        stateListener.clear();
      }
    };
  }, [room]);

  return (
    <Consumer>
      {(client) => {
        switch (page) {
          case Page.Game:
            return room && <Game room={room} />;
          case Page.Lobby:
            return room && <Lobby room={room} />;
          case Page.Review:
            return room && <Review room={room} />;
          case Page.Join:
          default:
            return <Join client={client} setRoom={(r) => setRoom(r)} />;
        }
      }}
    </Consumer>
  );
};

export default Container;
