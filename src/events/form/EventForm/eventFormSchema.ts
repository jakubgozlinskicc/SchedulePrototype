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

const getEventDurationInDays = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getIntervalInDays = (interval: number, type: RecurrenceType): number => {
  switch (type) {
    case "daily":
      return interval;
    case "weekly":
      return interval * 7;
    case "monthly":
      return interval * 28;
    case "yearly":
      return interval * 365;
    default:
      return interval;
  }
};

export const createEventFormSchema = (t: (key: string) => string) =>
  yup.object({
    title: yup
      .string()
      .required(t("title-required"))
      .trim()
      .min(3, t("title-min-length"))
      .max(100, t("title-max-length")),

    description: yup.string().defined().default(""),
    start: yup.string().required(t("start-required")),

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

    recurrenceInterval: yup
      .number()
      .transform((val, orig) => (orig === "" ? undefined : val))
      .when("recurrenceType", {
        is: (type: string) => type !== "none",
        then: (schema) =>
          schema
            .required(t("recurrence-interval-required"))
            .min(1, t("recurrence-interval-min"))
            .max(100, t("recurrence-interval-max"))
            .test(
              "interval-covers-event-duration",
              t("recurrence-interval-too-short"),
              function (value) {
                const { start, end, recurrenceType } = this.parent;
                if (!start || !end || !value || recurrenceType === "none") {
                  return true;
                }
                const durationDays = getEventDurationInDays(start, end);
                if (durationDays <= 1) {
                  return true;
                }
                const intervalInDays = getIntervalInDays(
                  value,
                  recurrenceType as RecurrenceType,
                );
                return intervalInDays >= durationDays;
              },
            ),
        otherwise: (schema) => schema.optional().default(1),
      }),

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
              t("recurrence-end-date-must-be-after-start"),
              function (value) {
                const { start } = this.parent;
                if (!start || !value) return true;
                return new Date(value) > new Date(start);
              },
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
