import type { ComponentType } from "react";
import { EndTypeStrategyRegistry } from "./endTypeStrategies/endTypeStrategyRegistry";
import type {
  EndType,
  EndTypeFieldProps,
  RecurrenceType,
} from "./recurrenceFieldsTypes";
import type { RecurrenceRule } from "../../../../../../events/recurrence/recurrenceTypes";

interface UseRecurrenceFieldOptions {
  recurrenceRule?: RecurrenceRule;
}

interface UseRecurrenceFieldReturn {
  recurrenceType: RecurrenceType;
  recurrenceInterval: number;
  recurrenceEndDate?: Date;
  recurrenceCount?: number;
  endType: EndType;
  EndTypeComponent: ComponentType<EndTypeFieldProps> | null;
}

export const useRecurrenceField = ({
  recurrenceRule,
}: UseRecurrenceFieldOptions): UseRecurrenceFieldReturn => {
  const recurrenceType: RecurrenceType = recurrenceRule?.type ?? "none";
  const recurrenceInterval = recurrenceRule?.interval ?? 1;
  const recurrenceEndDate = recurrenceRule?.endDate;
  const recurrenceCount = recurrenceRule?.count;

  const strategy = EndTypeStrategyRegistry.deriveFromRule(recurrenceRule);

  const endType = strategy.type;
  const EndTypeComponent = strategy.getComponent();

  return {
    recurrenceType,
    recurrenceInterval,
    recurrenceEndDate,
    recurrenceCount,
    endType,
    EndTypeComponent,
  };
};
