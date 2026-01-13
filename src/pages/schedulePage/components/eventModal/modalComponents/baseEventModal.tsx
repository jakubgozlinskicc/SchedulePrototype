import { FormProvider, useForm } from "react-hook-form";
import { useEventFormSchema } from "../../../../../events/form/EventForm/useEventForm/useEventFormSchema/useEventFormSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { toDateTimeLocal } from "../../../../../utils/toDateTimeLocal/toDateTimeLocal";
import { getRecurrenceDefaults } from "../../../../EditRecurringEventFormPage/getRecurrenceDefaults";
import { EventFormFields } from "../../../../../events/form/EventForm/EventFormFields";
import type { Event } from "../../../../../db/scheduleDb";
import type { EventFormData } from "../../../../../events/form/EventForm/eventFormSchema";
import { Modal } from "../../../../../components/Modal/Modal";

interface BaseEventModalProps {
  title: string;
  eventData?: Event;
  onSubmit: (data: EventFormData) => void | Promise<void>;
  children: React.ReactNode;
}

const getDefaultValues = (eventData?: Event) => {
  if (eventData) {
    return {
      title: eventData.title,
      description: eventData.description ?? "",
      start: toDateTimeLocal(eventData.start),
      end: toDateTimeLocal(eventData.end),
      color: eventData.color ?? "#0000FF",
      ...getRecurrenceDefaults(eventData),
    };
  }

  return {
    title: "",
    description: "",
    start: toDateTimeLocal(new Date()),
    end: toDateTimeLocal(new Date()),
    color: "#0000FF",
    recurrenceType: "none" as const,
    recurrenceInterval: 1,
    recurrenceEndType: "never" as const,
    recurrenceEndDate: undefined,
    recurrenceCount: undefined,
  };
};

export function BaseEventModal({
  title,
  eventData,
  onSubmit,
  children,
}: BaseEventModalProps) {
  const { eventFormSchema } = useEventFormSchema();

  const methods = useForm({
    resolver: yupResolver(eventFormSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: getDefaultValues(eventData),
  });

  return (
    <FormProvider {...methods}>
      <Modal className="modal">
        <h3 className="modal-title">{title}</h3>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="modal-form">
          <EventFormFields />
        </form>
        <div className="modal-actions">{children}</div>
      </Modal>
    </FormProvider>
  );
}
