import React, { useState, useEffect } from "react";
import { Room } from "colyseus.js";

import { Consumer } from "./components/Colyseus";
import Join from "./pages/Join";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";

enum Page {
  Join,
  Lobby,
  Game,
}

const Container = () => {
  const [room, setRoom] = useState<Room>();
  const [page, setPage] = useState<Page>(Page.Join);

  return (
    <Consumer>
      {(client) => {
        switch (page) {
          case Page.Game:
            if (room) {
              return <Game room={room} />;
            }
            break;
          case Page.Lobby:
            if (room) {
              return <Lobby room={room} startGame={() => setPage(Page.Game)} />;
            }
            break;
          case Page.Join:
          default:
            return (
              <Join
                client={client}
                setRoom={(r) => {
                  setRoom(r);
                  const l = r.onStateChange((state) => {
                    console.log(state.state);
                    if (state.state !== "lobby") {
                      console.log("going game");
                      setPage(Page.Game);
                    } else {
                      console.log("going lobby");
                      setPage(Page.Lobby);
                    }

                    l.clear();
                  });
                }}
              />
            );
        }
      }}
    </Consumer>
  );
};

export default Container;
