import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import { store } from "./app/store.js";
import { ThemeProvider } from "./utils/useTheme.jsx";
import "./index.css";

/**
 * Point d'entrée de l'application React
 * Configure Redux Provider, ThemeProvider et monte l'application
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
