import React from "react";
import { createRoot } from "react-dom/client";
import { Home } from "./pages/Home";

const root = document.getElementById("root")!;
createRoot(root).render(<Home />);
