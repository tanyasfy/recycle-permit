import type { Permit, PermitStatus } from "./permit.types";
import { permitMockData } from "./permitMockData";

let permits = [...permitMockData];

export const permitService = {
  async getPermitsByUserId(userId: string): Promise<Permit[]> {
    return Promise.resolve(
      permits.filter((permit) => permit.userId === userId),
    );
  },

  async getPermitById(id: string): Promise<Permit | undefined> {
    return Promise.resolve(permits.find((permit) => permit.id === id));
  },

  async createPermit(
    permit: Omit<Permit, "id" | "submittedAt" | "status">,
    permitStatus?: PermitStatus,
  ): Promise<Permit> {
    const newPermit: Permit = {
      ...permit,
      id: `EAR-2026-${String(permits.length + 1).padStart(3, "0")}`,
      submittedAt: new Date().toISOString(),
      status: permitStatus ?? "submitted",
    };

    permits = [newPermit, ...permits];

    return Promise.resolve(newPermit);
  },

  async deletePermit(id: string): Promise<void> {
    permits = permits.filter((p) => p.id !== id);
    return Promise.resolve();
  },

  async getDraftCount(userId: string): Promise<number> {
    return Promise.resolve(
      permits.filter((p) => p.userId === userId && p.status === "draft").length,
    );
  },
};
