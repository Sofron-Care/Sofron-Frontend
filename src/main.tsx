import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./app/auth/AuthContext";
import { ConfigProvider } from "antd";
import { App as AntApp } from "antd";
import "./App.css";
import "./i18n";
import "./shared/charts/chartSetup";
import AppWrapper from "./app/AppWrapper";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0D9488",
          borderRadius: 10,
          fontFamily: "Inter, system-ui, sans-serif",
        },
      }}
    >
      <BrowserRouter>
        <AntApp>
          <AuthProvider>
            <AppWrapper />
          </AuthProvider>
        </AntApp>
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>,
);
