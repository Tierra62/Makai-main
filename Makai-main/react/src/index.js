import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Main from "./Main";
import { BrowserRouter as Router } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

const container = document.getElementById("main");
const root = createRoot(container);

root.render(
  <Main>
    <Router>
      <App />
    </Router>
  </Main>
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
