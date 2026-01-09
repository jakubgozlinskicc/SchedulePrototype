import { addDays } from "date-fns";
import * as yup from "yup";
import type { RecurrenceType } from "../../recurrence/recurrenceTypes";

const recurrenceTypes: RecurrenceType[] = [
  "none",
  "daily",
  "weekly",
  "monthly",
  "yearly",
] as const;
const recurrenceEndTypes = ["never", "date", "count"] as const;

export const createEventFormSchema = (t: (key: string) => string) =>
  yup.object({
    title: yup
      .string()
      .required(t("title-required"))
      .min(3, t("title-min-length")),

    description: yup.string().defined().default(""),
    start: yup
      .string()
      .required(t("start-required"))
      .test("is-before-end", t("start-must-be-before-end"), function (value) {
        const { end } = this.parent;
        if (!value || !end) return true;
        return new Date(value) < new Date(end);
      }),

    end: yup
      .string()
      .required(t("end-required"))
      .test("is-after-start", t("end-must-be-after-start"), function (value) {
        const { start } = this.parent;
        if (!start || !value) return true;
        return new Date(value) > new Date(start);
      }),

    color: yup.string().defined().default("#0000FF"),

    recurrenceType: yup
      .string()
      .oneOf(recurrenceTypes)
      .defined()
      .default("none"),

    recurrenceEndType: yup
      .string()
      .oneOf(recurrenceEndTypes)
      .defined()
      .default("never"),

    recurrenceEndDate: yup
      .string()
      .nullable()
      .when(["recurrenceType", "recurrenceEndType"], {
        is: (type: string, endType: string) =>
          type !== "none" && endType === "date",
        then: (schema) =>
          schema
            .required(t("recurrence-end-date-required"))
            .test(
              "is-after-start",
              t("recurrence-end-date-must-be-two-days-after-start"),
              function (value) {
                const { start } = this.parent;
                if (!start || !value) return true;
                return new Date(value) > new Date(addDays(start, 1));
              }
            ),
        otherwise: (schema) => schema.optional(),
      }),

    recurrenceCount: yup
      .number()
      .nullable()
      .transform((val, orig) => (orig === "" ? undefined : val))
      .when(["recurrenceType", "recurrenceEndType"], {
        is: (type: string, endType: string) =>
          type !== "none" && endType === "count",
        then: (schema) =>
          schema
            .required(t("recurrence-count-required"))
            .min(2, t("recurrence-count-min"))
            .max(365, t("recurrence-count-max")),
        otherwise: (schema) => schema.optional(),
      }),
  });

export type EventFormData = yup.InferType<
  ReturnType<typeof createEventFormSchema>
>;
