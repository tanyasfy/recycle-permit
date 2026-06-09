import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Route, Routes } from "react-router";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { renderWithProviders } from "./renderWithProviders";

const mockUser = {
  id: "user-001",
  name: "Test User",
  email: "test@example.de",
  companyName: "Test GmbH",
  drafts: 0,
};

function renderWithRoute(route: string, preloadedState = {}) {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<div>Startseite</div>} />
      <Route element={<ProtectedRoute />}>
        <Route path="/permits" element={<div>Meine Anträge</div>} />
        <Route path="/permit/new" element={<div>Neuer Antrag</div>} />
      </Route>
    </Routes>,
    { route, preloadedState },
  );
}

describe("ProtectedRoute", () => {
  it("redirects unauthenticated user from /permits to /", () => {
    renderWithRoute("/permits");
    expect(screen.getByText("Startseite")).toBeInTheDocument();
    expect(screen.queryByText("Meine Anträge")).not.toBeInTheDocument();
  });

  it("redirects unauthenticated user from /permit/new to /", () => {
    renderWithRoute("/permit/new");
    expect(screen.getByText("Startseite")).toBeInTheDocument();
    expect(screen.queryByText("Neuer Antrag")).not.toBeInTheDocument();
  });

  it("allows authenticated user to access /permits", () => {
    renderWithRoute("/permits", { auth: { user: mockUser } });
    expect(screen.getByText("Meine Anträge")).toBeInTheDocument();
  });

  it("allows authenticated user to access /permit/new", () => {
    renderWithRoute("/permit/new", { auth: { user: mockUser } });
    expect(screen.getByText("Neuer Antrag")).toBeInTheDocument();
  });
});
