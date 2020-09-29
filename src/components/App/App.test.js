// App.test.js
import React from "react";
import App from "./App";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

describe("App", () => {
  describe("Unit Tests", () => {
    it("Should render the heading", () => {
      const { getByRole } = render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );
      const heading = getByRole("logo");
      expect(heading).toBeInTheDocument();
    });
    it("Should render the Begin Button", () => {
      const { getByRole } = render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );
      const CreateButton = getByRole("link", {name: "Create"});
      expect(CreateButton).toBeInTheDocument();
    });
    it("Should render the Join Button", () => {
      const { getByRole } = render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );
      const JoinButton = getByRole("link", {name: "Join"});
      expect(JoinButton).toBeInTheDocument();
    });

  });
});