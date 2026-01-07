import type { ComponentType } from "react";
import type { IEndTypeStrategy, EndType } from "../recurrenceFieldsTypes";

export class NeverEndStrategy implements IEndTypeStrategy {
  readonly type: EndType = "never";

  canDeriveFrom(): boolean {
    return true;
  }

  getComponent(): ComponentType | null {
    return null;
  }
}
