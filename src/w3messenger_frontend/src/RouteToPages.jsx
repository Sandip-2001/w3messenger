import React from "react";
import { Routes, Route } from "react-router-dom";
import { SignInPage } from "./components/SignInPage";
import { DataFetchingPage } from "./components/DataFetchingPage";
import { RegisterPage } from "./components/RegisterPage";
import { App } from "./components/App";

export const RouteToPages = () => (
  <Routes>
    <Route exact path="/" element={<SignInPage />} />
    <Route path="/sign" element={<SignInPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/fetchData" element={<DataFetchingPage />} />
    <Route path="/app" element={<App />} />
  </Routes>
);