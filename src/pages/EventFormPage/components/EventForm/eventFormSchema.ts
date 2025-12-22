import * as yup from "yup";

export const eventFormSchema = yup.object({
  title: yup.string().required("title-required").min(3, "title-min-length"),

  description: yup.string().default(""),

  start: yup.string().required("start-required"),

  end: yup.string().required("end-required"),

  color: yup.string().default("#0000FF"),
});

export type EventFormData = yup.InferType<typeof eventFormSchema>;
