import * as yup from "yup";

export const eventFormSchema = yup.object({
  title: yup.string().required("title-required").min(3, "title-min-length"),
  description: yup.string().defined().default(""),
  start: yup.string().required("start-required"),
  end: yup.string().required("end-required"),
  color: yup.string().defined().default("#0000FF"),
  recurrenceType: yup
    .string()
    .oneOf(["none", "daily", "weekly", "monthly", "yearly"] as const)
    .defined()
    .default("none"),
  recurrenceEndType: yup
    .string()
    .oneOf(["never", "date", "count"] as const)
    .defined()
    .default("never"),
  recurrenceEndDate: yup.string().notRequired(),
  recurrenceCount: yup.number().notRequired(),
});

export type EventFormData = yup.InferType<typeof eventFormSchema>;
