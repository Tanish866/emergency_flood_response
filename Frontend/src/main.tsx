import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "@/Redux/store";

import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

// main.tsx mein, store import ke baad add karo:
if (import.meta.env.DEV) {
  // @ts-expect-error - dev only debug helper
  window.store = store;
}

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
);