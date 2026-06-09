import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AuthModal } from "../features/auth/AuthModal";
import { renderWithProviders } from "./renderWithProviders";

const onClose = vi.fn();

function renderModal(isOpen = true) {
  return renderWithProviders(<AuthModal isOpen={isOpen} onClose={onClose} />);
}

describe("AuthModal", () => {
  it("renders when open", () => {
    renderModal();
    expect(screen.getByText("Schon angemeldet?")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    renderModal(false);
    expect(screen.queryByText("Schon angemeldet?")).not.toBeInTheDocument();
  });

  it("shows validation errors when submitted empty", async () => {
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: "Anmelden" }));
    await waitFor(() => {
      expect(screen.getAllByText(/mindestens 5 Zeichen/i)).toHaveLength(2);
    });
  });

  it("accordion expands and collapses on click", async () => {
    renderModal();
    const trigger = screen.getByText(/Sie haben noch keine Benutzer-ID\?/);
    expect(screen.queryByText(/ear-Portal nutzen/)).not.toBeInTheDocument();
    await userEvent.click(trigger);
    expect(screen.getByText(/ear-Portal nutzen/)).toBeInTheDocument();
    await userEvent.click(trigger);
    expect(screen.queryByText(/ear-Portal nutzen/)).not.toBeInTheDocument();
  });

  it("Tab stays within modal fields", async () => {
    renderModal();
    const loginInput = screen.getByRole("textbox", { name: /Benutzer-Id/i });
    loginInput.focus();
    await userEvent.tab();
    expect(document.activeElement).not.toBe(document.body);
    expect(
      screen
        .getByRole("textbox", { name: /Passwort/i })
        .closest("label")
        ?.contains(document.activeElement) ||
        document.activeElement?.closest("section") !== null,
    ).toBe(true);
  });
});
