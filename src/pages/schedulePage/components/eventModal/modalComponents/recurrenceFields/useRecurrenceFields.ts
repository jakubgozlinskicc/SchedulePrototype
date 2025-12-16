import { useMemo, type ComponentType } from "react";
import { EndTypeStrategyRegistry } from "./endTypeStrategies/endTypeStrategyRegistry";
import type { RecurrenceRule } from "../../../../recurrence/recurrenceTypes";
import type {
  EndType,
  EndTypeFieldProps,
  RecurrenceType,
} from "./recurrenceFieldsTypes";

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

  const strategy = useMemo(
    () => EndTypeStrategyRegistry.deriveFromRule(recurrenceRule),
    [recurrenceRule]
  );

  const endType = strategy.type;
  const EndTypeComponent = useMemo(() => strategy.getComponent(), [strategy]);

  return {
    recurrenceType,
    recurrenceInterval,
    recurrenceEndDate,
    recurrenceCount,
    endType,
    EndTypeComponent,
  };
};
