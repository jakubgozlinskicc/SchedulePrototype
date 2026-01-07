import { useTranslation } from "react-i18next";
import { useEventFormSchema } from "../../events/form/EventForm/useEventForm/useEventFormSchema/useEventFormSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEventFormNavigation } from "../../events/form/EventForm/useEventForm/useEventFormNavigation/useEventFormNavigation";
import { useEventFormSubmit } from "../../events/form/EventForm/useEventForm/useEventFormSubmit/useEventFormSubmit";
import { useEventFormDelete } from "../../events/form/EventForm/useEventForm/useEventFormDelete/useEventFormDelete";

export function AddEventFormPage() {
  const { t } = useTranslation();
  const { eventFormSchema } = useEventFormSchema();

  const methods = useForm({
    resolver: yupResolver(eventFormSchema),
    defaultValues: {
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
  const { onSubmit } = useEventFormSubmit(eventRepository);
  const { handleDelete } = useEventFormDelete(eventRepository);
}
