import * as yup from "yup";

const recurrenceTypes = [
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
    start: yup.string().required(t("start-required")),
    end: yup.string().required(t("end-required")),
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
    recurrenceEndDate: yup.string().optional(),
    recurrenceCount: yup.number().optional(),
  });

const baseSchema = createEventFormSchema((key) => key);
export type EventFormData = yup.InferType<typeof baseSchema>;
