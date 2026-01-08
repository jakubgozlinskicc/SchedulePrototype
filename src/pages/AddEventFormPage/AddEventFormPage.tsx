import { useTranslation } from "react-i18next";
import { useEventFormSchema } from "../../events/form/EventForm/useEventForm/useEventFormSchema/useEventFormSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { useEventFormNavigation } from "../../events/form/EventForm/useEventForm/useEventFormNavigation/useEventFormNavigation";
import { useEventFormSubmit } from "../../events/form/EventForm/useEventForm/useEventFormSubmit/useEventFormSubmit";
import { eventRepository } from "../../db/eventRepository";
import { EventFormFields } from "../../events/form/EventForm/EventFormFields";
import { Button } from "../../components/Button/Button";
import "../../events/form/EventForm/eventForm.css";
import { toDateTimeLocal } from "../../utils/toDateTimeLocal/toDateTimeLocal";

export function AddEventFormPage() {
  const { t } = useTranslation();
  const { eventFormSchema } = useEventFormSchema();

  const methods = useForm({
    resolver: yupResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start: toDateTimeLocal(new Date()),
      end: toDateTimeLocal(new Date()),
      color: "#0000FF",
      recurrenceType: "none",
      recurrenceEndType: "never",
    },
  });

  const { handleCancel } = useEventFormNavigation();
  const { onSubmit } = useEventFormSubmit(eventRepository);

  return (
    <FormProvider {...methods}>
      <div className="event-form-page">
        <header className="event-form-header">
          <h1>{t("add_title")}</h1>
        </header>
        <div className="form-wrapper">
          <main className="form-content">
            <form
              onSubmit={methods.handleSubmit((data) => onSubmit(data))}
              className="event-form"
            >
              <EventFormFields />
              <div className="event-form-actions">
                <Button variant="secondary" onClick={handleCancel}>
                  <i className="fa-solid fa-xmark"></i>
                  {t("btn_cancel")}
                </Button>
                <Button variant="primary" type="submit">
                  <i className="fa-solid fa-calendar-plus"></i>
                  {t("btn-add")}
                </Button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </FormProvider>
  );
}
