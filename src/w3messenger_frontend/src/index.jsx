import React from 'react';
import { RouteToPages } from "./RouteToPages";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";


const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <RouteToPages />
  </BrowserRouter>
);