import React from "react";
import { Client } from "colyseus.js";

import { ServerUrl } from "../../contants";

const Colyseus = React.createContext(new Client(`wss://${ServerUrl}`));
// const Colyseus = React.createContext(new Client("ws://localhost:2567"));

export default Colyseus;
