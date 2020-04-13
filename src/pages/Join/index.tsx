import React, { useState, useEffect } from "react";
import { Button, TextField, Snackbar } from "@material-ui/core";
import { Client, Room } from "colyseus.js";

// CSS
import "./Join.css";

enum StorageKey {
  Name = "name",
  Room = "room",
}

const MaxNameLength = 20;

export interface Props {
  client: Client;
  setRoom: (name: Room) => void;
}

const Join = (props: Props) => {
  const [room, setRoom] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>();
  const [warningOpen, setWarningOpen] = useState<boolean>(false);

  useEffect(() => {
    const storedName = localStorage.getItem(StorageKey.Name);
    if (typeof storedName === "string") {
      setName(storedName);
    }

    const storedRoom = localStorage.getItem(StorageKey.Room);
    if (typeof storedRoom === "string") {
      setRoom(storedRoom);
    }
  }, []);

  useEffect(() => {
    if (name.length < 1) {
      setNameError("Too short!");
    } else if (name.length > MaxNameLength) {
      setNameError("Too long!!");
    } else {
      setNameError(undefined);
      localStorage.setItem(StorageKey.Name, name);
    }
  }, [name]);

  useEffect(() => {
    localStorage.setItem(StorageKey.Room, room);
  }, [room]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.client
      .joinOrCreate("teledraw", { code: room, name })
      .then((room) => {
        props.setRoom(room);
      })
      .catch((err) => {
        if (err === "onAuth failed.") {
          setWarningOpen(true);
          setNameError("Name is taken");
        }
      });
  };

  return (
    <div className="Join">
      <h1>Join Game</h1>
      <form onSubmit={(e) => onSubmit(e)} autoComplete="off" noValidate>
        <TextField
          onChange={(e) => setName(String(e.target.value))}
          value={name}
          margin="normal"
          label="Name"
          variant="outlined"
          required
          error={!!nameError}
          helperText={nameError}
        />
        <TextField
          onChange={(e) => setRoom(String(e.target.value))}
          value={room}
          margin="normal"
          label="Room"
          variant="outlined"
          required
          error={room.length !== 4}
          helperText={room.length !== 4 ? "Must be 4 characters" : ""}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!!(room.length !== 4 || nameError)}
        >
          Join
        </Button>
        <Snackbar
          open={warningOpen}
          message={`Name "${name}" is taken`}
          autoHideDuration={2000}
          onClose={() => setWarningOpen(false)}
        />
      </form>
    </div>
  );
};

export default Join;
