import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEventFormSchema } from "../../events/form/EventForm/useEventForm/useEventFormSchema/useEventFormSchema";
import { useEventLoader } from "./useEventLoader";
import { FormProvider, useForm } from "react-hook-form";
import { toDateTimeLocal } from "../../utils/toDateTimeLocal/toDateTimeLocal";
import { getRecurrenceDefaults } from "../EditRecurringEventFormPage/getRecurrenceDefault";
import { useEventFormNavigation } from "../../events/form/EventForm/useEventForm/useEventFormNavigation/useEventFormNavigation";
import { useEventFormSubmit } from "../../events/form/EventForm/useEventForm/useEventFormSubmit/useEventFormSubmit";
import { eventRepository } from "../../db/eventRepository";
import { Button } from "../../components/Button/Button";
import { EventFormFields } from "../../events/form/EventForm/EventFormFields";
import { useEventFormDelete } from "../../events/form/EventForm/useEventForm/useEventFormDelete/useEventFormDelete";
import { useEffect } from "react";

export function EditEventFormPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { eventFormSchema } = useEventFormSchema();

  const eventId = id ? parseInt(id, 10) : undefined;
  const { event, loading } = useEventLoader(eventId, eventRepository);

  const methods = useForm({
    resolver: yupResolver(eventFormSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      start: "",
      end: "",
      color: "#0000FF",
      recurrenceType: "none",
      recurrenceEndType: "never",
    },
  });

  const { handleCancel } = useEventFormNavigation();
  const { handleDelete } = useEventFormDelete(
    eventRepository,
    loading ? undefined : event
  );
  const { onSubmit } = useEventFormSubmit(
    eventRepository,
    loading ? undefined : event
  );

  useEffect(() => {
    if (event && !loading) {
      methods.reset({
        title: event.title,
        description: event.description ?? "",
        start: toDateTimeLocal(event.start),
        end: toDateTimeLocal(event.end),
        color: event.color ?? "#0000FF",
        ...getRecurrenceDefaults(event),
      });
    }
  }, [event, loading, methods]);

  if (loading) return <div>{t("loading")}</div>;
  if (!event) return <div>{t("error-event-not-found")}</div>;

  return (
    <FormProvider {...methods}>
      <div className="event-form-page">
        <header className="event-form-header">
          <h1>{t("edit_title")}</h1>
        </header>
        <div className="form-wrapper">
          <main className="form-content">
            <form
              onSubmit={methods.handleSubmit((data) => onSubmit(data))}
              className="event-form"
            >
              <EventFormFields />
              <div className="event-form-actions">
                <Button
                  variant="danger"
                  type="button"
                  onClick={() => handleDelete(false)}
                >
                  <i className="fa-solid fa-trash-can"></i>
                  {t("btn_delete")}
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleCancel}
                >
                  <i className="fa-solid fa-xmark"></i>
                  {t("btn_cancel")}
                </Button>
                <Button variant="primary" type="submit">
                  <i className="fa-solid fa-floppy-disk"></i>
                  {t("btn_save_changes")}
                </Button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </FormProvider>
  );
}
