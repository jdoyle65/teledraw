import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { Room } from "colyseus.js";

export interface Props {
  room: Room;
  startGame: () => void;
}

export interface User {
  name: string;
  sessionId: string;
  isYou: boolean;
}

const Lobby = (props: Props) => {
  const [users, setUsers] = useState<{ name: string; isYou: boolean }[]>([]);
  const [partyLeader, setPartyLeader] = useState<string>();

  useEffect(() => {
    const listener = props.room.onStateChange((state) => {
      const users = [];
      for (let name in state.users) {
        const user = state.users[name];
        if (user.isPresent) {
          users.push({
            ...user,
            isYou: user.name === state.sessionName[props.room.sessionId],
          });
        }
      }

      setUsers(users);
      setPartyLeader(state.partyLeader);

      if (props.room.state.state === "playing") {
        props.startGame();
      }
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
    <div>
      <ul>
        {users.map((user) => (
          <li>
            {user.name} {user.isYou ? "(You)" : ""}
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
