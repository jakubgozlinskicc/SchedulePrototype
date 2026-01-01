import { useTranslation } from "react-i18next";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEventDataContext } from "../../../../events/useEvents/useEventDataContext/useEventDataContext";
import { useEventFormSubmit } from "./useEventForm/useEventFormSubmit/useEventFormSubmit";
import { useEventFormNavigation } from "./useEventForm/useEventFormNavigation/useEventFormNavigation";
import { useEventFormDelete } from "./useEventForm/useEventFormDelete/useEventFormDelete";
import { toDateTimeLocal } from "../../../../utils/toDateTimeLocal/toDateTimeLocal";
import type { EventFormProps } from "../../eventFormTypes";
import { RecurrenceFields } from "../RecurrenceFields/RecurrenceFields";
import "./EventForm.css";
import { getRecurrenceDefaults } from "../getRecurrenceDefault";
import { useEventFormSchema } from "./useEventForm/useEventFormSchema/useEventFormSchema";

export function EventForm({ title, children }: EventFormProps) {
  const { t } = useTranslation();
  const { eventFormSchema } = useEventFormSchema();
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
          recurrenceType: "none" as const,
          recurrenceEndType: "never" as const,
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
          <h1>
            {title}
            <i
              className="fa-solid fa-calendar-plus"
              style={{ marginLeft: "8px" }}
            ></i>
          </h1>
        </header>

        <div className="form-wrapper">
          <main className="form-content">
            <form onSubmit={handleSubmit(onSubmit)} className="event-form">
              <div className="event-form-field">
                <label className="event-form-label">
                  <i
                    className="fa-solid fa-pen-to-square"
                    style={{ marginRight: "8px" }}
                  ></i>
                  {t("title")}
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className="event-form-input"
                />
                {errors.title?.message && (
                  <span className="event-form-error">
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div className="event-form-field">
                <label className="event-form-label">
                  <i
                    className="fa-solid fa-bars-staggered"
                    style={{ marginRight: "8px" }}
                  ></i>
                  {t("description")}
                </label>
                <textarea
                  {...register("description")}
                  className="event-form-textarea"
                />
              </div>

              <div className="event-form-field">
                <label className="event-form-label">
                  <i
                    className="fa-solid fa-hourglass-start"
                    style={{ marginRight: "8px" }}
                  ></i>
                  {t("start-date")}
                </label>
                <input
                  type="datetime-local"
                  {...register("start")}
                  className="event-form-input"
                />
                {errors.start?.message && (
                  <span className="event-form-error">
                    {errors.start.message}
                  </span>
                )}
              </div>

              <div className="event-form-field">
                <label className="event-form-label">
                  <i
                    className="fa-solid fa-hourglass-end"
                    style={{ marginRight: "8px" }}
                  ></i>
                  {t("end-date")}
                </label>
                <input
                  type="datetime-local"
                  {...register("end")}
                  className="event-form-input"
                />
                {errors.end?.message && (
                  <span className="event-form-error">{errors.end.message}</span>
                )}
              </div>

              <div className="event-form-field">
                <label className="event-form-label">
                  <i
                    className="fa-solid fa-palette"
                    style={{ marginRight: "8px" }}
                  ></i>
                  {t("color")}
                </label>
                <input
                  type="color"
                  {...register("color")}
                  className="event-form-color-picker"
                />
              </div>

              <div className="event-form-field">
                <label className="event-form-label">
                  <i
                    className="fa-solid fa-repeat"
                    style={{ marginRight: "8px" }}
                  ></i>
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
