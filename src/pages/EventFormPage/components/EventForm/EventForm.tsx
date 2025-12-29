import { useTranslation } from "react-i18next";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEventDataContext } from "../../../../events/useEvents/useEventDataContext/useEventDataContext";
import { useEventFormSubmit } from "./useEventForm/useEventFormSubmit/useEventFormSubmit";
import { useEventFormNavigation } from "./useEventForm/useEventFormNavigation/useEventFormNavigation";
import { useEventFormDelete } from "./useEventForm/useEventFormDelete/useEventFormDelete";
import { toDateTimeLocal } from "../../../../utils/toDateTimeLocal/toDateTimeLocal";
import type { EventFormProps } from "../../eventFormTypes";
import { eventFormSchema } from "./eventFormSchema";
import { RecurrenceFields } from "../RecurrenceFields/RecurrenceFields";
import "./EventForm.css";
import { getRecurrenceDefaults } from "../getRecurrenceDefault";

export function EventForm({ title, children }: EventFormProps) {
  const { t } = useTranslation();

  const { eventData } = useEventDataContext();

  const methods = useForm({
    resolver: yupResolver(eventFormSchema),

    defaultValues: eventData
      ? {
          title: eventData.title,
          description: eventData.description ?? "",
          start: toDateTimeLocal(eventData.start),
          end: toDateTimeLocal(eventData.end),
          color: eventData.color ?? "#0000FF",
          ...getRecurrenceDefaults(eventData),
        }
      : {
          title: "",
          description: "",
          start: "",
          end: "",
          color: "#0000FF",
          recurrenceType: "none",
          recurrenceEndType: "never",
          recurrenceEndDate: undefined,
          recurrenceCount: undefined,
        },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const recurrenceType = useWatch({
    control,
    name: "recurrenceType",
  });

  const recurrenceEndType = useWatch({
    control,
    name: "recurrenceEndType",
  });

  const { handleCancel } = useEventFormNavigation();
  const { onSubmit } = useEventFormSubmit();
  const { handleDelete } = useEventFormDelete();
  return (
    <FormProvider {...methods}>
      <div className="event-form-page">
        <header className="event-form-header">
          <h1>{title}</h1>
        </header>

        <div className="form-wrapper">
          <main className="form-content">
            <form onSubmit={handleSubmit(onSubmit)} className="event-form">
              <div className="event-form-field">
                <label className="event-form-label">{t("title")}</label>
                <input
                  type="text"
                  {...register("title")}
                  className="event-form-input"
                />
                {errors.title?.message && (
                  <span className="event-form-error">
                    {t(errors.title.message)}
                  </span>
                )}
              </div>

              <div className="event-form-field">
                <label className="event-form-label">{t("description")}</label>
                <textarea
                  {...register("description")}
                  className="event-form-textarea"
                />
              </div>

              <div className="event-form-field">
                <label className="event-form-label">{t("start-date")}</label>
                <input
                  type="datetime-local"
                  {...register("start")}
                  className="event-form-input"
                />
                {errors.start?.message && (
                  <span className="event-form-error">
                    {t(errors.start.message)}
                  </span>
                )}
              </div>

              <div className="event-form-field">
                <label className="event-form-label">{t("end-date")}</label>
                <input
                  type="datetime-local"
                  {...register("end")}
                  className="event-form-input"
                />
                {errors.end?.message && (
                  <span className="event-form-error">
                    {t(errors.end.message)}
                  </span>
                )}
              </div>

              <div className="event-form-field">
                <label className="event-form-label">{t("color")}</label>
                <input
                  type="color"
                  {...register("color")}
                  className="event-form-color-picker"
                />
              </div>

              <div className="event-form-field">
                <label className="event-form-label">
                  {t("recurrence-type")}
                </label>
                <select
                  {...register("recurrenceType")}
                  className="event-form-input"
                >
                  <option value="none">{t("recurrence-none")}</option>
                  <option value="daily">{t("recurrence-daily")}</option>
                  <option value="weekly">{t("recurrence-weekly")}</option>
                  <option value="monthly">{t("recurrence-monthly")}</option>
                  <option value="yearly">{t("recurrence-yearly")}</option>
                </select>
              </div>

              {recurrenceType !== "none" && (
                <RecurrenceFields recurrenceEndType={recurrenceEndType} />
              )}

              <div className="event-form-actions">
                {children({ handleCancel, handleDelete })}
              </div>
            </form>
          </main>
        </div>
      </div>
    </FormProvider>
  );
}
