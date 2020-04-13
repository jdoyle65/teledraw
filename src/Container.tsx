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
    let stateListener: any;
    let messageListener: any, leaveListener: any;
    if (room) {
      leaveListener = room.onLeave((code) => {
        setPage(Page.Join);
      });

      messageListener = room.onMessage((data: any) => {
        if (data.type === "error") {
          console.error(data);
        }
      });

      init(room.state);
      stateListener = room.onStateChange((state) => init(state));
    }

    return () => {
      if (stateListener) {
        stateListener.clear();
      }

      if (messageListener) {
        messageListener.clear();
      }

      if (leaveListener) {
        leaveListener.clear();
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
