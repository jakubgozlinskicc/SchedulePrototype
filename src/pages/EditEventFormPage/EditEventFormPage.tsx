import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEventFormSchema } from "../../events/form/EventForm/useEventForm/useEventFormSchema/useEventFormSchema";
import { useEventLoader } from "./useEventLoader";
import { FormProvider, useForm } from "react-hook-form";
import { toDateTimeLocal } from "../../utils/toDateTimeLocal/toDateTimeLocal";
import { getRecurrenceDefaults } from "../EventFormPage/components/getRecurrenceDefault";
import { useEventFormNavigation } from "../../events/form/EventForm/useEventForm/useEventFormNavigation/useEventFormNavigation";
import { useEventFormSubmit } from "../../events/form/EventForm/useEventForm/useEventFormSubmit/useEventFormSubmit";
import { eventRepository } from "../../db/eventRepository";
import { Button } from "../../components/Button/Button";
import { EventFormFields } from "../../events/form/EventForm/EventFormFields";
import type { Event } from "../../db/scheduleDb";

export function EditEventFormPage() {
  const { id } = useParams();
  const { t } = useTranslation();

  const eventId = id ? parseInt(id, 10) : undefined;
  const { event } = useEventLoader(eventId);

  if (!event) {
    return <div>{t("loading") || "Loading..."}</div>;
  }

  return <EditEventFormPageContent event={event} />;
}

function EditEventFormPageContent({ event }: { event: Event }) {
  const { t } = useTranslation();
  const { eventFormSchema } = useEventFormSchema();
  const { handleCancel } = useEventFormNavigation();

  const methods = useForm({
    resolver: yupResolver(eventFormSchema),
    defaultValues: {
      title: event.title,
      description: event.description ?? "",
      start: toDateTimeLocal(event.start),
      end: toDateTimeLocal(event.end),
      color: event.color,
      ...getRecurrenceDefaults(event),
    },
  });

  const { onSubmit } = useEventFormSubmit(eventRepository, { event });

  return (
    <FormProvider {...methods}>
      <div className="event-form-page">
        <header className="event-form-header">
          <h1>{t("edit-title")}</h1>
        </header>
        <div className="form-wrapper">
          <main className="form-content">
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="event-form"
            >
              <EventFormFields />
              <div className="event-form-actions">
                <Button variant="secondary" onClick={handleCancel}>
                  <i className="fa-solid fa-xmark"></i>
                  {t("btn_cancel")}
                </Button>
                <Button variant="primary" type="submit">
                  <i className="fa-solid fa-floppy-disk"></i>
                  {t("btn_save") || t("btn-add")}
                </Button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </FormProvider>
  );
}
