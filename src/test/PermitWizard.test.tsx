import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PermitWizard } from "../features/permit/PermitWizard";
import { renderWithProviders } from "./renderWithProviders";
import { permitService } from "../features/permit/permitService";
import type { Permit } from "../features/permit/permit.types";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return { ...actual, useNavigate: () => vi.fn() };
});

beforeEach(() => localStorage.removeItem(STORAGE_KEY));
afterEach(() => localStorage.removeItem(STORAGE_KEY));

const STORAGE_KEY = "permit-form-draft";

const mockUser = {
  id: "user-001",
  name: "Test User",
  email: "test@example.de",
  companyName: "Test GmbH",
  drafts: 0,
};

function renderWizard(draft?: Permit) {
  return renderWithProviders(<PermitWizard draft={draft} />, {
    preloadedState: { auth: { user: mockUser } },
  });
}

async function fillStep1() {
  await userEvent.type(
    screen.getByRole("textbox", { name: /Unternehmensname/i }),
    "Test GmbH",
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: /Kontaktperson/i }),
    "Max Mustermann",
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: /E-Mail/i }),
    "max@test.de",
  );
}

async function fillStep2() {
  await userEvent.type(
    screen.getByRole("textbox", { name: /Name der Anlage/i }),
    "Anlage Nord",
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: /Standort/i }),
    "München",
  );
  await userEvent.clear(screen.getByRole("spinbutton"));
  await userEvent.type(screen.getByRole("spinbutton"), "500");
}

async function fillStep3() {
  const file = new File(["content"], "antrag.pdf", { type: "application/pdf" });
  await userEvent.upload(screen.getByLabelText(/Unterlagen/i), file);
}

async function clickWeiter() {
  await userEvent.click(screen.getByRole("button", { name: "Weiter" }));
}

describe("PermitWizard — rendering", () => {
  it("shows step 1 on initial render", () => {
    renderWizard();
    expect(screen.getByText("Unternehmensdaten")).toBeInTheDocument();
  });

  it("does not show Zurück on step 1", () => {
    renderWizard();
    expect(
      screen.queryByRole("button", { name: "Zurück" }),
    ).not.toBeInTheDocument();
  });

  it("renders all stepper labels", () => {
    renderWizard();
    expect(screen.getByText("Unternehmen")).toBeInTheDocument();
    expect(screen.getByText("Recyclinganlage")).toBeInTheDocument();
    expect(screen.getByText("Dokumente")).toBeInTheDocument();
    expect(screen.getByText("Zusammenfassung")).toBeInTheDocument();
  });
});

describe("PermitWizard — step 1 validation", () => {
  it("blocks navigation when fields are empty", async () => {
    renderWizard();
    await clickWeiter();
    expect(screen.getByText("Unternehmensdaten")).toBeInTheDocument();
  });

  it("shows error for missing company name", async () => {
    renderWizard();
    await clickWeiter();
    await waitFor(() => {
      expect(
        screen.getByText("Bitte geben Sie den Unternehmensnamen ein."),
      ).toBeInTheDocument();
    });
  });

  it("shows error for invalid email", async () => {
    renderWizard();
    await userEvent.type(
      screen.getByRole("textbox", { name: /Unternehmensname/i }),
      "Test GmbH",
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /Kontaktperson/i }),
      "Max Mustermann",
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /E-Mail/i }),
      "not-an-email",
    );
    await clickWeiter();
    await waitFor(() => {
      expect(
        screen.getByText("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
      ).toBeInTheDocument();
    });
  });
});

describe("PermitWizard — step navigation", () => {
  it("advances to step 2 after valid step 1", async () => {
    renderWizard();
    await fillStep1();
    await clickWeiter();
    await waitFor(() => {
      expect(
        screen.getByText("Angaben zur Recyclinganlage"),
      ).toBeInTheDocument();
    });
  });

  it("shows Zurück on step 2", async () => {
    renderWizard();
    await fillStep1();
    await clickWeiter();
    await waitFor(() => screen.getByText("Angaben zur Recyclinganlage"));
    expect(screen.getByRole("button", { name: "Zurück" })).toBeInTheDocument();
  });

  it("goes back to step 1 from step 2", async () => {
    renderWizard();
    await fillStep1();
    await clickWeiter();
    await waitFor(() => screen.getByText("Angaben zur Recyclinganlage"));
    await userEvent.click(screen.getByRole("button", { name: "Zurück" }));
    expect(screen.getByText("Unternehmensdaten")).toBeInTheDocument();
  });

  it("shows Antrag absenden only on last step", async () => {
    renderWizard();
    expect(
      screen.queryByRole("button", { name: "Antrag absenden" }),
    ).not.toBeInTheDocument();

    await fillStep1();
    await clickWeiter();
    await waitFor(() => screen.getByText("Angaben zur Recyclinganlage"));

    await fillStep2();
    await clickWeiter();
    await waitFor(() => screen.getByText("Dokumente hochladen"));

    await fillStep3();
    await clickWeiter();
    await waitFor(() =>
      screen.getByRole("heading", { name: "Zusammenfassung" }),
    );

    expect(
      screen.getByRole("button", { name: "Antrag absenden" }),
    ).toBeInTheDocument();
  });
});

describe("PermitWizard — draft pre-fill", () => {
  it("pre-fills fields from draft prop", async () => {
    const draft: Permit = {
      id: "EAR-2026-TEST",
      userId: "user-001",
      companyName: "Draft GmbH",
      contactPerson: "Anna Schmidt",
      email: "anna@draft.de",
      facilityName: "Anlage Süd",
      location: "Berlin",
      capacity: 800,
      hasPermit: false,
      documents: [],
      status: "draft",
    };

    renderWizard(draft);

    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: /Unternehmensname/i }),
      ).toHaveValue("Draft GmbH");
      expect(
        screen.getByRole("textbox", { name: /Kontaktperson/i }),
      ).toHaveValue("Anna Schmidt");
      expect(screen.getByRole("textbox", { name: /E-Mail/i })).toHaveValue(
        "anna@draft.de",
      );
    });
  });

  it("draft prop takes priority over localStorage", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        companyName: "From Storage",
        contactPerson: "Storage User",
        email: "storage@test.de",
      }),
    );

    const draft: Permit = {
      id: "EAR-TEST",
      userId: "user-001",
      companyName: "From Draft",
      contactPerson: "Draft User",
      email: "draft@test.de",
      status: "draft",
    };

    renderWizard(draft);

    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: /Unternehmensname/i }),
      ).toHaveValue("From Draft");
    });

    localStorage.removeItem(STORAGE_KEY);
  });

  it("loads from localStorage when no draft prop", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        companyName: "Saved GmbH",
        contactPerson: "Saved Person",
        email: "saved@test.de",
        facilityName: "",
        location: "",
        capacity: 0,
        hasPermit: false,
        documents: [],
      }),
    );

    renderWizard();

    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: /Unternehmensname/i }),
      ).toHaveValue("Saved GmbH");
    });

    localStorage.removeItem(STORAGE_KEY);
  });
});

describe("PermitWizard — submit", () => {
  beforeEach(() => {
    vi.spyOn(permitService, "createPermit").mockResolvedValue({
      id: "EAR-NEW",
      userId: "user-001",
      status: "submitted",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.removeItem(STORAGE_KEY);
  });

  async function navigateToLastStep() {
    await fillStep1();
    await clickWeiter();
    await waitFor(() => screen.getByText("Angaben zur Recyclinganlage"));
    await fillStep2();
    await clickWeiter();
    await waitFor(() => screen.getByText("Dokumente hochladen"));
    await fillStep3();
    await clickWeiter();
    await waitFor(() =>
      screen.getByRole("heading", { name: "Zusammenfassung" }),
    );
  }

  it("shows success popup after submit", async () => {
    renderWizard();
    await navigateToLastStep();
    await userEvent.click(
      screen.getByRole("button", { name: "Antrag absenden" }),
    );
    await waitFor(() => {
      expect(
        screen.getByText("Antrag wurde erfolgreich eingereicht."),
      ).toBeInTheDocument();
    });
  });

  it("resets form to step 1 after successful submit", async () => {
    renderWizard();
    await navigateToLastStep();
    await userEvent.click(
      screen.getByRole("button", { name: "Antrag absenden" }),
    );
    await waitFor(() => {
      expect(
        screen.getByText("Antrag wurde erfolgreich eingereicht."),
      ).toBeInTheDocument();
    });
    // close popup — form should be back on step 1 with empty fields
    await userEvent.click(screen.getByLabelText("Schließen"));
    await waitFor(() => {
      expect(
        screen.getByRole("textbox", { name: /Unternehmensname/i }),
      ).toHaveValue("");
    });
  });
});
