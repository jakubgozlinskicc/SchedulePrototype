import type { ComponentType } from "react";
import type {
  IEndTypeStrategy,
  EndTypeFieldProps,
  EndType,
  RecurrenceRule,
} from "../recurrenceFieldsTypes";
import { CountEndField } from "../components/CountEndField";

export class CountEndStrategy implements IEndTypeStrategy {
  readonly type: EndType = "count";

  canDeriveFrom(rule: RecurrenceRule | undefined): boolean {
    return !!rule?.count;
  }

  getComponent(): ComponentType<EndTypeFieldProps> {
    return CountEndField;
  }
}
