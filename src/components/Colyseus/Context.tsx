import React from "react";
import { Client } from "colyseus.js";

const Colyseus = React.createContext(new Client("wss://5f6b2124.ngrok.io"));
// const Colyseus = React.createContext(new Client("ws://localhost:2567"));

export default Colyseus;
