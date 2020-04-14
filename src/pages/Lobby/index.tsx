import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { Room } from "colyseus.js";

import "./Lobby.css";

import { RoomState } from "../../interfaces";

export interface Props {
  room: Room<RoomState>;
}

export interface User {
  name: string;
  sessionId: string;
  isPresent: boolean;
  isYou: boolean;
  isPartyLeader: boolean;
}

const Lobby = (props: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [partyLeader, setPartyLeader] = useState<string>();

  const init = (state: RoomState) => {
    if (!state) {
      return;
    }

    const users = [];
    for (let name in state.users) {
      const user = state.users[name];
      users.push({
        ...user,
        isPresent: user.isPresent,
        isYou: user.name === state.sessionName[props.room.sessionId],
        isPartyLeader: user.sessionId === state.partyLeader,
      });
    }

    setUsers(users);
    setPartyLeader(state.partyLeader);
  };

  useEffect(() => {
    init(props.room.state);

    const listener = props.room.onStateChange((state) => {
      const users = [];
      for (let name in state.users) {
        const user = state.users[name];
        users.push({
          ...user,
          isPresent: user.isPresent,
          isYou: user.name === state.sessionName[props.room.sessionId],
          isPartyLeader: user.sessionId === state.partyLeader,
        });
      }

      setUsers(users);
      setPartyLeader(state.partyLeader);
    });

    return () => {
      listener.remove(() => {});
    };
  }, []);

  const startGame = () => {
    props.room.send({
      type: "startGame",
    });
  };

  return (
    <div className="Lobby">
      <ul>
        {users.map((user) => (
          <li
            key={user.name}
            className={user.isYou ? "IsYou" : ""}
            style={{ opacity: user.isPresent ? 1 : 0.4 }}
          >
            <span />
            <span>{user.name}</span>{" "}
            {user.isPartyLeader ? (
              <span
                className="PartyLeader"
                role="img"
                aria-label="party leader crown"
              >
                👑
              </span>
            ) : (
              <span />
            )}
          </li>
        ))}
      </ul>
      {partyLeader === props.room.sessionId && (
        <Button
          variant="contained"
          color="primary"
          disabled={users.length < 2}
          onClick={startGame}
        >
          Start
        </Button>
      )}
    </div>
  );
};

export default Lobby;
