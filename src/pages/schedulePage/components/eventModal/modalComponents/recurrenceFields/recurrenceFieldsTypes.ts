import type { ChangeEvent, ComponentType } from "react";
import type {
  RecurrenceType,
  RecurrenceRule,
} from "../../../../recurrence/recurrenceTypes";

export type EndType = "never" | "date" | "count";

export type { RecurrenceType, RecurrenceRule };

export interface EndTypeFieldProps {
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  recurrenceEndDate?: Date;
  recurrenceCount?: number;
}

export interface IEndTypeStrategy {
  type: EndType;
  canDeriveFrom: (rule: RecurrenceRule | undefined) => boolean;
  getComponent: () => ComponentType<EndTypeFieldProps> | null;
}

export interface RecurrenceFieldsProps {
  recurrenceRule?: RecurrenceRule;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}
