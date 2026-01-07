import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEventDataContext } from "../../../../events/useEvents/useEventDataContext/useEventDataContext";
import { useEventFormSubmit } from "../../../../events/form/EventForm/useEventForm/useEventFormSubmit/useEventFormSubmit";
import { useEventFormNavigation } from "../../../../events/form/EventForm/useEventForm/useEventFormNavigation/useEventFormNavigation";
import { useEventFormDelete } from "../../../../events/form/EventForm/useEventForm/useEventFormDelete/useEventFormDelete";
import { toDateTimeLocal } from "../../../../utils/toDateTimeLocal/toDateTimeLocal";
import { getRecurrenceDefaults } from "../getRecurrenceDefault";
import { useEventFormSchema } from "../../../../events/form/EventForm/useEventForm/useEventFormSchema/useEventFormSchema";
import { eventRepository } from "../../../../db/eventRepository";
import type { EventFormProps } from "../../eventFormTypes";
import "./EventForm.css";
import { EventFormFields } from "../../../../events/form/EventForm/EventFormFields";

export function EventForm({ title, children }: EventFormProps) {
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
          recurrenceType: "none",
          recurrenceEndType: "never",
        },
  });

  const { handleCancel } = useEventFormNavigation();
  const { onSubmit } = useEventFormSubmit(eventRepository);
  const { handleDelete } = useEventFormDelete(eventRepository);

  return (
    <FormProvider {...methods}>
      <div className="event-form-page">
        <header className="event-form-header">
          <h1>
            {title}{" "}
            <i
              className="fa-solid fa-calendar-plus"
              style={{ marginLeft: "8px" }}
            ></i>
          </h1>
        </header>

        <div className="form-wrapper">
          <main className="form-content">
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="event-form"
            >
              <EventFormFields />

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
