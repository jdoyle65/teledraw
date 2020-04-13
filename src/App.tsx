import React from "react";
import { Provider } from "react-redux";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

// CSS
import "./App.css";

// Components
import Container from "./Container";

// Redux Store
import { store } from "./store";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#ffd600",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Provider store={store}>
        <div className="App">
          <Container />
        </div>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
