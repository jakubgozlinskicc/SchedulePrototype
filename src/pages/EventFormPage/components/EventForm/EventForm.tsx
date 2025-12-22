import { useTranslation } from "react-i18next";
import { useEventFormSetup } from "./useEventForm/useEventFormSetup/useEventFormSetup";
import { useLoadEvent } from "./useEventForm/useLoadEvent/useLoadEvent";
import { useEventFormSubmit } from "./useEventForm/useEventFormSubmit/useEventFormSubmit";
import { useEventFormNavigation } from "./useEventForm/useEventFormNavigation/useEventFormNavigation";
import { useEventFormDelete } from "./useEventForm/useEventFormDelete/useEventFormDelete";
import type { ReactNode } from "react";
import "./EventForm.css";

interface EventFormRenderProps {
  handleCancel: () => void;
  handleDelete: () => void;
}

interface EventFormProps {
  eventId?: number;
  title: string;
  children: (props: EventFormRenderProps) => ReactNode;
}

export function EventForm({ eventId, title, children }: EventFormProps) {
  const { t } = useTranslation();

  const { register, handleSubmit, reset, errors } = useEventFormSetup();
  const { isLoading } = useLoadEvent({ eventId, reset });
  const { goToOverview, handleCancel } = useEventFormNavigation();
  const { onSubmit } = useEventFormSubmit({ eventId, onSuccess: goToOverview });
  const { handleDelete } = useEventFormDelete({
    eventId,
    onSuccess: goToOverview,
  });

  if (isLoading) {
    return <div className="event-form-loading">{t("loading")}</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="event-form">
      <h2 className="event-form-title">{title}</h2>

      <div className="event-form-field">
        <label className="event-form-label">{t("title")}</label>
        <input
          type="text"
          {...register("title")}
          className="event-form-input"
        />
        {errors.title?.message && (
          <span className="event-form-error">{t(errors.title.message)}</span>
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
          <span className="event-form-error">{t(errors.start.message)}</span>
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
          <span className="event-form-error">{t(errors.end.message)}</span>
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
  );
}
