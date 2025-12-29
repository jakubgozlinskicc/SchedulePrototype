import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEventDataContext } from "../../../../events/useEvents/useEventDataContext/useEventDataContext";
import { useEventFormSubmit } from "./useEventForm/useEventFormSubmit/useEventFormSubmit";
import { useEventFormNavigation } from "./useEventForm/useEventFormNavigation/useEventFormNavigation";
import { useEventFormDelete } from "./useEventForm/useEventFormDelete/useEventFormDelete";
import { toDateTimeLocal } from "../../../../utils/toDateTimeLocal/toDateTimeLocal";
import type { EventFormProps } from "../../eventFormTypes";
import "./EventForm.css";
import { eventFormSchema, type EventFormData } from "./eventFormSchema";

export function EventForm({ title, children }: EventFormProps) {
  const { t } = useTranslation();
  const { eventData } = useEventDataContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: yupResolver(eventFormSchema),
    defaultValues: eventData
      ? {
          title: eventData.title,
          description: eventData.description ?? "",
          start: toDateTimeLocal(eventData.start),
          end: toDateTimeLocal(eventData.end),
          color: eventData.color ?? "#0000FF",
        }
      : {
          title: "",
          description: "",
          start: "",
          end: "",
          color: "#0000FF",
        },
  });

  const { handleCancel } = useEventFormNavigation();
  const { onSubmit } = useEventFormSubmit();
  const { handleDelete } = useEventFormDelete();

  return (
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

            <div className="event-form-actions">
              {children({ handleCancel, handleDelete })}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
