import type { ComponentType } from "react";
import type {
  IEndTypeStrategy,
  EndTypeFieldProps,
  EndType,
  RecurrenceRule,
} from "../recurrenceFieldsTypes";
import { DateEndField } from "../components/DateEndField";

export class DateEndStrategy implements IEndTypeStrategy {
  readonly type: EndType = "date";

  canDeriveFrom(rule: RecurrenceRule | undefined): boolean {
    return !!rule?.endDate;
  }

  getComponent(): ComponentType<EndTypeFieldProps> {
    return DateEndField;
  }
}
