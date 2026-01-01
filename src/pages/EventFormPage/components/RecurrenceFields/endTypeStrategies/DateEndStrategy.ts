import type { ComponentType } from "react";
import type { IEndTypeStrategy, EndType } from "../RecurrenceFieldsTypes";
import { DateEndField } from "../components/DateEndField";

export class DateEndStrategy implements IEndTypeStrategy {
  readonly type: EndType = "date";

  canDeriveFrom(rule: { endDate?: string } | undefined): boolean {
    return !!rule?.endDate;
  }

  getComponent(): ComponentType {
    return DateEndField;
  }
}
