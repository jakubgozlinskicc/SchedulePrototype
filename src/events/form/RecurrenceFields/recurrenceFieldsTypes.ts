import type { ComponentType } from "react";

export type EndType = "never" | "date" | "count";

export interface IEndTypeStrategy {
  type: EndType;
  canDeriveFrom: (
    rule: { endDate?: string; count?: number } | undefined
  ) => boolean;
  getComponent: () => ComponentType | null;
}
