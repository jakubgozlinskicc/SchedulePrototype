import type { ComponentType } from "react";
import type {
  IEndTypeStrategy,
  EndTypeFieldProps,
  EndType,
} from "../recurrenceFieldsTypes";

export class NeverEndStrategy implements IEndTypeStrategy {
  readonly type: EndType = "never";

  canDeriveFrom() {
    return true;
  }

  getComponent(): ComponentType<EndTypeFieldProps> | null {
    return null;
  }
}
